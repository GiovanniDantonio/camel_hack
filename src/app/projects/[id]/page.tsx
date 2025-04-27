'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  GitBranch,
  Shield,
  AlertCircle,
  AlertTriangle,
  Info,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  GitFork,
  PackageCheck,
  Activity,
} from 'lucide-react';

interface ProjectData {
  project: {
    id: string;
    name: string;
    repository_full_name: string;
  };
  repository: {
    html_url: string;
    default_branch: string;
    updated_at: string;
  };
}

type ScanRow = Database['public']['Tables']['scans']['Row'];

interface ScanStats {
  latestScan: ScanRow | null;
  vulnerabilityCounts: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [scanStats, setScanStats] = useState<ScanStats>({
    latestScan: null,
    vulnerabilityCounts: {
      total: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjectData() {
      try {
        setIsLoading(true);

        const response = await fetch(`/api/projects/${projectId}/repository`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch project data');
        const data = await response.json();
        setProjectData(data);

        // Fetch scan and vulnerability data from Supabase
        await fetchScanAndVulnerabilityData();
      } catch (error) {
        console.error('Error fetching project:', error);
        setError(
          error instanceof Error ? error.message : 'Failed to load project'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjectData();
  }, [projectId]);

  async function fetchScanAndVulnerabilityData() {
    try {
      const supabase = createClient();

      // Fetch latest scan for this project
      const { data: latestScan, error: scanError } = await supabase
        .from('scans')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (scanError && scanError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned", which is OK
        console.error('Error fetching latest scan:', scanError);
      }

      // Fetch vulnerabilities for this project
      const { data: vulnerabilities, error: vulnsError } = await supabase
        .from('vulnerabilities')
        .select('severity')
        .eq('project_id', projectId);

      if (vulnsError) {
        console.error('Error fetching vulnerabilities:', vulnsError);
      }

      // Count vulnerabilities by severity
      const counts = {
        total: vulnerabilities?.length || 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
      };

      vulnerabilities?.forEach((vuln) => {
        if (vuln.severity === 'critical') counts.critical++;
        else if (vuln.severity === 'high') counts.high++;
        else if (vuln.severity === 'medium') counts.medium++;
        else if (vuln.severity === 'low') counts.low++;
      });

      setScanStats({
        latestScan: latestScan || null,
        vulnerabilityCounts: counts,
      });
    } catch (error) {
      console.error('Error fetching scan and vulnerability data:', error);
    }
  }

  // Helper function to get status badge with appropriate styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      case 'running':
        return (
          <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Running
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      case 'canceled':
        return (
          <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Canceled
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-gray-100 dark:bg-gray-800/50 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 dark:bg-gray-800/50 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700">
            {status}
          </Badge>
        );
    }
  };

  // Function to get scan type badge
  const getScanTypeBadge = (scanType: string) => {
    switch (scanType) {
      case 'full':
        return (
          <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800">
            Full Scan
          </Badge>
        );
      case 'incremental':
        return (
          <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800">
            Incremental Scan
          </Badge>
        );
      case 'targeted':
        return (
          <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800">
            Targeted Scan
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 dark:bg-gray-800/50 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700">
            {scanType} Scan
          </Badge>
        );
    }
  };

  // Function to render risk score with color coding
  const renderRiskScore = (score: number) => {
    let colorClass = '';
    let icon = null;

    if (score > 75) {
      colorClass = 'text-red-500 dark:text-red-400';
      icon = <AlertCircle className="h-4 w-4 mr-1.5" />;
    } else if (score > 50) {
      colorClass = 'text-orange-500 dark:text-orange-400';
      icon = <AlertTriangle className="h-4 w-4 mr-1.5" />;
    } else if (score > 25) {
      colorClass = 'text-yellow-600 dark:text-yellow-400';
      icon = <AlertTriangle className="h-4 w-4 mr-1.5" />;
    } else {
      colorClass = 'text-green-500 dark:text-green-400';
      icon = <Shield className="h-4 w-4 mr-1.5" />;
    }

    return (
      <div className={`flex items-center font-medium ${colorClass}`}>
        {icon}
        <span>{score}</span>
        <span className="text-muted-foreground text-xs ml-1">/100</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full overflow-hidden">
          <div className="p-6 space-y-4">
            <Skeleton className="h-7 w-40" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-5 w-40" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-7 w-36" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex justify-between items-center">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !projectData) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center p-6 rounded-lg border border-destructive/20 bg-destructive/5 max-w-md">
          <XCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
          <h2 className="text-xl font-semibold mb-2">Failed to load project</h2>
          <p className="text-muted-foreground">
            {error || 'Project not found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-1 border-b">
        <h1 className="text-2xl font-bold tracking-tight">Project Overview</h1>
      </div>

      {/* Project Information Card - Full Width */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
          <div className="p-6">
            <div className="flex items-center text-lg font-semibold mb-4 text-primary">
              <FileText className="h-5 w-5 mr-2" />
              <h3>Project Information</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Name</div>
                <div className="font-medium">{projectData.project.name}</div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center text-lg font-semibold mb-4 text-primary">
              <GitFork className="h-5 w-5 mr-2" />
              <h3>Repository</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Repository URL
                </div>
                <a
                  href={projectData.repository.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center"
                  data-project-repo-name
                >
                  {projectData.project.repository_full_name}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center text-lg font-semibold mb-4 text-primary">
              <GitBranch className="h-5 w-5 mr-2" />
              <h3>Branch Information</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Default Branch
                </div>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted">
                  {projectData.repository.default_branch}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Last Updated
                </div>
                <div className="text-sm">
                  {formatDate(new Date(projectData.repository.updated_at))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scan Status Card */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="border-b bg-muted/50 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <PackageCheck className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-lg font-semibold">Scan Status</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/projects/${projectId}/scans`)}
              className="text-xs h-8 gap-1.5"
            >
              View All Scans
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="p-6">
            {scanStats.latestScan ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="text-sm text-muted-foreground">
                      Last scan
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      <span>
                        {formatDate(
                          new Date(scanStats.latestScan.created_at || '')
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div>{getStatusBadge(scanStats.latestScan.status)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="text-sm text-muted-foreground">Type</div>
                    <div>
                      {getScanTypeBadge(scanStats.latestScan.scan_type)}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-sm text-muted-foreground">
                      Files Scanned
                    </div>
                    <div className="font-medium">
                      {scanStats.latestScan.files_scanned || 0}
                    </div>
                  </div>
                </div>

                {scanStats.latestScan.risk_score !== null && (
                  <div className="pt-2 border-t mt-4">
                    <div className="text-sm text-muted-foreground mb-2">
                      Risk Score
                    </div>
                    <div className="flex items-center">
                      {renderRiskScore(scanStats.latestScan.risk_score)}
                    </div>
                  </div>
                )}

                {scanStats.latestScan.status === 'completed' && (
                  <div className="pt-2 mt-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/projects/${projectId}/scans/${scanStats.latestScan?.id}`
                        )
                      }
                      className="w-full"
                    >
                      View Scan Details
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Info className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">
                  No scans found for this project
                </p>
                <Button
                  onClick={() =>
                    router.push(`/projects/${projectId}/scans/new`)
                  }
                >
                  Run First Scan
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Vulnerability Summary Card */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="border-b bg-muted/50 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-lg font-semibold">Vulnerability Summary</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                router.push(`/projects/${projectId}/vulnerabilities`)
              }
              className="text-xs h-8 gap-1.5"
            >
              View All Vulnerabilities
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="p-6">
            {scanStats.vulnerabilityCounts.total > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="font-medium">Total vulnerabilities</span>
                  <Badge variant="outline" className="text-sm">
                    {scanStats.vulnerabilityCounts.total}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-1.5" />
                          <span className="font-medium">Critical</span>
                        </div>
                        <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          {scanStats.vulnerabilityCounts.critical}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (scanStats.vulnerabilityCounts.critical /
                                scanStats.vulnerabilityCounts.total) *
                                100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mr-1.5" />
                          <span className="font-medium">High</span>
                        </div>
                        <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          {scanStats.vulnerabilityCounts.high}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (scanStats.vulnerabilityCounts.high /
                                scanStats.vulnerabilityCounts.total) *
                                100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1.5" />
                          <span className="font-medium">Medium</span>
                        </div>
                        <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          {scanStats.vulnerabilityCounts.medium}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (scanStats.vulnerabilityCounts.medium /
                                scanStats.vulnerabilityCounts.total) *
                                100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center">
                          <Info className="h-4 w-4 text-blue-500 mr-1.5" />
                          <span className="font-medium">Low</span>
                        </div>
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          {scanStats.vulnerabilityCounts.low}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (scanStats.vulnerabilityCounts.low /
                                scanStats.vulnerabilityCounts.total) *
                                100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-10 w-10 text-green-500 mb-3" />
                <p className="text-muted-foreground mb-2">
                  No vulnerabilities found
                </p>
                {scanStats.latestScan ? (
                  <p className="text-sm text-muted-foreground">
                    Your project has a clean security status
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Run a scan to check for vulnerabilities
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
