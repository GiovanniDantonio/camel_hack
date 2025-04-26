'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Clock,
  LoaderCircle,
  ShieldCheck,
  AlertCircle,
  ChevronLeft,
  Loader2,
  Ban,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ScanData {
  id: string;
  project_id: string;
  scan_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  vulnerability_types: string[];
  branch: string;
  commit_hash: string | null;
  files_scanned: number;
  triggered_by: string;
  vulnerabilities_found: number;
  progress?: number;
  is_mock?: boolean;
  execution_logs?: string;
  result_summary?: string;
  risk_score?: number;
}

export default function ScanDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const scanId = params.scanId as string;
  const { toast } = useToast();

  const [scan, setScan] = useState<ScanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  // Function to fetch scan data
  const fetchScanData = async () => {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/scans/${scanId}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch scan: ${response.status}`);
      }

      const data = await response.json();
      setScan(data);
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error('Error fetching scan:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to fetch scan data'
      );
      setIsLoading(false);
      return null;
    }
  };

  useEffect(() => {
    // Initialize Supabase client
    const supabase = createClient();

    // Initial fetch
    fetchScanData();

    // Set up real-time subscription for this specific scan
    const subscription = supabase
      .channel(`scan-${scanId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'scans',
          filter: `id=eq.${scanId}`,
        },
        (payload) => {
          console.log('Scan update received:', payload);

          // Update the scan data with the new values
          if (payload.new) {
            setScan(payload.new as ScanData);
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [scanId, projectId]);

  const getScanTypeName = (type: string) => {
    switch (type) {
      case 'full':
        return 'Full Scan';
      case 'incremental':
        return 'Incremental Scan';
      case 'targeted':
        return 'Targeted Scan';
      default:
        return type;
    }
  };

  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'queued':
      case 'pending':
        return {
          label: 'Pending',
          color: 'bg-gray-100 text-gray-800',
          icon: <Clock className="h-4 w-4" />,
        };
      case 'running':
        return {
          label: 'Running',
          color: 'bg-blue-100 text-blue-800',
          icon: <LoaderCircle className="h-4 w-4 animate-spin" />,
        };
      case 'completed':
        return {
          label: 'Completed',
          color: 'bg-green-100 text-green-800',
          icon: <ShieldCheck className="h-4 w-4" />,
        };
      case 'failed':
        return {
          label: 'Failed',
          color: 'bg-red-100 text-red-800',
          icon: <AlertCircle className="h-4 w-4" />,
        };
      case 'canceled':
        return {
          label: 'Canceled',
          color: 'bg-orange-100 text-orange-800',
          icon: <XCircle className="h-4 w-4" />,
        };
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-800',
          icon: null,
        };
    }
  };

  const handleRetryScan = async () => {
    try {
      setIsLoading(true);

      // Call API to restart the scan
      const response = await fetch(
        `/api/projects/${projectId}/scans/${scanId}/retry`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to restart scan: ${response.status}`);
      }

      const data = await response.json();
      console.log('Scan retry initiated:', data);

      // Show toast to confirm retry instead of waiting for data
      toast({
        title: 'Scan retry initiated',
        description: 'A new scan has been started with the same parameters.',
      });

      // Navigate back to scans list to see the new scan
      router.push(`/projects/${projectId}/scans`);
    } catch (error) {
      console.error('Error restarting scan:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to restart scan'
      );
      setIsLoading(false);
    }
  };

  // Add a new function to handle scan cancellation
  const handleCancelScan = async () => {
    if (!scan) return;

    setIsCanceling(true);
    try {
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

      // Fetch updated scan data
      fetchScanData();
    } catch (error) {
      console.error('Error canceling scan:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to cancel scan',
        variant: 'destructive',
      });
    } finally {
      setIsCanceling(false);
      setIsCancelDialogOpen(false);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => router.push(`/projects/${projectId}/scans`)}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to scans</span>
        </Button>

        {/* Add cancel button for in-progress scans */}
        {scan && (scan.status === 'pending' || scan.status === 'running') && (
          <Button
            variant="outline"
            onClick={() => setIsCancelDialogOpen(true)}
            className="text-destructive border-destructive hover:bg-destructive/10"
          >
            <Ban className="h-4 w-4 mr-2" />
            Cancel Scan
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="p-6 bg-destructive/10 rounded-lg border border-destructive text-destructive">
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p>{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setError(null);
              setIsLoading(true);
              fetchScanData();
            }}
          >
            Retry
          </Button>
        </div>
      ) : scan ? (
        <div className="space-y-6">
          {scan.is_mock && (
            <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md text-sm flex items-center mb-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              This is mock data for UI demonstration purposes.
            </div>
          )}

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Scan Overview</CardTitle>
                {scan.status && (
                  <Badge className={`${getStatusDetails(scan.status).color}`}>
                    <span className="flex items-center">
                      {getStatusDetails(scan.status).icon}
                      <span className="ml-1">
                        {getStatusDetails(scan.status).label}
                      </span>
                    </span>
                  </Badge>
                )}
              </div>
              <CardDescription>
                {scan.scan_type &&
                  `${getScanTypeName(scan.scan_type)} initiated on ${new Date(
                    scan.created_at
                  ).toLocaleString()}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Scan ID</p>
                  <p className="font-medium">{scan.id}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Branch</p>
                  <p className="font-medium">{scan.branch}</p>
                </div>

                {scan.commit_hash && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Commit</p>
                    <p className="font-medium font-mono">
                      {scan.commit_hash.substring(0, 7)}
                    </p>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Files Scanned</p>
                  <p className="font-medium">{scan.files_scanned}</p>
                </div>

                {scan.completed_at && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Completed At
                    </p>
                    <p className="font-medium">
                      {new Date(scan.completed_at).toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Vulnerabilities Found
                  </p>
                  <p className="font-medium">{scan.vulnerabilities_found}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Triggered By</p>
                  <p className="font-medium">{scan.triggered_by}</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Vulnerability Types
                </p>
                <div className="flex flex-wrap gap-2">
                  {scan.vulnerability_types?.map((type) => (
                    <Badge key={type} variant="outline">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scan Results</CardTitle>
              <CardDescription>
                {scan.status === 'queued'
                  ? 'Scan is waiting to start...'
                  : scan.status === 'running'
                  ? 'Scan is currently in progress...'
                  : scan.status === 'completed'
                  ? `${scan.vulnerabilities_found} vulnerabilities detected`
                  : 'No results available yet'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scan.status === 'queued' ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p>Your scan is queued and will start soon...</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    We&apos;ll notify you when the scan begins
                  </p>
                </div>
              ) : scan.status === 'running' ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <LoaderCircle className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p>Analyzing your code for security vulnerabilities...</p>

                  {typeof scan.progress === 'number' && (
                    <div className="w-full max-w-md mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{scan.progress}% complete</span>
                        <span>
                          ETA: ~{Math.ceil((100 - scan.progress) / 10)} min
                        </span>
                      </div>
                      <Progress value={scan.progress} className="h-2" />
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground mt-4">
                    This may take a few minutes depending on repository size
                  </p>
                </div>
              ) : scan.status === 'completed' ? (
                <div>
                  {scan.vulnerabilities_found > 0 ? (
                    <div className="space-y-4">
                      <p>
                        Detected {scan.vulnerabilities_found} vulnerabilities in
                        your code.
                      </p>

                      {/* Mock vulnerability summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                        <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-md border border-red-200 dark:border-red-800">
                          <p className="font-medium text-red-800 dark:text-red-300">
                            Critical
                          </p>
                          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {Math.floor(scan.vulnerabilities_found / 3)}
                          </p>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/30 p-3 rounded-md border border-orange-200 dark:border-orange-800">
                          <p className="font-medium text-orange-800 dark:text-orange-300">
                            High
                          </p>
                          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {Math.ceil(scan.vulnerabilities_found / 3)}
                          </p>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-md border border-yellow-200 dark:border-yellow-800">
                          <p className="font-medium text-yellow-800 dark:text-yellow-300">
                            Medium
                          </p>
                          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                            {Math.floor(scan.vulnerabilities_found / 2)}
                          </p>
                        </div>
                      </div>

                      {/* Add Risk Score Card */}
                      {scan.risk_score !== undefined && (
                        <div className="mt-4">
                          <h3 className="text-sm font-medium mb-2">
                            Risk Score
                          </h3>
                          <div className="bg-muted/20 p-4 rounded-md border">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Low Risk</span>
                              <span className="text-sm">High Risk</span>
                            </div>
                            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                              <div
                                className={`h-4 absolute left-0 top-0 rounded-full ${
                                  scan.risk_score < 33
                                    ? 'bg-green-500'
                                    : scan.risk_score < 66
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${scan.risk_score}%` }}
                              />
                            </div>
                            <div className="mt-2 flex items-center justify-center">
                              <span
                                className={`text-2xl font-bold ${
                                  scan.risk_score < 33
                                    ? 'text-green-600 dark:text-green-400'
                                    : scan.risk_score < 66
                                    ? 'text-yellow-600 dark:text-yellow-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}
                              >
                                {scan.risk_score}/100
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-4">
                        <Button
                          onClick={() =>
                            router.push(
                              `/projects/${projectId}/scans/${scanId}/vulnerabilities`
                            )
                          }
                        >
                          View Detailed Report
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <ShieldCheck className="h-12 w-12 text-green-500 mb-4" />
                      <p className="text-xl font-medium text-green-700">
                        No vulnerabilities detected
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Your code passed all security checks
                      </p>
                    </div>
                  )}
                </div>
              ) : scan.status === 'failed' ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                  <p className="text-xl font-medium text-destructive-foreground">
                    Scan failed to complete
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 mb-4">
                    There was an issue processing your scan
                  </p>
                  <Button onClick={handleRetryScan} className="mt-2">
                    Retry Scan
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>No results available yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12">
          <p>Scan not found.</p>
        </div>
      )}

      {/* Result Summary Section */}
      {scan?.result_summary && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Scan Analysis</CardTitle>
            <CardDescription>
              AI-generated security summary and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            {scan.result_summary &&
              scan.result_summary
                .split(/(<think>|<\/think>)/)
                .map((part, index) => {
                  if (part === '<think>') {
                    return null; // Start of think tag, skip
                  } else if (part === '</think>') {
                    return null; // End of think tag, skip
                  } else if (
                    index > 0 &&
                    scan.result_summary &&
                    scan.result_summary.split(/(<think>|<\/think>)/)[
                      index - 1
                    ] === '<think>' &&
                    scan.result_summary.split(/(<think>|<\/think>)/)[
                      index + 1
                    ] === '</think>'
                  ) {
                    // This is content inside a think tag
                    return (
                      <div
                        key={index}
                        className="bg-muted/30 border-l-4 border-primary p-3 my-3 rounded-sm text-sm italic"
                      >
                        <p className="text-xs text-muted-foreground mb-1">
                          AI reasoning process:
                        </p>
                        <div className="whitespace-pre-line">{part}</div>
                      </div>
                    );
                  } else {
                    // Regular content - render as markdown directly with prose
                    return (
                      <div
                        key={index}
                        className="prose dark:prose-invert max-w-none"
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {part}
                        </ReactMarkdown>
                      </div>
                    );
                  }
                })}
          </CardContent>
        </Card>
      )}

      {/* Terminal Window for Execution Logs */}
      {scan?.execution_logs && (
        <div className="mt-6 border border-muted-foreground/20 rounded-md overflow-hidden">
          <div className="bg-zinc-900 border-b border-zinc-700 py-2 px-4">
            <h3 className="text-sm text-zinc-400 font-medium">
              Execution Logs
            </h3>
          </div>
          <div className="p-0">
            <div className="font-mono text-xs text-green-400 bg-black p-4 overflow-auto h-[400px] max-h-[400px]">
              <pre className="whitespace-pre-wrap break-words">
                {scan.execution_logs}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Add cancel confirmation dialog */}
      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Scan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this scan? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCanceling}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelScan}
              disabled={isCanceling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCanceling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Canceling...
                </>
              ) : (
                <>Yes, cancel scan</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
