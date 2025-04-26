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
    // Get repository content based on path, branch/commit
    const response = commit
      ? await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: commit,
      })
      : await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: branch || undefined,
      });

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
