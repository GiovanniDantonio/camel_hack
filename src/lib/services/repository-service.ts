import { Octokit } from '@octokit/rest';

export interface RepositoryBranchInfo {
  name: string;
  is_default: boolean;
}

export async function getRepositoryBranches(
  repositoryUrl: string
): Promise<RepositoryBranchInfo[]> {
  try {
    // Extract owner and repo from repository URL
    const [owner, repo] = repositoryUrl.split('/').slice(-2);

    // Initialize Octokit with GitHub token from environment
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    // Get repository info to find default branch
    const { data: repoInfo } = await octokit.repos.get({
      owner,
      repo,
    });

    // Fetch branches from GitHub API
    const { data: branches } = await octokit.repos.listBranches({
      owner,
      repo,
      per_page: 100, // Maximum number of branches to fetch
    });

    // Return branch names with default branch info
    return branches.map((branch) => ({
      name: branch.name,
      is_default: branch.name === repoInfo.default_branch,
    }));
  } catch (error) {
    console.error('Error fetching repository branches:', error);
    throw new Error('Failed to fetch repository branches');
  }
}
