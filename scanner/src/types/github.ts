export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  updated_at: string;
}

export interface TransformedRepository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  isPrivate: boolean;
  updatedAt: string;
}

export interface GitHubRepoMetadata {
  name: string;
  fullName: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  defaultBranch: string;
  contributorsCount: number;
  totalCommits: number;
  recentCommits: {
    sha: string;
    message: string;
    author: string;
    date: string;
  }[];
  url: string;
  isPrivate: boolean;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
  openIssuesCount: number;
}
