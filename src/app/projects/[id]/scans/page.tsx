'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, formatDistanceToNow } from 'date-fns';
import { Database } from '@/types/database.types';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/supabase/client';

// UI Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Play,
  RefreshCw,
  Search,
  Shield,
  Loader2,
  MoreHorizontal,
  ShieldCheck,
  FileCode,
  LoaderCircle,
  Ban,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Type definition for scans from database
type ScanRow = Database['public']['Tables']['scans']['Row'];

export default function ScansPage() {
  const params = useParams();
  const projectId = params.id as string;
  const router = useRouter();
  const { toast } = useToast();

  // State variables
  const [scans, setScans] = useState<ScanRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewScanDialog, setShowNewScanDialog] = useState(false);
  const [scanType, setScanType] = useState<'full' | 'incremental' | 'targeted'>(
    'full'
  );
  const [isCreatingScan, setIsCreatingScan] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [cancelingScanId, setCancelingScanId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchScans();

    // Set up real-time subscription for scans changes
    const supabase = createClient();

    const subscription = supabase
      .channel('scans-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scans',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          console.log('Scan change received:', payload);

          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            setScans((prevScans) => [payload.new as ScanRow, ...prevScans]);
          } else if (payload.eventType === 'UPDATE') {
            setScans((prevScans) =>
              prevScans.map((scan) =>
                scan.id === payload.new.id ? (payload.new as ScanRow) : scan
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setScans((prevScans) =>
              prevScans.filter((scan) => scan.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [projectId]);

  // Function to fetch scans
  const fetchScans = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${projectId}/scans`);

      if (!response.ok) {
        throw new Error(`Failed to fetch scans: ${response.status}`);
      }

      const data = await response.json();
      setScans(data);
    } catch (error) {
      console.error('Error fetching scans:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to fetch scans'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle creating a new scan
  const handleCreateScan = async () => {
    setIsCreatingScan(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/scans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scan_type: scanType,
          target_components: scanType === 'targeted' ? ['src'] : [],
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to create scan: ${response.status} ${response.statusText}`
        );
      }

      const newScan = await response.json();

      // Add the new scan to our list
      setScans((prev) => [newScan, ...prev]);
      setShowNewScanDialog(false);

      // Show success message (implement toast notifications later)
      console.log('Scan initiated successfully');
    } catch (err) {
      console.error('Error creating scan:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while creating the scan'
      );
    } finally {
      setIsCreatingScan(false);
    }
  };

  // Filter scans based on search query and status filter
  const filteredScans = scans.filter((scan) => {
    // Status filter
    if (filterStatus !== 'all' && scan.status !== filterStatus) {
      return false;
    }

    // Search query filter (search by scan type, status, or id)
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        scan.scan_type?.toLowerCase().includes(searchLower) ||
        scan.status.toLowerCase().includes(searchLower) ||
        scan.id.toLowerCase().includes(searchLower) ||
        (scan.result_summary &&
          scan.result_summary.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredScans.length / pageSize);
  const paginatedScans = filteredScans.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset to first page when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  // Helper function to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';

    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Helper function to get elapsed time
  const getElapsedTime = (startDate: string | null, endDate: string | null) => {
    if (!startDate) return 'N/A';

    try {
      const start = new Date(startDate).getTime();
      const end = endDate ? new Date(endDate).getTime() : Date.now();
      const elapsed = end - start;

      // Format as minutes:seconds if less than an hour, or hours:minutes otherwise
      if (elapsed < 3600000) {
        return `${Math.floor(elapsed / 60000)}m ${Math.floor(
          (elapsed % 60000) / 1000
        )}s`;
      } else {
        return `${Math.floor(elapsed / 3600000)}h ${Math.floor(
          (elapsed % 3600000) / 60000
        )}m`;
      }
    } catch (error) {
      console.error('Error calculating elapsed time:', error);
      return 'Unknown';
    }
  };

  // Get status badge with appropriate color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'queued':
      case 'pending':
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 dark:bg-gray-800/50 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700 whitespace-nowrap"
          >
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'running':
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 whitespace-nowrap"
          >
            <LoaderCircle className="h-3 w-3 mr-1 animate-spin" />
            Running
          </Badge>
        );
      case 'completed':
        return (
          <Badge
            variant="outline"
            className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800 whitespace-nowrap"
          >
            <ShieldCheck className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'failed':
        return (
          <Badge
            variant="outline"
            className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800 whitespace-nowrap"
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case 'canceled':
        return (
          <Badge
            variant="outline"
            className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800 whitespace-nowrap"
          >
            <XCircle className="h-3 w-3 mr-1" />
            Canceled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="whitespace-nowrap">
            {status}
          </Badge>
        );
    }
  };

  // Get risk score element with appropriate color
  const getRiskScore = (score: number | null) => {
    if (score === null) return <span className="text-gray-500">--</span>;

    let textColor = 'text-gray-500';
    if (score > 75) textColor = 'text-red-500';
    else if (score > 50) textColor = 'text-orange-500';
    else if (score > 25) textColor = 'text-yellow-500';
    else if (score >= 0) textColor = 'text-green-500';

    return <span className={`font-medium ${textColor}`}>{score}</span>;
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-500" />;
      case 'canceled':
        return <XCircle className="h-5 w-5 text-orange-500" />;
      default:
        return null;
    }
  };

  // Get a styled scan type badge
  const getScanTypeBadge = (type: string | null) => {
    if (!type) return null;

    switch (type) {
      case 'full':
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800"
          >
            <Shield className="h-3 w-3 mr-1" />
            Full Scan
          </Badge>
        );
      case 'incremental':
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800"
          >
            <FileCode className="h-3 w-3 mr-1" />
            Incremental
          </Badge>
        );
      case 'targeted':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800"
          >
            <Search className="h-3 w-3 mr-1" />
            Targeted
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  // Navigate to scan details page
  const viewScanDetails = (scanId: string) => {
    router.push(`/projects/${projectId}/scans/${scanId}`);
  };

  // Navigate to create new scan page
  const goToNewScan = () => {
    router.push(`/projects/${projectId}/scans/new`);
  };

  // Add function to handle scan cancellation
  const handleCancelScan = async (scanId: string) => {
    try {
      setCancelingScanId(scanId);

      const response = await fetch(
        `/api/projects/${projectId}/scans/${scanId}/cancel`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to cancel scan: ${response.status}`);
      }

      toast({
        title: 'Scan canceled',
        description: 'The scan has been canceled successfully.',
      });

      // Refresh scans
      fetchScans();
    } catch (error) {
      console.error('Error canceling scan:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to cancel scan',
        variant: 'destructive',
      });
    } finally {
      setCancelingScanId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Security Scans</h1>
        <Button onClick={goToNewScan}>
          <Shield className="h-4 w-4 mr-2" />
          New Scan
        </Button>
      </div>

      {/* New Scan Dialog */}
      <Dialog open={showNewScanDialog} onOpenChange={setShowNewScanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start New Security Scan</DialogTitle>
            <DialogDescription>
              Choose the type of security scan to run on your project.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Select
                value={scanType}
                onValueChange={(value: 'full' | 'incremental' | 'targeted') =>
                  setScanType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select scan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Scan (All Files)</SelectItem>
                  <SelectItem value="incremental">
                    Incremental Scan (Changed Files)
                  </SelectItem>
                  <SelectItem value="targeted">
                    Targeted Scan (Specific Components)
                  </SelectItem>
                </SelectContent>
              </Select>

              <p className="text-sm text-muted-foreground">
                {scanType === 'full' &&
                  'Scans all files in the repository. Most comprehensive but slower.'}
                {scanType === 'incremental' &&
                  'Only scans files that have changed since the last scan. Faster for frequent checks.'}
                {scanType === 'targeted' &&
                  'Scans specific components or directories. Select target components below.'}
              </p>
            </div>

            {scanType === 'targeted' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Components</label>
                <Input
                  placeholder="e.g., src/components,src/pages"
                  disabled={isCreatingScan}
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated list of directories or files to scan.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewScanDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateScan} disabled={isCreatingScan}>
              {isCreatingScan ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Starting Scan...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Scan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search scans..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Scans Table */}
      <Card>
        {isLoading ? (
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-24" />
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex justify-between items-center py-4 border-b"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-red-500">
              Error Loading Scans
            </p>
            <p className="text-muted-foreground mt-1">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        ) : filteredScans.length === 0 ? (
          <div className="p-8 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No Scans Found</p>
            <p className="text-muted-foreground mt-1">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Run your first security scan to identify vulnerabilities in your project.'}
            </p>
            <Button className="mt-4" onClick={goToNewScan}>
              <Play className="h-4 w-4 mr-2" />
              Run First Scan
            </Button>
          </div>
        ) : (
          <Table>
            <TableCaption>
              {filteredScans.length} scan{filteredScans.length !== 1 ? 's' : ''}{' '}
              found
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Branch / Commit</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Results</TableHead>
                <TableHead className="text-right">Risk Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedScans.map((scan) => (
                <TableRow
                  key={scan.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => viewScanDetails(scan.id)}
                >
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(scan.status)}
                      {getStatusBadge(scan.status)}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex flex-col">
                      <span>{formatDate(scan.created_at)}</span>
                      <span className="text-xs text-muted-foreground">
                        {scan.created_at &&
                          formatDistanceToNow(new Date(scan.created_at), {
                            addSuffix: true,
                          })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {getScanTypeBadge(scan.scan_type)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex flex-col">
                      {scan.branch && (
                        <span className="font-medium">{scan.branch}</span>
                      )}
                      {scan.commit_hash && (
                        <span className="text-xs font-mono text-muted-foreground">
                          {scan.commit_hash.substring(0, 7)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {scan.status === 'running' ? (
                      <div className="flex flex-col gap-1">
                        <span>
                          {scan.started_at
                            ? getElapsedTime(scan.started_at, scan.updated_at)
                            : 'Starting...'}
                        </span>
                        <Progress
                          value={scan.progress_percentage || 0}
                          className="h-2"
                        />
                      </div>
                    ) : scan.status === 'completed' ||
                      scan.status === 'failed' ||
                      scan.status === 'canceled' ? (
                      <span>
                        {scan.started_at && scan.updated_at
                          ? getElapsedTime(scan.started_at, scan.updated_at)
                          : 'Unknown'}
                      </span>
                    ) : (
                      <span>Waiting...</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {scan.vulnerabilities_found !== null
                        ? `${scan.vulnerabilities_found} vulnerabilities`
                        : scan.status === 'running'
                        ? 'Scanning...'
                        : 'Unknown'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {scan.status === 'completed' ? (
                      getRiskScore(scan.risk_score)
                    ) : scan.status === 'running' ? (
                      <span className="text-muted-foreground">
                        Calculating...
                      </span>
                    ) : (
                      <span className="text-muted-foreground">--</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => viewScanDetails(scan.id)}
                        >
                          <FileCode className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>

                        {(scan.status === 'pending' ||
                          scan.status === 'running') && (
                          <DropdownMenuItem
                            onClick={() => handleCancelScan(scan.id)}
                            disabled={cancelingScanId === scan.id}
                            className="text-destructive focus:text-destructive"
                          >
                            {cancelingScanId === scan.id ? (
                              <>
                                <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                                Canceling...
                              </>
                            ) : (
                              <>
                                <Ban className="h-4 w-4 mr-2" />
                                Cancel Scan
                              </>
                            )}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Pagination Controls */}
      {!isLoading && !error && filteredScans.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredScans.length)} of{' '}
            {filteredScans.length} scans
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Display page numbers around the current page
                let pageNum;
                if (totalPages <= 5) {
                  // If 5 or fewer pages, show all
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  // If near the start
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  // If near the end
                  pageNum = totalPages - 4 + i;
                } else {
                  // In the middle
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>

            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(parseInt(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[110px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
