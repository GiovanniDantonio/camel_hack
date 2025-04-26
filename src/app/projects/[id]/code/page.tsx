'use client';

import { useEffect, useState } from 'react';
import {
  Calendar,
  Code,
  ExternalLink,
  GitBranch,
  GitFork,
  Star,
  GitCommit,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface RepositoryData {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  default_branch: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  stars: number;
  forks: number;
  open_issues: number;
  watchers: number;
  license?: {
    name: string;
    spdx_id: string;
  };
  private: boolean;
  branches: {
    name: string;
    is_default: boolean;
    commits: {
      sha: string;
      message: string;
      author: string;
      date: string;
    }[];
  }[];
}

interface ProjectData {
  id: string;
  name: string;
  repository_full_name: string;
  repository_id: number;
  repository_name: string;
  repository_description: string | null;
  repository_is_private: boolean;
}

interface ApiResponse {
  project: ProjectData;
  repository: RepositoryData;
}

interface BranchDebugInfo {
  name: string;
  isDefault: boolean;
  hasCommits: boolean;
  commitCount: number;
  firstCommitSample: {
    sha: string;
    message: string;
    author: string;
    date: string;
  } | null;
}

interface DebugInfo {
  status?: number;
  statusText?: string;
  url?: string;
  errorData?: Record<string, unknown>;
  totalBranches?: number;
  branchesDetails?: BranchDebugInfo[];
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {/* Repository Header Skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-5 w-full" />
        <div className="flex flex-wrap gap-4 items-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              <Skeleton className="h-4 w-4 mr-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Branches Card Skeleton */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6 space-y-4">
          <Skeleton className="h-6 w-24" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between py-1 border-b">
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="pl-6 space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="space-y-1">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CodePage() {
  const params = useParams();
  const projectId = params.id as string;
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const commitsPerPage = 10;

  // Fetch both project and repository data from our API endpoint
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/projects/${projectId}/repository`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: `HTTP error ${response.status}` }));
          setDebugInfo({
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            errorData,
          });
          throw new Error(
            errorData.error ||
              `Failed to fetch data: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log('API response:', data);
        setData(data);

        // Save detailed debug info about branches
        if (data?.repository?.branches) {
          // Set the default branch as the selected branch
          const defaultBranch = data.repository.branches.find(
            (b: RepositoryData['branches'][0]) => b.is_default
          );
          if (defaultBranch) {
            setSelectedBranch(defaultBranch.name);
          } else if (data.repository.branches.length > 0) {
            setSelectedBranch(data.repository.branches[0].name);
          }

          const branchesInfo = data.repository.branches.map(
            (branch: RepositoryData['branches'][0]) => ({
              name: branch.name,
              isDefault: branch.is_default,
              hasCommits: Boolean(branch.commits),
              commitCount: branch.commits?.length || 0,
              firstCommitSample: branch.commits?.[0] || null,
            })
          );

          setDebugInfo({
            totalBranches: data.repository.branches.length,
            branchesDetails: branchesInfo,
          });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [projectId]);

  const repositoryData = data?.repository;

  // Get the currently selected branch data
  const currentBranch = repositoryData?.branches?.find(
    (branch) => branch.name === selectedBranch
  );

  // Calculate pagination for commits
  const totalCommits = currentBranch?.commits?.length || 0;
  const totalPages = Math.ceil(totalCommits / commitsPerPage);

  // Get current page of commits
  const currentCommits = currentBranch?.commits?.slice(
    (currentPage - 1) * commitsPerPage,
    currentPage * commitsPerPage
  );

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-destructive bg-destructive/10 p-6">
            <p className="text-destructive">{error}</p>
          </div>
          {debugInfo && (
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">Debug Information</h3>
              <pre className="text-xs overflow-auto p-2 bg-muted rounded">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : repositoryData ? (
        <div className="space-y-6">
          {/* Repository Header - Moved outside of card */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">
                {repositoryData.full_name}
                {repositoryData.private && (
                  <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                    Private
                  </span>
                )}
              </h1>
              <Button variant="outline" asChild>
                <a
                  href={repositoryData.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on GitHub
                </a>
              </Button>
            </div>

            <p className="text-muted-foreground">
              {repositoryData.description || 'No description provided.'}
            </p>

            <div className="flex flex-wrap gap-4 items-center text-sm">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                <span>{repositoryData.stars.toLocaleString()} stars</span>
              </div>
              <div className="flex items-center">
                <GitFork className="h-4 w-4 mr-1 text-blue-500" />
                <span>{repositoryData.forks.toLocaleString()} forks</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                <span>
                  Updated{' '}
                  {formatDistanceToNow(parseISO(repositoryData.pushed_at))} ago
                </span>
              </div>
              <div className="flex items-center">
                <GitBranch className="h-4 w-4 mr-1 text-green-500" />
                <span>Default branch: {repositoryData.default_branch}</span>
              </div>
              {repositoryData.license && (
                <div className="flex items-center">
                  <Code className="h-4 w-4 mr-1 text-purple-500" />
                  <span>{repositoryData.license.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Branches Card */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <GitBranch className="h-5 w-5 mr-2 text-green-500" />
                  Branch Commits
                </h3>

                <div className="flex items-center gap-2">
                  {repositoryData.branches &&
                    repositoryData.branches.length > 0 && (
                      <Badge variant="outline" className="mr-2">
                        {repositoryData.branches.length}{' '}
                        {repositoryData.branches.length === 1
                          ? 'branch'
                          : 'branches'}
                      </Badge>
                    )}

                  <Select
                    value={selectedBranch || undefined}
                    onValueChange={setSelectedBranch}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {repositoryData.branches?.map((branch) => (
                        <SelectItem key={branch.name} value={branch.name}>
                          <div className="flex items-center">
                            <span>{branch.name}</span>
                            {branch.is_default && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                                default
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {!currentBranch ? (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <GitBranch className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    No branch selected. Please select a branch from the
                    dropdown.
                  </p>
                </div>
              ) : !currentBranch.commits ||
                currentBranch.commits.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <GitCommit className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    No commits available for this branch.
                  </p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableCaption>
                      {totalCommits > commitsPerPage
                        ? `Showing ${
                            (currentPage - 1) * commitsPerPage + 1
                          }-${Math.min(
                            currentPage * commitsPerPage,
                            totalCommits
                          )} of ${totalCommits} commits on ${
                            currentBranch.name
                          } branch`
                        : `${totalCommits} commits on ${currentBranch.name} branch`}
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Commit</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentCommits?.map((commit) => (
                        <TableRow key={commit.sha}>
                          <TableCell className="font-mono font-medium">
                            {commit.sha}
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate">
                            {commit.message}
                          </TableCell>
                          <TableCell>{commit.author}</TableCell>
                          <TableCell className="text-right">
                            {format(new Date(commit.date), 'MMM d, yyyy')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between py-4">
                      <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePrevPage}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Debug Information */}
          {debugInfo && (
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">Debug Information</h3>
              <pre className="text-xs overflow-auto p-2 bg-muted rounded">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
