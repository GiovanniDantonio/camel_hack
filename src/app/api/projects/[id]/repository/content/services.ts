import {
  GetRepositoryContentParams,
  RepositoryContentSuccessResponse,
} from "./schemas";
import { getOctokitRepo } from "@/lib/octokit/octokit";

export async function getFileContent({
  projectId,
  path,
  branch,
  commit,
}: GetRepositoryContentParams): Promise<RepositoryContentSuccessResponse> {
  const { octokit, repoFullName } = await getOctokitRepo(projectId);

  // Extract owner and repo from the full name
  const [owner, repo] = repoFullName.split("/");

  try {
    // Attempt to fetch by commit ref first; if 404, retry with branch
    let response;
    try {
      if (commit) {
        response = await octokit.repos.getContent({
          owner,
          repo,
          path,
          ref: commit,
        });
      } else {
        response = await octokit.repos.getContent({
          owner,
          repo,
          path,
          ref: branch || undefined,
        });
      }
    } catch (err: any) {
      if (commit && err?.status === 404) {
        console.warn(
          `[repository/content] Commit ref "${commit}" not found for ${path}. Falling back to branch "${branch ?? 'default'}"`,
        );
        response = await octokit.repos.getContent({
          owner,
          repo,
          path,
          ref: branch || undefined,
        });
      } else {
        throw err;
      }
    }

    const content = response.data;

    // Check if we got a file or a directory
    if (Array.isArray(content)) {
      throw new Error("Path points to a directory, not a file");
    }

    // For file content
    if ("content" in content) {
      // Decode base64 content
      const fileContent = Buffer.from(content.content, "base64").toString(
        "utf-8",
      );

      return {
        name: content.name,
        path: content.path,
        size: content.size,
        content: fileContent,
        sha: content.sha,
        url: content.html_url,
        download_url: content.download_url,
        encoding: content.encoding,
        type: content.type,
      };
    } else {
      throw new Error("Content is not available");
    }
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
