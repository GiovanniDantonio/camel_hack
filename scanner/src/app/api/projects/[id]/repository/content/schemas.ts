export type RepositoryContentSuccessResponse = {
  name: string;
  path: string;
  size: number;
  content: string;
  sha: string;
  url: string | null;
  download_url: string | null;
  encoding: string;
  type: string;
};

export type RepositoryContentErrorResponse = {
  error: string;
};

export type RepositoryContentResponse =
  | RepositoryContentSuccessResponse
  | RepositoryContentErrorResponse;

export interface GetRepositoryContentParams {
  projectId: string;
  path: string;
  branch?: string;
  commit?: string;
}
