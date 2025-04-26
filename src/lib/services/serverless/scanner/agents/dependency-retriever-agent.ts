import { getFileContent } from "@/app/api/projects/[id]/repository/content/services";
import { getOctokitRepo } from "@/lib/octokit/octokit";

/**
 * Gets the immediate parent files of a given file in a repository.
 * This function looks at the file's imports and returns all files
 * that match those imports.
 *
 * @param projectId - Project ID in Supabase
 * @param branch - Branch to scan
 * @param commit - Commit to scan
 * @param path - Path of the target file
 * @returns An array of paths to files that match the imports
 */
export async function getParentFiles(
  projectId: string,
  branch: string,
  commit: string,
  path: string,
): Promise<string[]> {
  const { octokit, repoFullName } = await getOctokitRepo(projectId);

  try {
    // Get the target file's content
    const fileContent = await getFileContent({
      projectId,
      path,
      branch,
      commit,
    });

    if (!fileContent.content) {
      throw new Error("File content not found");
    }

    // Parse imports from the file content
    const importPatterns = [
      // JavaScript/TypeScript - Handle both named and default imports
      /import\s+(?:\*\s+as\s+\w+\s+from\s+['"]([^'"]+)['"]|{[^}]+}\s+from\s+['"]([^'"]+)['"]|[\w*]+\s+from\s+['"]([^'"]+)['"]|['"]([^'"]+)['"])/g,
      /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g, // CommonJS
    ];

    // Map to track imports with their full paths and directories
    const imports = new Map<string, { fullPath: string; directory: string }>();

    // Get the current directory for relative imports
    const currentDir = path.split("/").slice(0, -1).join("/");

    for (const pattern of importPatterns) {
      let match;
      while ((match = pattern.exec(fileContent.content)) !== null) {
        // Clean up the import path - use the first non-null capture group
        const originalPath = (match[1] || match[2] || match[3] || match[4])
          .trim();
        let importPath = originalPath;

        // Handle relative imports
        if (importPath.startsWith("./") || importPath.startsWith("../")) {
          importPath = `${currentDir}/${importPath}`.replace(/\/\.\//g, "/")
            .replace(/\/[^\/]+\/\.\.\//g, "/");
        }

        // Remove any query parameters or fragments
        importPath = importPath.split("?")[0].split("#")[0];

        // Skip external imports (node_modules and built-ins)
        if (
          importPath.includes("node_modules") ||
          !(importPath.startsWith(".") || importPath.startsWith("/") ||
            importPath.includes("/"))
        ) {
          continue;
        }

        // Get import directory and name
        const importParts = importPath.split("/");
        const importName = importParts.pop()?.split(".")[0] || "";
        const importDir = importParts.join("/");

        // Save the import with its normalized path and directory
        imports.set(importName, {
          fullPath: importPath,
          directory: importDir,
        });
      }
    }

    // If no imports found, return empty array
    if (imports.size === 0) {
      return [];
    }

    // Search the repository for files matching the imports
    const parentFiles: string[] = [];
    const searchQuery = Array.from(imports.keys())
      .map((name) => `filename:${name}`)
      .join(" OR ");

    const { data: searchResults } = await octokit.search.code({
      q: `repo:${repoFullName} ${searchQuery}`,
    });

    // Filter results to only include files that match the import paths
    for (const item of searchResults.items) {
      const filePath = item.path;
      const filePathParts = filePath.split("/");
      const fileName = filePathParts.pop() || "";
      const fileBaseName = fileName.split(".")[0];
      const fileDir = filePathParts.join("/");

      // Check if file matches any of our imports
      for (const [importName, importData] of imports.entries()) {
        if (fileBaseName !== importName) continue;

        // Calculate directory match score (higher is better)
        let score = 0;

        // Exact directory match is best
        if (fileDir === importData.directory) {
          score = 100;
        } // If import has no directory but is in the same directory as the importing file
        else if (!importData.directory && fileDir === currentDir) {
          score = 90;
        } // If directories have some common parts
        else if (
          importData.directory && fileDir.includes(importData.directory)
        ) {
          score = 70;
        } else if (
          importData.directory && importData.directory.includes(fileDir)
        ) {
          score = 60;
        } // Default match just on filename
        else {
          score = 10;
        }

        // For same-directory imports (like "./utils"), the directory match is critical
        if (
          importData.fullPath.startsWith("./") && fileDir !== currentDir &&
          score < 90
        ) {
          continue;
        }

        if (score >= 50) {
          parentFiles.push(filePath);
        }
      }
    }

    // Post-processing: remove duplicates
    const uniqueFiles = [...new Set(parentFiles)];
    return uniqueFiles;
  } catch (error: unknown) {
    // Handle specific errors from GitHub API
    if (
      error && typeof error === "object" && "status" in error &&
      error.status === 404
    ) {
      throw new Error("File not found in repository");
    }

    throw error;
  }
}
