'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpDown,
  Calendar,
  CheckCircle,
  Download,
  ExternalLink,
  FileCode,
  Info,
  Loader2,
  MoreHorizontal,
  Search,
  Shield,
  ShieldCheck,
  ShieldX,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ResolveVulnerabilityModal } from '@/components/vulnerabilities/ResolveVulnerabilityModal';
import { VulnerabilityDetailsModal } from '@/components/vulnerabilities/VulnerabilityDetailsModal';
import { ExportReportButton } from '@/components/vulnerabilities/ExportReportButton';
import Link from 'next/link';

// Type definition for vulnerabilities from the database
type VulnerabilityRow = Database['public']['Tables']['vulnerabilities']['Row'];

// Define the expanded vulnerability type with scans information
type VulnerabilityWithScans = VulnerabilityRow & {
  scans: {
    id: string;
    scan_type: string | null;
    status: string;
    created_at: string;
    completed_at: string | null;
    branch: string | null;
    commit_hash: string | null;
  };
};

export default function VulnerabilitiesPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = params.id as string;
  const selectedVulnerabilityId = searchParams.get('vulnerabilityId');

  const [vulnerabilities, setVulnerabilities] = useState<
    VulnerabilityWithScans[]
  >([]);
  const [filteredVulnerabilities, setFilteredVulnerabilities] = useState<
    VulnerabilityWithScans[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] =
    useState<keyof VulnerabilityRow>('severity');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selectedVulnerability, setSelectedVulnerability] = useState<string | null>(null);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('');
  const [detailsVulnerability, setDetailsVulnerability] = useState<VulnerabilityWithScans | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    // Initialize Supabase client
    const supabase = createClient();

    // Fetch vulnerabilities for this project
    const fetchVulnerabilities = async () => {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from('vulnerabilities')
          .select(
            '*, scans(id, scan_type, status, created_at, completed_at, branch, commit_hash)'
          )
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the data to match our expected type
        const typedData = (data || []) as VulnerabilityWithScans[];

        setVulnerabilities(typedData);
        setFilteredVulnerabilities(typedData);

        // If there's a selected vulnerability ID from the URL, find and scroll to it
        if (selectedVulnerabilityId) {
          const selectedVuln = typedData.find(
            (v) => v.id === selectedVulnerabilityId
          );
          if (selectedVuln) {
            setTimeout(() => {
              const element = document.getElementById(
                `vulnerability-${selectedVulnerabilityId}`
              );
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('bg-primary/10');
                setTimeout(() => {
                  element.classList.remove('bg-primary/10');
                }, 2000);
              }
            }, 300);
          }
        }
      } catch (err) {
        console.error('Error fetching vulnerabilities:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch vulnerabilities'
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchVulnerabilities();

    // Set up real-time subscription
    const subscription = supabase
      .channel('vulnerabilities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vulnerabilities',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          console.log('Change received:', payload);

          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            // Fetch the complete row with scan data
            supabase
              .from('vulnerabilities')
              .select(
                '*, scans(id, scan_type, status, created_at, completed_at, branch, commit_hash)'
              )
              .eq('id', payload.new.id)
              .single()
              .then(({ data }) => {
                if (data) {
                  setVulnerabilities((prevVulns) => [
                    data as VulnerabilityWithScans,
                    ...prevVulns,
                  ]);
                }
              });
          } else if (payload.eventType === 'UPDATE') {
            // Update the existing vulnerability
            supabase
              .from('vulnerabilities')
              .select(
                '*, scans(id, scan_type, status, created_at, completed_at, branch, commit_hash)'
              )
              .eq('id', payload.new.id)
              .single()
              .then(({ data }) => {
                if (data) {
                  setVulnerabilities((prevVulns) =>
                    prevVulns.map((vuln) =>
                      vuln.id === payload.new.id
                        ? (data as VulnerabilityWithScans)
                        : vuln
                    )
                  );
                }
              });
          } else if (payload.eventType === 'DELETE') {
            setVulnerabilities((prevVulns) =>
              prevVulns.filter((vuln) => vuln.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscription when component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [projectId, selectedVulnerabilityId]);

  // Handle search input
  useEffect(() => {
    if (!searchQuery) {
      setFilteredVulnerabilities(vulnerabilities);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = vulnerabilities.filter(
      (vuln) =>
        vuln.title?.toLowerCase().includes(lowerQuery) ||
        vuln.file_path?.toLowerCase().includes(lowerQuery) ||
        vuln.severity?.toLowerCase().includes(lowerQuery) ||
        vuln.status?.toLowerCase().includes(lowerQuery) ||
        vuln.scans?.branch?.toLowerCase().includes(lowerQuery)
    );

    setFilteredVulnerabilities(filtered);
  }, [searchQuery, vulnerabilities]);

  // Handle sorting
  const handleSort = (column: keyof VulnerabilityRow) => {
    const newDirection =
      sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);

    const sorted = [...filteredVulnerabilities].sort((a, b) => {
      // Special case for severity
      if (column === 'severity') {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const aValue =
          severityOrder[a.severity as keyof typeof severityOrder] || 0;
        const bValue =
          severityOrder[b.severity as keyof typeof severityOrder] || 0;
        return newDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Special case for status
      if (column === 'status') {
        const statusOrder = {
          open: 0,
          in_progress: 1,
          resolved: 2,
          false_positive: 3,
        };
        const aValue = statusOrder[a.status as keyof typeof statusOrder] || 0;
        const bValue = statusOrder[b.status as keyof typeof statusOrder] || 0;
        return newDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // General case
      const aValue = String(a[column] || '');
      const bValue = String(b[column] || '');
      return newDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    setFilteredVulnerabilities(sorted);
  };

  // Helper to get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <Badge className="bg-red-500 text-white">
            <AlertCircle className="h-3 w-3 mr-1" />
            Critical
          </Badge>
        );
      case 'high':
        return (
          <Badge className="bg-orange-500 text-white">
            <AlertTriangle className="h-3 w-3 mr-1" />
            High
          </Badge>
        );
      case 'medium':
        return (
          <Badge className="bg-yellow-500 text-black">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Medium
          </Badge>
        );
      case 'low':
        return (
          <Badge className="bg-blue-500 text-white">
            <Shield className="h-3 w-3 mr-1" />
            Low
          </Badge>
        );
      default:
        return <Badge>{severity}</Badge>;
    }
  };

  // Helper to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-300"
          >
            Open
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-300"
          >
            In Progress
          </Badge>
        );
      case 'resolved':
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300"
          >
            Resolved
          </Badge>
        );
      case 'false_positive':
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 border-gray-300"
          >
            False Positive
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Helper to get verification badge
  const getVerificationBadge = (verified: boolean | null, count: number | null) => {
    if (verified) {
      return (
        <Badge className="bg-green-500 text-white">
          <ShieldCheck className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    } else if (count && count > 0) {
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
          <ShieldX className="h-3 w-3 mr-1" />
          Unverified
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="border-gray-400 text-gray-400">
          <Shield className="h-3 w-3 mr-1" />
          Unchecked
        </Badge>
      );
    }
  };

  // Helper function to format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';

    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  // Navigate to vulnerability details
  const handleViewDetails = (vulnerability: VulnerabilityWithScans) => {
    setDetailsVulnerability(vulnerability);
    setIsDetailsModalOpen(true);
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredVulnerabilities.length / pageSize);
  const paginatedVulnerabilities = filteredVulnerabilities.slice(
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

  const handleResolveClick = (vulnerabilityId: string, status: string) => {
    setSelectedVulnerability(vulnerabilityId);
    setCurrentStatus(status);
    setIsResolveModalOpen(true);
  };

  const handleVulnerabilityUpdated = () => {
    // Refresh the page data
    router.refresh();
  };

  const handleResolveFromDetails = () => {
    if (detailsVulnerability) {
      setSelectedVulnerability(detailsVulnerability.id);
      setCurrentStatus(detailsVulnerability.status);
      setIsDetailsModalOpen(false);
      setIsResolveModalOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Vulnerabilities</h1>
          <p className="text-muted-foreground">
            {isLoading
              ? 'Loading...'
              : `${filteredVulnerabilities.length} vulnerabilities found across all scans`}
          </p>
        </div>
        <div className="flex space-x-2">
          <ExportReportButton projectId={projectId} />
          <Button asChild>
            <Link href={`/projects/${projectId}/scan`}>Run New Scan</Link>
          </Button>
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vulnerabilities..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      ) : filteredVulnerabilities.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Vulnerabilities Found</CardTitle>
            <CardDescription>
              {searchQuery
                ? 'No vulnerabilities match your search criteria.'
                : 'No vulnerabilities have been detected across all scans.'}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">
                  <Button
                    variant="ghost"
                    className="p-0 hover:bg-transparent"
                    onClick={() => handleSort('severity')}
                  >
                    Severity
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 hover:bg-transparent text-left"
                    onClick={() => handleSort('title')}
                  >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <Button
                    variant="ghost"
                    className="p-0 hover:bg-transparent text-left"
                    onClick={() => handleSort('file_path')}
                  >
                    Location
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell w-[150px]">
                  <Button
                    variant="ghost"
                    className="p-0 hover:bg-transparent"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="hidden lg:table-cell w-[100px]">
                  <Button
                    variant="ghost"
                    className="p-0 hover:bg-transparent"
                    onClick={() => handleSort('verified_by_attack')}
                  >
                    Verified
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="hidden lg:table-cell w-[150px]">
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    Found In
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="hidden lg:table-cell w-[120px]">
                  <Button
                    variant="ghost"
                    className="p-0 hover:bg-transparent"
                    onClick={() => handleSort('created_at')}
                  >
                    Date Found
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVulnerabilities.map((vulnerability) => (
                <TableRow
                  key={vulnerability.id}
                  id={`vulnerability-${vulnerability.id}`}
                  className={`cursor-pointer transition-colors ${
                    selectedVulnerabilityId === vulnerability.id
                      ? 'bg-muted'
                      : ''
                  }`}
                  onClick={() => handleViewDetails(vulnerability)}
                >
                  <TableCell>
                    {getSeverityBadge(vulnerability.severity || '')}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <div>{vulnerability.title}</div>
                      {vulnerability.verified_by_attack && (
                        <div className="md:hidden mt-1">
                          {getVerificationBadge(vulnerability.verified_by_attack, vulnerability.attack_verification_count)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <FileCode className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate max-w-[200px]">
                        {vulnerability.file_path}
                        {vulnerability.line_start && (
                          <span className="font-mono ml-1">
                            :{vulnerability.line_start}
                          </span>
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getStatusBadge(vulnerability.status || '')}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {getVerificationBadge(vulnerability.verified_by_attack, vulnerability.attack_verification_count)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium">
                        {vulnerability.scans.scan_type || 'Unknown'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {vulnerability.scans.branch || 'Unknown'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(vulnerability.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(vulnerability);
                          }}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/projects/${projectId}/scans/${vulnerability.scan_id}`
                            );
                          }}
                        >
                          View Scan
                        </DropdownMenuItem>
                        {vulnerability.status !== 'resolved' && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResolveClick(vulnerability.id, vulnerability.status);
                            }}
                          >
                            Mark as Resolved
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Pagination Controls */}
      {!isLoading && !error && filteredVulnerabilities.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredVulnerabilities.length)}{' '}
            of {filteredVulnerabilities.length} vulnerabilities
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

      {/* Resolve Modal */}
      {selectedVulnerability && (
        <ResolveVulnerabilityModal
          isOpen={isResolveModalOpen}
          onClose={() => setIsResolveModalOpen(false)}
          vulnerabilityId={selectedVulnerability}
          projectId={projectId}
          currentStatus={currentStatus}
          onVulnerabilityUpdated={handleVulnerabilityUpdated}
        />
      )}

      {/* Details Modal */}
      {detailsVulnerability && (
        <VulnerabilityDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          vulnerability={detailsVulnerability}
          onResolveClick={handleResolveFromDetails}
        />
      )}
    </div>
  );
}
