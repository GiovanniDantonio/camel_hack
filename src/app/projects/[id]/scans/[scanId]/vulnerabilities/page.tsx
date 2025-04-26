'use client';

/* This component should have corresponding styles in globals.css for markdown rendering */

import { AttackComponent } from '@/components/AttackComponent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database } from '@/types/database.types';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FileCode,
  Github,
  Loader2,
  Shield,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  atomDark,
  prism,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

// Use the Database type definition
type VulnerabilityRow = Database['public']['Tables']['vulnerabilities']['Row'];

// --- Extracted Components ---

interface VulnerabilityDetailsCardProps {
  vulnerability: VulnerabilityRow | null;
  onViewOnGithub: () => void;
}

const VulnerabilityDetailsCard: React.FC<VulnerabilityDetailsCardProps> = ({
  vulnerability,
  onViewOnGithub,
}) => {
  if (!vulnerability) return null;

  return (
    <div className="px-4 pt-4 pb-4 border-b">
      <div className="bg-muted/20 p-3 rounded-md border">
        <div className="flex items-start flex-col">
          <div className="w-full flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold flex items-center">
              {vulnerability.title}
              {vulnerability.cve && (
                <Badge
                  variant="outline"
                  className="ml-2 bg-red-50 text-red-800 border-red-200"
                >
                  {vulnerability.cve}
                </Badge>
              )}
            </h3>
            <div className="flex-shrink-0 flex gap-2">
              <Badge
                variant="outline"
                className={
                  vulnerability.status === 'open'
                    ? 'bg-red-100 text-red-800 border-red-300'
                    : vulnerability.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : vulnerability.status === 'resolved'
                    ? 'bg-green-100 text-green-800 border-green-300'
                    : 'bg-gray-100 text-gray-800 border-gray-300'
                }
              >
                {vulnerability.status === 'in_progress'
                  ? 'In Progress'
                  : vulnerability.status === 'false_positive'
                  ? 'False Positive'
                  : vulnerability.status === 'resolved'
                  ? 'Fixed'
                  : 'Open'}
              </Badge>
              <Badge
                variant="outline"
                className="bg-muted hover:bg-muted cursor-pointer"
                onClick={onViewOnGithub}
                tabIndex={0}
                role="button"
                aria-label="View on GitHub"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onViewOnGithub();
                }}
              >
                <Github className="h-3 w-3 mr-1" /> View on GitHub
              </Badge>
            </div>
          </div>
          <div className="text-sm mt-1 text-muted-foreground prose prose-sm dark:prose-invert max-w-none markdown-content w-full">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {vulnerability.description || ''}
            </ReactMarkdown>
          </div>

          {/* Additional vulnerability information */}
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs w-full">
            {/* Detection date */}
            {vulnerability.detected_at && (
              <div className="flex items-center">
                <span className="font-medium mr-1">Detected:</span>
                {new Date(vulnerability.detected_at).toLocaleDateString()}
              </div>
            )}

            {/* Affected components */}
            {vulnerability.affected_components &&
              vulnerability.affected_components.length > 0 && (
                <div className="flex items-start">
                  <span className="font-medium mr-1">Affected:</span>
                  <span>{vulnerability.affected_components.join(', ')}</span>
                </div>
              )}
          </div>

          {/* Reference URLs */}
          {vulnerability.reference_urls &&
            vulnerability.reference_urls.length > 0 && (
              <div className="mt-2 text-xs w-full">
                <span className="font-medium">References:</span>
                <div className="mt-1 space-y-1">
                  {vulnerability.reference_urls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-primary hover:underline overflow-hidden text-ellipsis"
                    >
                      {url}
                    </a>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

interface CodeViewerCardProps {
  filePath: string | null;
  fileContent: string | null;
  isLoading: boolean;
  error: string | null;
  vulnerabilitiesInFile: VulnerabilityRow[];
  selectedVulnerability: VulnerabilityRow | null;
  currentVulnerabilityIndex: number;
  onSelectVulnerability: (vulnerability: VulnerabilityRow) => void;
  goToPreviousVulnerability: () => void;
  goToNextVulnerability: () => void;
  getLanguageFromFilePath: (filePath: string | null) => string;
  isDarkTheme: boolean;
  codeContainerRef: React.RefObject<HTMLDivElement | null>;
}

const CodeViewerCard: React.FC<CodeViewerCardProps> = ({
  filePath,
  fileContent,
  isLoading,
  error,
  vulnerabilitiesInFile,
  selectedVulnerability,
  currentVulnerabilityIndex,
  onSelectVulnerability,
  goToPreviousVulnerability,
  goToNextVulnerability,
  getLanguageFromFilePath,
  isDarkTheme,
  codeContainerRef,
}) => {
  return (
    <div className="border rounded-md overflow-hidden mt-4">
      {/* Navigation buttons */}
      {vulnerabilitiesInFile.length > 1 &&
        !isLoading &&
        !error &&
        fileContent && (
          <div className="flex justify-between items-center p-2 bg-muted/30 border-b">
            <div className="text-sm">
              Issue {currentVulnerabilityIndex + 1} of{' '}
              {vulnerabilitiesInFile.length}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={currentVulnerabilityIndex <= 0}
                onClick={goToPreviousVulnerability}
                title="Previous issue"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={
                  currentVulnerabilityIndex === vulnerabilitiesInFile.length - 1
                }
                onClick={goToNextVulnerability}
                title="Next issue"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

      {/* Code Area */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">
            Loading file content...
          </span>
        </div>
      ) : error ? (
        <div className="p-4 text-destructive bg-destructive/10 rounded-md">
          <p>Error loading file: {error}</p>
          <p className="text-sm mt-2">
            Falling back to code snippet if available.
          </p>
          {/* Fallback: Display first snippet if available */}
          {vulnerabilitiesInFile.length > 0 &&
          vulnerabilitiesInFile[0].code_snippet_lines &&
          Array.isArray(vulnerabilitiesInFile[0].code_snippet_lines) &&
          vulnerabilitiesInFile[0].code_snippet_lines.length > 0 ? (
            <SyntaxHighlighter
              language={getLanguageFromFilePath(filePath || '')}
              style={isDarkTheme ? atomDark : prism}
              showLineNumbers
              wrapLines
              wrapLongLines
              customStyle={{
                margin: '1rem 0 0 0',
                borderRadius: '0.25rem',
                fontSize: '0.85rem',
              }}
            >
              {vulnerabilitiesInFile[0].code_snippet_lines[0]}
            </SyntaxHighlighter>
          ) : (
            <p className="text-sm mt-4">No code snippet available.</p>
          )}
        </div>
      ) : fileContent ? (
        <div className="h-[400px]" ref={codeContainerRef}>
          <SyntaxHighlighter
            language={getLanguageFromFilePath(filePath || '')}
            style={isDarkTheme ? atomDark : prism}
            showLineNumbers
            wrapLines
            wrapLongLines
            customStyle={{
              margin: 0,
              borderRadius: 0,
              fontSize: '0.85rem',
              height: '100%',
            }}
            lineNumberStyle={{
              minWidth: '3em',
              paddingRight: '1em',
              textAlign: 'right',
              userSelect: 'none',
            }}
            lineProps={(lineNumber) => {
              const vulnerabilityOnLine = vulnerabilitiesInFile.find(
                (v) =>
                  v.line_start !== undefined &&
                  v.line_end !== undefined &&
                  v.line_start !== null &&
                  v.line_end !== null &&
                  lineNumber >= v.line_start &&
                  lineNumber <= v.line_end
              );

              const isHighlighted = !!vulnerabilityOnLine;
              const isSelected =
                vulnerabilityOnLine &&
                selectedVulnerability &&
                vulnerabilityOnLine.id === selectedVulnerability.id;

              const handleLineClick = () => {
                if (vulnerabilityOnLine) {
                  onSelectVulnerability(vulnerabilityOnLine);
                }
              };

              const handleLineKeyDown = (
                e: React.KeyboardEvent<HTMLSpanElement>
              ) => {
                if (
                  (e.key === 'Enter' || e.key === ' ') &&
                  vulnerabilityOnLine
                ) {
                  onSelectVulnerability(vulnerabilityOnLine);
                }
              };

              return {
                style: {
                  display: 'block',
                  padding: '0 0.5rem',
                  cursor: isHighlighted ? 'pointer' : 'default',
                  backgroundColor: isSelected
                    ? isDarkTheme
                      ? 'rgba(220, 38, 38, 0.25)'
                      : 'rgba(254, 202, 202, 0.6)'
                    : isHighlighted
                    ? isDarkTheme
                      ? 'rgba(220, 38, 38, 0.15)'
                      : 'rgba(254, 226, 226, 0.4)'
                    : undefined,
                  borderLeft: isSelected
                    ? '3px solid rgb(220, 38, 38)'
                    : isHighlighted
                    ? '3px solid rgb(248, 113, 113)'
                    : undefined,
                },
                onClick: handleLineClick,
                onKeyDown: handleLineKeyDown,
                tabIndex: isHighlighted ? 0 : -1,
                role: isHighlighted ? 'button' : undefined,
                'aria-label': isHighlighted
                  ? `Vulnerability: ${vulnerabilityOnLine?.title}, Line ${lineNumber}`
                  : undefined,
                'data-line-number': lineNumber,
              };
            }}
          >
            {fileContent}
          </SyntaxHighlighter>
        </div>
      ) : (
        <div className="py-6 text-center text-muted-foreground">
          No code available for this file
        </div>
      )}
    </div>
  );
};

interface RecommendationCardProps {
  vulnerability: VulnerabilityRow | null;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  vulnerability,
}) => {
  if (!vulnerability?.remediation) return null;

  return (
    <div className="pb-4">
      <div className="p-3 rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
        <div className="flex items-start">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-0.5">
              Recommended Fix
            </h4>
            <div className="text-sm text-green-700 dark:text-green-300 prose prose-sm dark:prose-invert max-w-none markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {vulnerability.remediation}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function VulnerabilitiesPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract primitive dependencies OUTSIDE effects
  const projectId = params.id as string;
  const scanId = params.scanId as string;

  // Read initial vulnerabilityId from URL once
  const initialVulnerabilityId = searchParams.get('vulnerabilityId');

  const { resolvedTheme: theme } = useTheme();
  const isDarkTheme = theme === 'dark';

  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityRow[]>(
    []
  );
  const [selectedVulnerability, setSelectedVulnerability] =
    useState<VulnerabilityRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [scanCommitHash, setScanCommitHash] = useState<string | null>(null);
  const [scanBranch, setScanBranch] = useState<string>('main');

  const codeContainerRef = useRef<HTMLDivElement>(null);

  // --- Data Fetching and Processing ---

  // Group vulnerabilities by file path
  const vulnerabilitiesByFile = vulnerabilities.reduce((acc, vulnerability) => {
    const filePath = vulnerability.file_path || '';
    if (!acc[filePath]) {
      acc[filePath] = [];
    }
    acc[filePath].push(vulnerability);
    return acc;
  }, {} as Record<string, VulnerabilityRow[]>);

  // Sort vulnerabilities by line number within each file
  Object.keys(vulnerabilitiesByFile).forEach((filePath) => {
    vulnerabilitiesByFile[filePath].sort((a, b) => {
      const lineA = a.line_start || 0;
      const lineB = b.line_start || 0;
      return lineA - lineB;
    });
  });

  // Sort file paths alphabetically
  const sortedFilePaths = Object.keys(vulnerabilitiesByFile).sort();

  // Get vulnerabilities for the selected file
  const selectedFileVulnerabilities = selectedFilePath
    ? vulnerabilitiesByFile[selectedFilePath] || []
    : [];

  // Get current vulnerability index in the selected file
  const currentVulnerabilityIndex = selectedVulnerability
    ? selectedFileVulnerabilities.findIndex(
        (v) => v.id === selectedVulnerability.id
      )
    : -1;

  // --- Effects ---

  // Fetch VULNERABILITY LIST only when projectId or scanId changes
  useEffect(() => {
    // Load stored vulnerabilities from localStorage
    const storageKey = `vulnerabilities-${projectId}-${scanId}`;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          console.log('hydrated vulnerabilities from storage:', parsed);
          setVulnerabilities(parsed);
        } catch (e) {
          console.error('Error parsing stored vulnerabilities', e);
        }
      }
    }
    const fetchVulnerabilities = async () => {
      // Use projectId and scanId directly
      if (!projectId || !scanId) {
        console.error('Project ID or Scan ID missing in effect');
        setError(
          'Unable to load vulnerabilities because the project or scan information is missing from the URL. Please ensure you accessed this page through the application navigation.'
        );
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true); // Set loading for this initial fetch
        setError(null);

        // Fetch scan details using stable projectId/scanId
        const scanResponse = await fetch(
          `/api/projects/${projectId}/scans/${scanId}`
        );
        if (!scanResponse.ok) {
          throw new Error(
            `Failed to fetch scan details: ${scanResponse.status}`
          );
        }
        const scanData = await scanResponse.json();
        setScanCommitHash(scanData.commit_hash || null);
        setScanBranch(scanData.branch || 'main');

        // Fetch vulnerabilities using stable projectId/scanId
        const vulnResponse = await fetch(
          `/api/projects/${projectId}/scans/${scanId}/vulnerabilities`
        );
        if (!vulnResponse.ok) {
          throw new Error(
            `Failed to fetch vulnerabilities: ${vulnResponse.status}`
          );
        }
        const vulnData = (await vulnResponse.json()) || [];
        setVulnerabilities(vulnData);
        // Persist vulnerabilities locally
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, JSON.stringify(vulnData));
        }

        // Determine INITIAL selection using value read outside effect
        let initialSelection: VulnerabilityRow | null = null;
        if (initialVulnerabilityId && vulnData.length > 0) {
          initialSelection =
            vulnData.find(
              (v: VulnerabilityRow) => v.id === initialVulnerabilityId
            ) ||
            vulnData[0] ||
            null;
        } else if (vulnData.length > 0) {
          initialSelection = vulnData[0];
        }
        setSelectedVulnerability(initialSelection);
        setSelectedFilePath(initialSelection?.file_path || null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
        console.error('Error fetching vulnerabilities:', err);
        setVulnerabilities([]);
        setSelectedVulnerability(null);
        setSelectedFilePath(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVulnerabilities();
    // Depend only on primitive projectId and scanId
  }, [projectId, scanId]);

  // --- Restore other effects ---

  // Fetch file content when selected file path changes
  useEffect(() => {
    const fetchFileContent = async (filePath: string) => {
      if (!projectId) {
        return;
      }
      setIsLoadingFile(true);
      setFileError(null);
      setFileContent(null);
      try {
        const branch = scanBranch || 'main';
        const commitParam = scanCommitHash ? `&commit=${scanCommitHash}` : '';
        const apiUrl = `/api/projects/${projectId}/repository/content?path=${encodeURIComponent(
          filePath
        )}&branch=${branch}${commitParam}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch file content: ${response.status}`);
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setFileContent(data.content);
      } catch (err) {
        console.error('Error fetching file content:', err);
        setFileError(
          err instanceof Error ? err.message : 'Failed to fetch file content'
        );
      } finally {
        setIsLoadingFile(false);
      }
    };

    if (selectedFilePath) {
      fetchFileContent(selectedFilePath);
    } else {
      setFileContent(null);
      setFileError(null);
      setIsLoadingFile(false);
    }
  }, [selectedFilePath, projectId, scanCommitHash, scanBranch]);

  // Scroll to highlighted line when selected vulnerability or file content changes
  useEffect(() => {
    const scrollToHighlightedLine = () => {
      if (codeContainerRef.current && selectedVulnerability?.line_start) {
        const lineElement = codeContainerRef.current.querySelector(
          `[data-line-number="${selectedVulnerability.line_start}"]`
        );
        if (lineElement) {
          lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };
    if (fileContent && selectedVulnerability) {
      const timeoutId = setTimeout(scrollToHighlightedLine, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedVulnerability, fileContent]);

  // --- Handlers ---

  const handleSelectVulnerability = (vulnerability: VulnerabilityRow) => {
    // Remove diagnostic log
    setSelectedVulnerability(vulnerability);
    setSelectedFilePath(vulnerability.file_path || null);
    // Restore URL update
    const url = new URL(window.location.href);
    url.searchParams.set('vulnerabilityId', vulnerability.id);
    window.history.replaceState(null, '', url.toString());
  };

  const handleSelectFile = (filePath: string) => {
    // Remove diagnostic log
    setSelectedFilePath(filePath);
    if (vulnerabilitiesByFile[filePath]?.length > 0) {
      const firstVuln = vulnerabilitiesByFile[filePath][0];
      setSelectedVulnerability(firstVuln);
      // Restore URL update
      const url = new URL(window.location.href);
      url.searchParams.set('vulnerabilityId', firstVuln.id);
      window.history.replaceState(null, '', url.toString());
    } else {
      setSelectedVulnerability(null);
      // Restore URL update
      const url = new URL(window.location.href);
      url.searchParams.delete('vulnerabilityId');
      window.history.replaceState(null, '', url.toString());
    }
  };

  const handleGoToNextVulnerability = () => {
    if (
      selectedFilePath &&
      currentVulnerabilityIndex !== -1 &&
      currentVulnerabilityIndex < selectedFileVulnerabilities.length - 1
    ) {
      const nextVulnerability =
        selectedFileVulnerabilities[currentVulnerabilityIndex + 1];
      handleSelectVulnerability(nextVulnerability); // Use central handler
    }
  };

  const handleGoToPreviousVulnerability = () => {
    if (selectedFilePath && currentVulnerabilityIndex > 0) {
      const prevVulnerability =
        selectedFileVulnerabilities[currentVulnerabilityIndex - 1];
      handleSelectVulnerability(prevVulnerability); // Use central handler
    }
  };

  const handleViewOnGithub = () => {
    if (!selectedVulnerability || !selectedVulnerability.file_path) return;

    // Placeholder: Fetch or configure actual repo URL
    const repoBaseUrl = 'https://github.com/your-org/your-repo'; // Replace with dynamic value if possible

    const filePath = selectedVulnerability.file_path;
    const commitRef = scanCommitHash || scanBranch || 'main'; // Use commit, fallback to branch, then main
    const lineRef = selectedVulnerability.line_start
      ? `#L${selectedVulnerability.line_start}${
          selectedVulnerability.line_end &&
          selectedVulnerability.line_end !== selectedVulnerability.line_start
            ? `-L${selectedVulnerability.line_end}`
            : ''
        }`
      : '';

    const url = `${repoBaseUrl}/blob/${commitRef}/${filePath}${lineRef}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleGoBack = () => {
    if (projectId) {
      // If we have projectId but no scanId, go to the project details page
      if (!scanId) {
        router.push(`/projects/${projectId}`);
      } else {
        // Normal case: go to scan details
        router.push(`/projects/${projectId}/scans/${scanId}`);
      }
    } else {
      // Fallback to projects page if projectId is missing
      router.push('/projects');
    }
  };

  // --- Helper Functions ---

  const getLanguageFromFilePath = (filePath: string | null): string => {
    if (!filePath) return 'text';
    const extension = filePath.split('.').pop()?.toLowerCase();
    // Simplified map, expand as needed
    const languageMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'jsx',
      ts: 'typescript',
      tsx: 'tsx',
      py: 'python',
      java: 'java',
      html: 'html',
      css: 'css',
      json: 'json',
      yaml: 'yaml',
      yml: 'yaml',
      md: 'markdown',
      sh: 'bash',
      // Add more mappings
    };
    return languageMap[extension || ''] || 'text'; // Default to text
  };

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div className="container mx-auto py-4 flex justify-center items-center h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-4">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-destructive">
              Error Loading Vulnerabilities
            </h2>
            <p className="text-muted-foreground text-sm mt-1 mb-4">{error}</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={handleGoBack}>Back to Scan Details</Button>
              <Button
                variant="outline"
                onClick={() => router.push('/projects')}
              >
                Go to Projects
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (vulnerabilities.length === 0) {
    return (
      <div className="container mx-auto py-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-10 w-10 text-green-500 mb-3" />
            <h2 className="text-lg font-semibold text-green-700">
              No Vulnerabilities Found
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Great job! No security vulnerabilities were detected in this scan.
            </p>
            <Button className="mt-4" onClick={handleGoBack}>
              Back to Scan Details
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Main Layout ---
  return (
    <div className="container mx-auto py-4">
      <div className="flex gap-4">
        {/* --- Left Column: Header + Sidebar --- */}
        <div className="w-1/4 flex-shrink-0">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleGoBack}
                className="mr-3"
                aria-label="Back to scan details"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Vulnerability Report</h1>
                <p className="text-muted-foreground text-sm">
                  {`${vulnerabilities.length} ${
                    vulnerabilities.length === 1
                      ? 'vulnerability'
                      : 'vulnerabilities'
                  } found`}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - File/Vulnerability List */}
          <div className="sticky top-4">
            <Card className="max-h-[calc(100vh-120px)] overflow-hidden">
              {/* Use ScrollArea for consistent scrolling */}
              <ScrollArea className="h-full">
                <CardContent className="p-0">
                  <div className="divide-y divide-muted/50">
                    {sortedFilePaths.map((filePath) => (
                      <div key={filePath}>
                        {/* File Header */}
                        <div
                          className={`p-2 py-1.5 border-b flex items-center justify-between cursor-pointer transition-colors ${
                            selectedFilePath === filePath
                              ? 'bg-primary/10 hover:bg-primary/15'
                              : 'bg-muted/30 hover:bg-muted/50'
                          }`}
                          onClick={() => handleSelectFile(filePath)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ')
                              handleSelectFile(filePath);
                          }}
                          tabIndex={0}
                          role="button"
                          aria-label={`File: ${filePath.split('/').pop()}`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <FileCode className="h-3.5 w-3.5 mr-1.5 text-muted-foreground flex-shrink-0" />
                              <h4 className="font-medium text-xs truncate">
                                {filePath.split('/').pop()}
                              </h4>
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {filePath}
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="text-xs ml-2 h-5 px-1.5"
                          >
                            {vulnerabilitiesByFile[filePath].length}
                          </Badge>
                        </div>

                        {/* Vulnerability List for this file */}
                        <div className="divide-y">
                          {vulnerabilitiesByFile[filePath].map(
                            (vulnerability) => (
                              <div
                                key={vulnerability.id}
                                className={`py-1.5 px-2 pl-4 cursor-pointer transition-colors ${
                                  selectedVulnerability?.id === vulnerability.id
                                    ? 'bg-muted'
                                    : 'hover:bg-muted/50'
                                }`}
                                onClick={() =>
                                  handleSelectVulnerability(vulnerability)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ')
                                    handleSelectVulnerability(vulnerability);
                                }}
                                tabIndex={0}
                                role="button"
                                aria-label={`Vulnerability: ${vulnerability.title}, Line ${vulnerability.line_start}`}
                              >
                                <div className="flex justify-between items-start w-full gap-1">
                                  <div className="flex-1 min-w-0 overflow-hidden">
                                    {/* Severity & Line Badge */}
                                    <div className="flex items-center flex-wrap gap-1">
                                      <Badge
                                        className={`px-1 py-0 h-4 text-[10px] font-medium flex items-center ${
                                          vulnerability.severity === 'critical'
                                            ? 'bg-red-500 text-white'
                                            : vulnerability.severity === 'high'
                                            ? 'bg-orange-500 text-white'
                                            : vulnerability.severity ===
                                              'medium'
                                            ? 'bg-yellow-500 text-black'
                                            : vulnerability.severity === 'low'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-500 text-white' // Info/Unknown
                                        }`}
                                      >
                                        {vulnerability.severity ===
                                          'critical' && (
                                          <AlertCircle className="h-2.5 w-2.5 mr-0.5" />
                                        )}
                                        {(vulnerability.severity === 'high' ||
                                          vulnerability.severity ===
                                            'medium') && (
                                          <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                                        )}
                                        {vulnerability.severity === 'low' && (
                                          <Shield className="h-2.5 w-2.5 mr-0.5" />
                                        )}
                                        {vulnerability.severity === 'critical'
                                          ? 'Crit'
                                          : vulnerability.severity === 'medium'
                                          ? 'Med'
                                          : vulnerability.severity}
                                      </Badge>
                                      {vulnerability.line_start && (
                                        <span className="text-[10px] text-muted-foreground font-mono">
                                          L{vulnerability.line_start}
                                          {vulnerability.line_end &&
                                            vulnerability.line_end !==
                                              vulnerability.line_start &&
                                            `-${vulnerability.line_end}`}
                                        </span>
                                      )}
                                    </div>
                                    {/* Title */}
                                    <h4 className="font-medium text-xs truncate max-w-full mt-1">
                                      {vulnerability.title}
                                    </h4>
                                  </div>
                                  {/* Status Badge */}
                                  <div className="flex-shrink-0">
                                    <Badge
                                      variant="outline"
                                      className={`px-1 py-0 h-4 text-[10px] font-medium ${
                                        vulnerability.status === 'open'
                                          ? 'bg-red-100 text-red-800 border-red-300'
                                          : vulnerability.status ===
                                            'in_progress'
                                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                                          : vulnerability.status === 'resolved'
                                          ? 'bg-green-100 text-green-800 border-green-300'
                                          : 'bg-gray-100 text-gray-800 border-gray-300'
                                      }`}
                                    >
                                      {vulnerability.status === 'in_progress'
                                        ? 'In Prog'
                                        : vulnerability.status ===
                                          'false_positive'
                                        ? 'False+'
                                        : vulnerability.status === 'resolved'
                                        ? 'Fixed'
                                        : vulnerability.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
        </div>

        {/* --- Right Column: Details + Code --- */}
        <div className="flex-grow w-3/4">
          <Card className="min-h-[calc(100vh-32px)]">
            {selectedVulnerability ? (
              <div className="flex flex-col h-full">
                {/* Vulnerability Details */}
                <VulnerabilityDetailsCard
                  vulnerability={selectedVulnerability}
                  onViewOnGithub={handleViewOnGithub}
                />

                {/* Code Viewer, Attack Button, Recommendation */}
                <div className="flex-grow px-4 flex flex-col">
                  {/* Code Viewer */}
                  <CodeViewerCard
                    filePath={selectedFilePath}
                    fileContent={fileContent}
                    isLoading={isLoadingFile}
                    error={fileError}
                    vulnerabilitiesInFile={selectedFileVulnerabilities}
                    selectedVulnerability={selectedVulnerability}
                    currentVulnerabilityIndex={currentVulnerabilityIndex}
                    onSelectVulnerability={handleSelectVulnerability} // Pass the handler
                    goToPreviousVulnerability={handleGoToPreviousVulnerability}
                    goToNextVulnerability={handleGoToNextVulnerability}
                    getLanguageFromFilePath={getLanguageFromFilePath}
                    isDarkTheme={isDarkTheme}
                    codeContainerRef={codeContainerRef}
                  />

                  {/* Conditionally render Attack Button only when file is loaded */}
                  {!isLoadingFile && fileContent && (
                    <div className="py-4">
                      <AttackComponent
                        key={selectedVulnerability.id} // Key forces remount on vuln change
                        projectId={projectId}
                        vulnerabilityId={selectedVulnerability.id}
                        variant="outline"
                        size="sm"
                        className="w-full"
                        redirectPath={`/projects/${projectId}/scans/${scanId}/vulnerabilities?vulnerabilityId=${selectedVulnerability.id}`}
                      />
                    </div>
                  )}

                  {/* Recommendation */}
                  <RecommendationCard vulnerability={selectedVulnerability} />

                  {/* Spacer to push content up if recommendation is short */}
                  <div className="flex-grow"></div>
                </div>
              </div>
            ) : (
              // Placeholder when no file or vulnerability is selected initially
              <CardContent className="flex flex-col items-center justify-center h-full text-center">
                {/* Use a different icon? Maybe FileCode */}
                <FileCode className="h-10 w-10 text-muted-foreground mb-3" />
                <h2 className="text-lg font-semibold">
                  Select a File or Vulnerability
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Choose an item from the list on the left to view details.
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
