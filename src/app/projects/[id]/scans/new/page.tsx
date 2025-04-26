'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { CustomVulnerability } from '@/lib/services/custom-vulnerability-service';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bug,
  CheckCircle,
  Code,
  Database,
  FileCode,
  Folder,
  GitBranch,
  GitCommit,
  Globe,
  Key,
  List,
  LoaderCircle,
  Package,
  PlusCircle,
  Search,
  ServerCrash,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Unlock,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// Repository branch interface
interface RepoBranch {
  name: string;
  is_default: boolean;
  commits?: RepoCommit[];
}

// Repository commit interface
interface RepoCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  modified_files?: string[];
}

// Interface for repository data
interface RepositoryData {
  branches?: RepoBranch[];
}

// Response from repository API
interface RepositoryResponse {
  repository?: RepositoryData;
}

// Vulnerability types that can be scanned for
const vulnerabilityTypes = [
  {
    id: 'sql_injection',
    name: 'SQL Injection',
    icon: <Database className="mr-2 h-4 w-4" />,
    description: 'Detects potential database injection vulnerabilities',
  },
  {
    id: 'xss',
    name: 'Cross-Site Scripting (XSS)',
    icon: <Code className="mr-2 h-4 w-4" />,
    description: 'Identifies potential XSS vulnerabilities in client-side code',
  },
  {
    id: 'csrf',
    name: 'Cross-Site Request Forgery',
    icon: <Globe className="mr-2 h-4 w-4" />,
    description: 'Checks for CSRF vulnerabilities in form submissions',
  },
  {
    id: 'auth_issues',
    name: 'Authentication Issues',
    icon: <Key className="mr-2 h-4 w-4" />,
    description: 'Identifies weak authentication mechanisms',
  },
  {
    id: 'secrets',
    name: 'Exposed Secrets',
    icon: <Unlock className="mr-2 h-4 w-4" />,
    description: 'Detects hardcoded API keys, credentials and tokens',
  },
  {
    id: 'insecure_deps',
    name: 'Insecure Dependencies',
    icon: <Package className="mr-2 h-4 w-4" />,
    description: 'Finds dependencies with known vulnerabilities',
  },
  {
    id: 'server_issues',
    name: 'Server Security Issues',
    icon: <ServerCrash className="mr-2 h-4 w-4" />,
    description: 'Identifies server-side security concerns',
  },
  {
    id: 'business_logic',
    name: 'Business Logic Flaws',
    icon: <Bug className="mr-2 h-4 w-4" />,
    description: 'Detects potential logic issues in application flow',
  },
  {
    id: 'input_validation',
    name: 'Input Validation',
    icon: <AlertCircle className="mr-2 h-4 w-4" />,
    description: 'Checks for proper input validation',
  },
  {
    id: 'security_config',
    name: 'Security Misconfiguration',
    icon: <Settings className="mr-2 h-4 w-4" />,
    description: 'Identifies misconfigurations in security settings',
  },
];

// Mock file structure for the file browser
type FileItem = {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileItem[];
  selected?: boolean;
  sha?: string;
  size?: number;
};

export default function NewScanPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  // State variables
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Scan configuration state
  const [scanType, setScanType] = useState<'full' | 'incremental' | 'targeted'>(
    'full'
  );
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null);
  const [availableBranches, setAvailableBranches] = useState<string[]>([]);
  const [recentCommits, setRecentCommits] = useState<RepoCommit[]>([]);
  const [selectedVulnerabilityTypes, setSelectedVulnerabilityTypes] = useState<
    string[]
  >(['sql_injection', 'xss', 'csrf', 'secrets']);
  const [fileStructure, setFileStructure] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Add state for current directory path
  const [currentPath, setCurrentPath] = useState<string>('');
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false);
  const [fileLoadError, setFileLoadError] = useState<string | null>(null);

  // Add state to track open folders
  const [openFolders, setOpenFolders] = useState<string[]>([]);

  // Add state for code viewer
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);

  // Add state to track loading of commit files specifically
  const [loadingCommitFiles, setLoadingCommitFiles] = useState(false);

  // State for custom vulnerabilities
  const [customVulnerabilities, setCustomVulnerabilities] = useState<
    CustomVulnerability[]
  >([]);
  const [selectedCustomVulnerabilities, setSelectedCustomVulnerabilities] =
    useState<string[]>([]);
  const [newVulnerabilityName, setNewVulnerabilityName] = useState('');
  const [newVulnerabilityDescription, setNewVulnerabilityDescription] =
    useState('');
  const [newVulnerabilityCveCode, setNewVulnerabilityCveCode] = useState('');
  const [customVulnerabilitySearch, setCustomVulnerabilitySearch] =
    useState('');
  const [isAddingCustomVulnerability, setIsAddingCustomVulnerability] =
    useState(false);
  const [isLoadingCustomVulnerabilities, setIsLoadingCustomVulnerabilities] =
    useState(false);
  const [isCveLookupLoading, setIsCveLookupLoading] = useState(false);
  const [cveLookupError, setCveLookupError] = useState<string | null>(null);
  const [isCveOfficial, setIsCveOfficial] = useState(false);
  const [isDuplicateCve, setIsDuplicateCve] = useState(false);

  // State for repository and file browsing
  const [currentRepoCommit, setCurrentRepoCommit] = useState<string | null>(
    null
  );
  const [repoLoadingComplete, setRepoLoadingComplete] =
    useState<boolean>(false);

  // Add this state to track if all files are being loaded
  const [loadingAllFiles, setLoadingAllFiles] = useState(false);
  const [allFilesLoaded, setAllFilesLoaded] = useState(false);

  const { toast } = useToast();

  // Fetch repository data when the component mounts
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch repository information
        const repoResponse = await fetch(
          `/api/projects/${projectId}/repository`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!repoResponse.ok) {
          throw new Error(
            `Failed to fetch repository data: ${repoResponse.status}`
          );
        }

        const repoData = (await repoResponse.json()) as RepositoryResponse;

        if (repoData.repository) {
          // Extract branches and set default branch
          if (repoData.repository.branches) {
            const branches = repoData.repository.branches.map(
              (branch: RepoBranch) => branch.name
            );
            setAvailableBranches(branches);

            // Set default branch
            const defaultBranch = repoData.repository.branches.find(
              (branch: RepoBranch) => branch.is_default
            );
            if (defaultBranch) {
              setSelectedBranch(defaultBranch.name);
            } else if (branches.length > 0) {
              setSelectedBranch(branches[0]);
            }

            // Extract recent commits from default branch
            if (defaultBranch && defaultBranch.commits) {
              setRecentCommits(defaultBranch.commits);
              if (defaultBranch.commits.length > 0) {
                setSelectedCommit(defaultBranch.commits[0].sha);
              }
            }
          }
        }

        // Fetch root files
        await fetchRepositoryFiles('');
      } catch (err) {
        console.error('Error fetching repository data:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch repository data'
        );

        // If we can't fetch real data, use mock data for demo
        setAvailableBranches(['main', 'develop', 'feature/user-auth']);
        const mockCommits: RepoCommit[] = [
          {
            sha: 'main-commit-0',
            message: 'Fix security vulnerability in login form',
            author: 'John Doe',
            date: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            sha: 'main-commit-1',
            message: 'Update dependencies to latest versions',
            author: 'Jane Smith',
            date: new Date(Date.now() - 2 * 86400000).toISOString(),
          },
          {
            sha: 'main-commit-2',
            message: 'Add input validation to API endpoints',
            author: 'John Doe',
            date: new Date(Date.now() - 3 * 86400000).toISOString(),
          },
        ];
        setRecentCommits(mockCommits);
        setSelectedCommit(mockCommits[0].sha);
        setSelectedBranch('main'); // Only set main as fallback in mock data

        // Use mock file structure if real data cannot be fetched
        setFileStructure(generateMockFileStructure());
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [projectId]);

  // Fetch repository files from GitHub - updated to support commits
  const fetchRepositoryFiles = async (
    path: string,
    specificCommit?: string
  ) => {
    setLoadingFiles(true);
    setFileLoadError(null);

    try {
      // Use the specified commit, or currentRepoCommit, or fall back to branch
      const commitParam = specificCommit || currentRepoCommit;
      let apiUrl = `/api/projects/${projectId}/repository/files?branch=${selectedBranch}&path=${path}`;

      if (commitParam) {
        apiUrl += `&commit=${commitParam}`;
        console.log(
          `Fetching files for path: ${path} at commit: ${commitParam}`
        );
      }

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.status}`);
      }

      const data = await response.json();
      const files = data.files || []; // Handle new API response format

      // Convert API format to our FileItem format
      const fileItems: FileItem[] = files.map(
        (file: {
          name: string;
          path: string;
          type: string;
          sha?: string;
          size?: number;
        }) => ({
          name: file.name,
          path: file.path,
          type: file.type === 'dir' ? 'directory' : 'file',
          sha: file.sha,
          size: file.size,
          // For directories, we'll load children dynamically when expanded
          children: file.type === 'dir' ? [] : undefined,
        })
      );

      if (path === '') {
        // Replace entire file structure for root path
        setFileStructure(fileItems);
      } else {
        // Update the existing file structure for nested paths
        // We need to find the directory in the file structure and update its children
        setFileStructure((prevStructure) => {
          return updateFileStructureWithChildren(
            prevStructure,
            path,
            fileItems
          );
        });
      }

      setCurrentPath(path);
      return fileItems;
    } catch (error) {
      console.error('Error fetching repository files:', error);
      setFileLoadError(
        error instanceof Error ? error.message : 'Failed to fetch files'
      );

      // If we failed to fetch real files, use mock data for the path
      if (path === '') {
        setFileStructure(generateMockFileStructure());
      }
      return [];
    } finally {
      setLoadingFiles(false);
    }
  };

  // Helper function to update nested file structure with loaded children
  const updateFileStructureWithChildren = (
    structure: FileItem[],
    path: string,
    children: FileItem[]
  ): FileItem[] => {
    // If we're at the root, return the new children
    if (path === '') {
      return children;
    }

    // Otherwise, recursively update the structure
    return structure.map((item) => {
      if (item.type === 'directory' && item.path === path) {
        // We found the directory to update
        return {
          ...item,
          children,
        };
      } else if (
        item.type === 'directory' &&
        item.children &&
        path.startsWith(item.path + '/')
      ) {
        // The path is inside this directory, so recurse into its children
        return {
          ...item,
          children: updateFileStructureWithChildren(
            item.children,
            path,
            children
          ),
        };
      }
      // This item is not affected
      return item;
    });
  };

  // Helper function to generate mock file structure for fallback
  const generateMockFileStructure = (): FileItem[] => {
    return [
      {
        name: 'src',
        path: 'src',
        type: 'directory',
        children: [
          {
            name: 'components',
            path: 'src/components',
            type: 'directory',
            children: [
              {
                name: 'Button.jsx',
                path: 'src/components/Button.jsx',
                type: 'file',
              },
              {
                name: 'Modal.jsx',
                path: 'src/components/Modal.jsx',
                type: 'file',
              },
              {
                name: 'Form.jsx',
                path: 'src/components/Form.jsx',
                type: 'file',
              },
            ],
          },
          {
            name: 'pages',
            path: 'src/pages',
            type: 'directory',
            children: [
              { name: 'index.js', path: 'src/pages/index.js', type: 'file' },
              { name: 'login.js', path: 'src/pages/login.js', type: 'file' },
              {
                name: 'dashboard.js',
                path: 'src/pages/dashboard.js',
                type: 'file',
              },
            ],
          },
          {
            name: 'utils',
            path: 'src/utils',
            type: 'directory',
            children: [
              { name: 'api.js', path: 'src/utils/api.js', type: 'file' },
              { name: 'auth.js', path: 'src/utils/auth.js', type: 'file' },
            ],
          },
        ],
      },
      {
        name: 'public',
        path: 'public',
        type: 'directory',
        children: [
          { name: 'index.html', path: 'public/index.html', type: 'file' },
          { name: 'styles.css', path: 'public/styles.css', type: 'file' },
        ],
      },
      { name: 'package.json', path: 'package.json', type: 'file' },
      { name: '.env.example', path: '.env.example', type: 'file' },
      { name: 'README.md', path: 'README.md', type: 'file' },
    ];
  };

  // Fetch modified files for a commit
  const fetchModifiedFilesForCommit = async (
    commitSha: string,
    shouldSetLoading = true
  ) => {
    if (shouldSetLoading) {
      setLoadingCommitFiles(true);
    }

    try {
      console.log(`Fetching modified files for commit: ${commitSha}`);
      // Call the API to get files modified in this commit
      const response = await fetch(
        `/api/projects/${projectId}/repository/commit?sha=${commitSha}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch commit details: ${response.status}`);
      }

      const data = await response.json();
      console.log('Modified files from API:', data.files);

      // Update the selected files based on the commit's modified files
      if (data.files && Array.isArray(data.files)) {
        // Extract valid file paths - handle both string paths and objects with filename property
        const validFiles = data.files
          .map((item: unknown) => {
            if (typeof item === 'string') {
              return item;
            } else if (item && typeof item === 'object' && 'filename' in item) {
              return item.filename;
            }
            return null;
          })
          .filter(Boolean) as string[];

        console.log('Valid file paths:', validFiles);
        setSelectedFiles(validFiles);

        // Update the commit object to include modified files for future reference
        setRecentCommits((prev) =>
          prev.map((commit) =>
            commit.sha === commitSha
              ? { ...commit, modified_files: validFiles }
              : commit
          )
        );

        // Need to ensure we load the directories containing these files
        const parentDirs = new Set<string>();
        data.files.forEach((fileItem: unknown) => {
          // Extract the file path from string or object
          let filePath: string | null = null;

          if (typeof fileItem === 'string') {
            filePath = fileItem;
          } else if (
            fileItem &&
            typeof fileItem === 'object' &&
            'filename' in fileItem
          ) {
            filePath = fileItem.filename as string;
          }

          // Process the file path if it's valid
          if (filePath) {
            const parts = filePath.split('/');
            let currentPath = '';
            for (let i = 0; i < parts.length - 1; i++) {
              currentPath = currentPath
                ? `${currentPath}/${parts[i]}`
                : parts[i];
              parentDirs.add(currentPath);
            }
          } else {
            console.error('Invalid filePath received:', fileItem);
          }
        });

        // Fetch directory contents for all parent directories
        const dirPromises = Array.from(parentDirs).map((dirPath) =>
          fetchRepositoryFiles(dirPath)
        );

        // Wait for all directory contents to be loaded
        await Promise.all(dirPromises);

        // Open all folders that contain selected files
        setOpenFolders((prev) => {
          const newOpenFolders = [...prev];
          parentDirs.forEach((folder) => {
            if (!newOpenFolders.includes(folder)) {
              newOpenFolders.push(folder);
            }
          });
          return newOpenFolders;
        });

        return true;
      } else {
        console.warn('No files found in commit or invalid format');
        return false;
      }
    } catch (error) {
      console.error('Error fetching modified files for commit:', error);

      // For demo/development - mock some modified files if API fails
      const mockModifiedFiles: string[] = [
        'src/components/Form.jsx',
        'src/utils/auth.js',
        'package.json',
      ];

      console.log('Using mock modified files:', mockModifiedFiles);
      setSelectedFiles(mockModifiedFiles);

      // Update the commit object with mock data
      setRecentCommits((prev) =>
        prev.map((commit) =>
          commit.sha === commitSha
            ? { ...commit, modified_files: mockModifiedFiles }
            : commit
        )
      );

      return true;
    } finally {
      if (shouldSetLoading) {
        setLoadingCommitFiles(false);
      }
    }
  };

  // Load the entire repository at a specific commit
  const loadRepositoryAtCommit = async (commitSha: string) => {
    console.log(`Loading entire repository structure at commit: ${commitSha}`);
    setRepoLoadingComplete(false);
    setCurrentRepoCommit(commitSha);

    try {
      // First, load the root directory at this commit
      await fetchRepositoryFiles('', commitSha);

      // Then, find modified files for this commit to pre-select them
      await fetchModifiedFilesForCommit(commitSha, false);

      setRepoLoadingComplete(true);
      return true;
    } catch (error) {
      console.error('Error loading repository at commit:', error);
      setRepoLoadingComplete(true);
      return false;
    }
  };

  // Update the handleBranchChange function
  const handleBranchChange = async (branchName: string) => {
    setSelectedBranch(branchName);
    setIsLoading(true);

    try {
      // Mocked API call for commits
      const mockCommits: RepoCommit[] = Array(5)
        .fill(0)
        .map((_, i) => ({
          sha: `${branchName}-commit-${i}`.replace(/[^a-z0-9]/g, '-'),
          message: `Update code in ${branchName} (commit ${i + 1})`,
          author: 'John Doe',
          date: new Date(Date.now() - i * 86400000).toISOString(),
        }));

      setRecentCommits(mockCommits);

      // Set first commit as selected and fetch its modified files if in incremental scan mode
      if (mockCommits.length > 0) {
        const firstCommitSha = mockCommits[0].sha;
        setSelectedCommit(firstCommitSha);

        if (scanType === 'incremental') {
          await fetchModifiedFilesForCommit(firstCommitSha);
        }
      } else {
        setSelectedCommit(null);
      }

      // Fetch files for the new branch
      await fetchRepositoryFiles('');
    } catch (err) {
      console.error('Error fetching data for branch:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch branch data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Update the commit selection click handler to not load files
  const handleCommitSelection = (commitSha: string) => {
    setSelectedCommit(commitSha);
    // Remove immediate file loading to delay until Next button is clicked
  };

  // Add function to fetch file content
  const fetchFileContent = async (filePath: string) => {
    setLoadingContent(true);
    setContentError(null);

    try {
      // Build the API URL - include commit SHA when in commit analysis mode
      let apiUrl = `/api/projects/${projectId}/repository/content?branch=${selectedBranch}&path=${filePath}`;

      // If we're in commit analysis mode and have a selected commit, use that specific version
      if (scanType === 'incremental' && selectedCommit) {
        apiUrl += `&commit=${selectedCommit}`;
        console.log(`Fetching file content from commit ${selectedCommit}`);
      }

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch file content: ${response.status}`);
      }

      const data = await response.json();
      setFileContent(data.content);
      setViewingFile(filePath);
    } catch (error) {
      console.error('Error fetching file content:', error);
      setContentError(
        error instanceof Error ? error.message : 'Failed to fetch file content'
      );
      setFileContent(null);
    } finally {
      setLoadingContent(false);
    }
  };

  // Add effect to expand folders containing selected files
  useEffect(() => {
    if (selectedFiles.length > 0) {
      // Find all parent directories of selected files
      const parentFolders = new Set<string>();

      selectedFiles.forEach((filePath) => {
        // Get all parent directory paths
        const parts = filePath.split('/');
        let currentPath = '';

        for (let i = 0; i < parts.length - 1; i++) {
          currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];
          parentFolders.add(currentPath);
        }
      });

      // Add all parent folders to openFolders state
      setOpenFolders((prev) => {
        const newOpenFolders = [...prev];
        parentFolders.forEach((folder) => {
          if (!newOpenFolders.includes(folder)) {
            newOpenFolders.push(folder);
          }
        });
        return newOpenFolders;
      });

      // Make sure we load all necessary directory contents
      parentFolders.forEach((path) => {
        fetchRepositoryFiles(path);
      });
    }
  }, [selectedFiles]);

  // Modify toggleFileSelection to also handle parent paths
  const toggleFileSelection = (path: string, e?: React.MouseEvent) => {
    // If event is provided, stop propagation to prevent triggering file view
    if (e) {
      e.stopPropagation();
    }

    setSelectedFiles((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  // Handle viewing a file
  const handleViewFile = (file: FileItem) => {
    if (file.type === 'file') {
      fetchFileContent(file.path);
    }
  };

  // Handle toggle all vulnerability types
  const toggleAllVulnerabilityTypes = (checked: boolean) => {
    if (checked) {
      setSelectedVulnerabilityTypes(vulnerabilityTypes.map((vt) => vt.id));
    } else {
      setSelectedVulnerabilityTypes([]);
    }
  };

  // Fetch custom vulnerabilities for the project
  const fetchCustomVulnerabilities = async () => {
    setIsLoadingCustomVulnerabilities(true);
    try {
      const response = await fetch(
        `/api/vulnerabilities/custom?projectId=${projectId}`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch custom vulnerabilities: ${response.status}`
        );
      }
      const data = await response.json();
      setCustomVulnerabilities(data.customVulnerabilities || []);
    } catch (error) {
      console.error('Error fetching custom vulnerabilities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load custom vulnerabilities',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingCustomVulnerabilities(false);
    }
  };

  /**
   * Validates the format of a CVE code.
   * Valid format: CVE-YYYY-NNNNN where YYYY is a year and NNNNN is a sequence number.
   * @param cveCode The CVE code to validate
   * @returns True if the CVE code is valid, false otherwise
   */
  const validateCveFormat = (cveCode: string): boolean => {
    // CVE format: CVE-YYYY-NNNNN (year-sequence number)
    const cveRegex = /^CVE-\d{4}-\d{4,}$/;
    return cveRegex.test(cveCode);
  };

  // Function to lookup CVE data
  const lookupCveData = async (cveCode: string) => {
    if (!cveCode) return;

    // Validate CVE format
    if (!validateCveFormat(cveCode)) {
      setCveLookupError('Invalid CVE format. Expected format: CVE-YYYY-NNNNN');
      return;
    }

    try {
      setIsCveLookupLoading(true);
      setCveLookupError(null);

      const response = await fetch(`/api/cve/${cveCode}`);

      if (!response.ok) {
        const errorData = await response.json();
        setCveLookupError(errorData.error || 'Failed to fetch CVE data');
        setIsCveOfficial(false);
        return;
      }

      const data = await response.json();

      // Auto-populate name and description fields
      setNewVulnerabilityName(data.name);
      setNewVulnerabilityDescription(data.description);
      setIsCveOfficial(true);

      toast({
        title: 'CVE Found',
        description: 'Official CVE data retrieved successfully',
      });
    } catch (error) {
      console.error('Error fetching CVE data:', error);
      setCveLookupError('Failed to fetch CVE data');
      setIsCveOfficial(false);
    } finally {
      setIsCveLookupLoading(false);
    }
  };

  // Function to reset the custom vulnerability form
  const resetCustomVulnerabilityForm = () => {
    setNewVulnerabilityName('');
    setNewVulnerabilityDescription('');
    setNewVulnerabilityCveCode('');
    setCveLookupError(null);
    setIsCveOfficial(false);
    setIsDuplicateCve(false);
  };

  // Function to open the custom vulnerability form with clean state
  const openCustomVulnerabilityForm = () => {
    resetCustomVulnerabilityForm();
    setIsAddingCustomVulnerability(true);
  };

  // Reset form fields when the form is opened
  useEffect(() => {
    if (isAddingCustomVulnerability) {
      // Only reset if we're opening the form (not when closing it)
      resetCustomVulnerabilityForm();
    }
  }, [isAddingCustomVulnerability]);

  // Auto-lookup CVE data when a valid code is entered
  useEffect(() => {
    // Don't do anything if there's no CVE code or if it's too short
    if (!newVulnerabilityCveCode || newVulnerabilityCveCode.length < 10) {
      setIsDuplicateCve(false);
      return;
    }

    // Check for duplicates before looking up
    const duplicateCve = customVulnerabilities.find(
      (v) => v.cve_code === newVulnerabilityCveCode
    );

    if (duplicateCve) {
      // Set error message instead of closing the form
      setCveLookupError(
        `A vulnerability with CVE code ${newVulnerabilityCveCode} already exists in this project`
      );
      setIsCveOfficial(false);
      setIsDuplicateCve(true);

      // Highlight the existing vulnerability
      if (!selectedCustomVulnerabilities.includes(duplicateCve.id)) {
        setSelectedCustomVulnerabilities([
          ...selectedCustomVulnerabilities,
          duplicateCve.id,
        ]);
      }

      return;
    }

    // Reset duplicate flag if no duplicate found
    setIsDuplicateCve(false);

    // Use a debounce to avoid too many API calls while typing
    const timer = setTimeout(() => {
      if (validateCveFormat(newVulnerabilityCveCode)) {
        lookupCveData(newVulnerabilityCveCode);
      }
    }, 800); // 800ms debounce

    // Clean up the timer
    return () => clearTimeout(timer);
  }, [newVulnerabilityCveCode]);

  // Add a new custom vulnerability
  const addCustomVulnerability = async () => {
    if (!newVulnerabilityName.trim() || !newVulnerabilityDescription.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Name and description are required',
        variant: 'destructive',
      });
      return;
    }

    // Validate CVE code format if provided
    if (
      newVulnerabilityCveCode &&
      !validateCveFormat(newVulnerabilityCveCode)
    ) {
      toast({
        title: 'Validation Error',
        description: 'Invalid CVE format. Expected format: CVE-YYYY-NNNNN',
        variant: 'destructive',
      });
      return;
    }

    // Check if this CVE is already in the list (client-side check for better UX)
    if (newVulnerabilityCveCode) {
      const duplicateCve = customVulnerabilities.find(
        (v) => v.cve_code === newVulnerabilityCveCode
      );

      if (duplicateCve) {
        toast({
          title: 'Duplicate CVE',
          description: `A vulnerability with CVE code ${newVulnerabilityCveCode} already exists in this project`,
          variant: 'destructive',
        });
        return;
      }
    }

    try {
      const response = await fetch('/api/vulnerabilities/custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          name: newVulnerabilityName.trim(),
          description: newVulnerabilityDescription.trim(),
          cveCode: newVulnerabilityCveCode.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle duplicate CVE error (409 Conflict)
        if (response.status === 409 && errorData.existingVulnerability) {
          // Find the existing vulnerability in our list
          const existingVuln = customVulnerabilities.find(
            (v) => v.id === errorData.existingVulnerability.id
          );

          // If it's not in our list yet (could happen if list was loaded earlier), add it
          if (!existingVuln) {
            setCustomVulnerabilities([
              ...customVulnerabilities,
              errorData.existingVulnerability,
            ]);
            // Auto-select the existing vulnerability
            setSelectedCustomVulnerabilities([
              ...selectedCustomVulnerabilities,
              errorData.existingVulnerability.id,
            ]);
          } else {
            // Highlight the existing vulnerability by ensuring it's selected
            if (!selectedCustomVulnerabilities.includes(existingVuln.id)) {
              setSelectedCustomVulnerabilities([
                ...selectedCustomVulnerabilities,
                existingVuln.id,
              ]);
            }
          }

          toast({
            title: 'Duplicate CVE',
            description: errorData.error,
            variant: 'destructive',
          });

          // Close the form
          setIsAddingCustomVulnerability(false);
          return;
        }

        throw new Error(
          errorData.error ||
            `Failed to create custom vulnerability: ${response.status}`
        );
      }

      const data = await response.json();

      // Add the new vulnerability to the list and clear the form
      setCustomVulnerabilities([
        ...customVulnerabilities,
        data.customVulnerability,
      ]);
      setNewVulnerabilityName('');
      setNewVulnerabilityDescription('');
      setNewVulnerabilityCveCode('');
      setCveLookupError(null);
      setIsCveOfficial(false);
      setIsAddingCustomVulnerability(false);

      // Automatically select the newly added vulnerability
      setSelectedCustomVulnerabilities([
        ...selectedCustomVulnerabilities,
        data.customVulnerability.id,
      ]);

      toast({
        title: 'Success',
        description: 'Custom vulnerability added successfully',
      });
    } catch (error) {
      console.error('Error adding custom vulnerability:', error);
      toast({
        title: 'Error',
        description: 'Failed to add custom vulnerability',
        variant: 'destructive',
      });
    }
  };

  // Delete a custom vulnerability
  const deleteCustomVulnerability = async (id: string) => {
    try {
      const response = await fetch(
        `/api/vulnerabilities/custom?id=${id}&projectId=${projectId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to delete custom vulnerability: ${response.status}`
        );
      }

      // Remove the vulnerability from the list and from selected vulnerabilities
      setCustomVulnerabilities(
        customVulnerabilities.filter((v) => v.id !== id)
      );
      setSelectedCustomVulnerabilities(
        selectedCustomVulnerabilities.filter((vulnId) => vulnId !== id)
      );

      toast({
        title: 'Success',
        description: 'Custom vulnerability deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting custom vulnerability:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete custom vulnerability',
        variant: 'destructive',
      });
    }
  };

  // Toggle selection of a custom vulnerability
  const toggleCustomVulnerabilitySelection = (id: string) => {
    setSelectedCustomVulnerabilities((prev) =>
      prev.includes(id) ? prev.filter((vulnId) => vulnId !== id) : [...prev, id]
    );
  };

  // Load custom vulnerabilities when project ID is available and when reaching step 2
  useEffect(() => {
    if (projectId && currentStep === 2) {
      fetchCustomVulnerabilities();
    }
  }, [projectId, currentStep]);

  // Handle toggle individual vulnerability type
  const toggleVulnerabilityType = (id: string) => {
    setSelectedVulnerabilityTypes((prev) =>
      prev.includes(id) ? prev.filter((typeId) => typeId !== id) : [...prev, id]
    );
  };

  // Recursive file browser component with directory loading capability
  const FileBrowser = ({
    items,
    level = 0,
  }: {
    items: FileItem[];
    level?: number;
  }) => {
    // First sort items to show directories first, then files
    const sortedItems = [...items].sort((a, b) => {
      // If types are different, directories come first
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      // If types are the same, sort alphabetically
      return a.name.localeCompare(b.name);
    });

    // Recursive search function that preserves structure
    const recursiveSearch = (items: FileItem[], query: string): FileItem[] => {
      if (!query) return items;

      const lowerQuery = query.toLowerCase();

      return items
        .map((item) => {
          // Check if this item matches (either by name or full path)
          const nameMatch = item.name.toLowerCase().includes(lowerQuery);
          const pathMatch = item.path.toLowerCase().includes(lowerQuery);
          const isMatch = nameMatch || pathMatch;

          if (item.type === 'directory' && item.children) {
            // For directories, also check children
            const matchingChildren = recursiveSearch(item.children, query);

            // Keep this directory if it matches or has matching children
            if (isMatch || matchingChildren.length > 0) {
              return {
                ...item,
                children: matchingChildren,
              };
            }
            return null; // No match in this branch
          }

          // For files, just check if it matches
          return isMatch ? item : null;
        })
        .filter(Boolean) as FileItem[]; // Remove null items
    };

    // Apply search filtering with the recursive function
    const filteredItems = searchQuery
      ? recursiveSearch(sortedItems, searchQuery)
      : sortedItems;

    // Load directory contents on first render
    useEffect(() => {
      filteredItems.forEach((item) => {
        if (
          item.type === 'directory' &&
          (!item.children || item.children.length === 0)
        ) {
          fetchRepositoryFiles(item.path);
        }
      });
    }, [filteredItems]);

    // Handle accordion state change
    const handleAccordionChange = (value: string | string[]) => {
      // If the accordion is expanding a directory, ensure its contents are loaded
      if (Array.isArray(value)) {
        // For type="multiple"
        setOpenFolders(value);
        value.forEach((path) => {
          const item = filteredItems.find((item) => item.path === path);
          if (
            item &&
            item.type === 'directory' &&
            (!item.children || item.children.length === 0)
          ) {
            fetchRepositoryFiles(path);
          }
        });
      }
    };

    // Handle directory checkbox click
    const handleDirectoryCheckboxClick = (
      e: React.MouseEvent,
      item: FileItem,
      checked: boolean
    ) => {
      e.stopPropagation(); // Prevent event from bubbling to accordion trigger

      // Toggle all children recursively
      const toggleChildren = (items: FileItem[]) => {
        items.forEach((item) => {
          if (item.type === 'file') {
            if (checked) {
              if (!selectedFiles.includes(item.path)) {
                toggleFileSelection(item.path);
              }
            } else {
              if (selectedFiles.includes(item.path)) {
                toggleFileSelection(item.path);
              }
            }
          } else if (item.children) {
            toggleChildren(item.children);
          }
        });
      };

      if (item.children) {
        toggleChildren(item.children);
      }
    };

    return (
      <div className="space-y-1">
        {filteredItems.map((item) => {
          // Calculate how many files are selected in this directory (recursively)
          const getSelectedFileCount = (item: FileItem): number => {
            if (item.type === 'file') {
              return selectedFiles.includes(item.path) ? 1 : 0;
            }
            if (!item.children) return 0;
            return item.children.reduce(
              (sum, child) => sum + getSelectedFileCount(child),
              0
            );
          };

          const selectedCount = getSelectedFileCount(item);
          const totalFiles =
            item.type === 'directory' && item.children
              ? item.children.filter((child) => child.type === 'file').length +
                item.children
                  .filter((child) => child.type === 'directory')
                  .reduce((sum, dir) => {
                    // If children are undefined or empty array, we haven't loaded them yet
                    if (!dir.children || dir.children.length === 0) return sum;
                    return sum + getSelectedFileCount(dir);
                  }, 0)
              : 0;

          const isViewing = viewingFile === item.path;

          return (
            <div key={item.path}>
              {item.type === 'file' ? (
                <div
                  className={`flex items-center space-x-2 py-1 hover:bg-muted rounded px-2 ${
                    isViewing ? 'bg-muted' : ''
                  }`}
                  style={{ paddingLeft: `${level * 16 + 8}px` }}
                  onClick={() => handleViewFile(item)}
                >
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      id={item.path}
                      checked={selectedFiles.includes(item.path)}
                      onCheckedChange={() => toggleFileSelection(item.path)}
                    />
                  </div>
                  <label
                    className="flex items-center cursor-pointer flex-1"
                    onClick={() => handleViewFile(item)}
                  >
                    <FileCode className="h-4 w-4 mr-2 text-blue-500" />
                    {item.name}
                    {item.size && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({formatFileSize(item.size)})
                      </span>
                    )}
                  </label>
                </div>
              ) : (
                <div>
                  <Accordion
                    type="multiple"
                    value={openFolders}
                    onValueChange={handleAccordionChange}
                  >
                    <AccordionItem value={item.path} className="border-none">
                      <div
                        className="flex items-center space-x-2 py-1 hover:bg-muted rounded px-2"
                        style={{ paddingLeft: `${level * 16 + 8}px` }}
                      >
                        <div onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            id={`dir-${item.path}`}
                            checked={
                              item.children &&
                              item.children.length > 0 &&
                              item.children.every((child) =>
                                child.type === 'file'
                                  ? selectedFiles.includes(child.path)
                                  : true
                              )
                            }
                            onCheckedChange={(checked: boolean) => {
                              handleDirectoryCheckboxClick(
                                {
                                  stopPropagation: () => {},
                                } as React.MouseEvent,
                                item,
                                !!checked
                              );
                            }}
                          />
                        </div>
                        <AccordionTrigger className="hover:no-underline py-0">
                          <div className="flex items-center">
                            <Folder className="h-4 w-4 mr-2 text-yellow-500" />
                            <span>{item.name}</span>
                            {totalFiles > 0 && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({selectedCount}/{totalFiles} files)
                              </span>
                            )}
                          </div>
                        </AccordionTrigger>
                      </div>
                      <AccordionContent className="pb-0 pt-1">
                        {loadingFiles && currentPath === item.path ? (
                          <div className="flex justify-center py-4">
                            <LoaderCircle className="h-5 w-5 animate-spin text-muted-foreground" />
                          </div>
                        ) : fileLoadError && currentPath === item.path ? (
                          <div className="text-destructive px-4 py-2 text-sm">
                            Failed to load files: {fileLoadError}
                          </div>
                        ) : item.children && item.children.length > 0 ? (
                          <FileBrowser
                            items={item.children}
                            level={level + 1}
                          />
                        ) : (
                          <div className="pl-8 py-2 text-sm text-muted-foreground">
                            No files found
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // New function to recursively fetch all files in the repository
  const fetchAllRepositoryFiles = async () => {
    setLoadingAllFiles(true);
    console.log('Starting to fetch all repository files...');

    try {
      // Create a set to store all file paths (to avoid duplicates)
      const allFilePaths = new Set<string>();
      // Create a queue of directories to process
      const directoriesToProcess: string[] = [''];

      // Process all directories recursively
      while (directoriesToProcess.length > 0) {
        const currentPath = directoriesToProcess.shift() as string;
        console.log(`Fetching files for directory: "${currentPath}"`);

        const items = await fetchRepositoryFiles(currentPath);

        // Add files to the set and directories to the queue
        for (const item of items) {
          if (item.type === 'file') {
            allFilePaths.add(item.path);
          } else if (item.type === 'directory') {
            directoriesToProcess.push(item.path);
          }
        }
      }

      // Convert set to array and update selectedFiles state
      const filePathsArray = Array.from(allFilePaths);
      console.log(`Found ${filePathsArray.length} total files in repository`);
      setSelectedFiles(filePathsArray);
      setAllFilesLoaded(true);

      // Make sure all parent directories are opened
      const parentDirs = new Set<string>();
      filePathsArray.forEach((filePath) => {
        const parts = filePath.split('/');
        let currentPath = '';
        for (let i = 0; i < parts.length - 1; i++) {
          currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];
          parentDirs.add(currentPath);
        }
      });

      setOpenFolders(Array.from(parentDirs));

      return filePathsArray;
    } catch (error) {
      console.error('Error fetching all repository files:', error);
      toast({
        title: 'Error',
        description:
          'Failed to fetch all repository files. Please try a targeted scan instead.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoadingAllFiles(false);
    }
  };

  // Modify handleNext to fetch all files when moving from step 1 to step 2 with full scan
  const handleNext = async () => {
    // If moving from step 1 to step 2 for full scan, start loading all files
    if (currentStep === 1 && scanType === 'full' && !allFilesLoaded) {
      setLoadingAllFiles(true);
      await fetchAllRepositoryFiles();
      setLoadingAllFiles(false);
    }
    // Existing code for incremental scan
    else if (
      currentStep === 1 &&
      scanType === 'incremental' &&
      selectedCommit
    ) {
      setLoadingCommitFiles(true);
      await loadRepositoryAtCommit(selectedCommit);
      setLoadingCommitFiles(false);
    }
    // Existing logic for moving from step 2 to step 3
    else if (
      currentStep === 2 &&
      scanType === 'incremental' &&
      selectedCommit
    ) {
      setLoadingCommitFiles(true);

      // If we already have the repo loaded at this commit, just ensure all folders for selected files are expanded
      if (currentRepoCommit === selectedCommit && repoLoadingComplete) {
        const currentCommit = recentCommits.find(
          (c) => c.sha === selectedCommit
        );

        if (
          currentCommit?.modified_files &&
          currentCommit.modified_files.length > 0
        ) {
          // Ensure directories for modified files are expanded
          const parentDirs = new Set<string>();
          currentCommit.modified_files.forEach((filePath: string) => {
            const parts = filePath.split('/');
            let currentPath = '';
            for (let i = 0; i < parts.length - 1; i++) {
              currentPath = currentPath
                ? `${currentPath}/${parts[i]}`
                : parts[i];
              parentDirs.add(currentPath);
            }
          });

          // Open all folders that contain selected files
          setOpenFolders((prev) => {
            const newOpenFolders = [...prev];
            parentDirs.forEach((folder) => {
              if (!newOpenFolders.includes(folder)) {
                newOpenFolders.push(folder);
              }
            });
            return newOpenFolders;
          });
        }
      } else {
        // If repo isn't loaded at this commit yet, load it
        await loadRepositoryAtCommit(selectedCommit);
      }

      setLoadingCommitFiles(false);
    }

    setCurrentStep(currentStep + 1);
    return null; // Return null to fix void return type in renderStepContent
  };

  // Handle back step
  const handleBack = () => {
    if (currentStep > 1) {
      // If we're at the confirmation step and using full scan, go back to step 2
      if (currentStep === 4 && scanType === 'full') {
        setCurrentStep(2);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  // Handle final submission
  const handleCreateScan = async () => {
    setIsLoading(true);
    try {
      // Get selected custom vulnerabilities data to include in the scan
      const selectedCustomVulnerabilitiesData = customVulnerabilities
        .filter((vuln) => selectedCustomVulnerabilities.includes(vuln.id))
        .map((vuln) => ({
          id: vuln.id,
          name: vuln.name,
          description: vuln.description,
        }));

      const payload = {
        scan_type: scanType,
        branch: selectedBranch,
        vulnerability_types: selectedVulnerabilityTypes,
        custom_vulnerabilities: selectedCustomVulnerabilitiesData,
        files: selectedFiles,
        commit_hash: scanType === 'incremental' ? selectedCommit : null,
      };

      const response = await fetch(`/api/projects/${projectId}/scans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create scan');
      }

      const data = await response.json();
      console.log('Scan initiated successfully:', data);

      // Show toast message
      toast({
        title: 'Security scan initiated',
        description: 'Your scan has been queued and will start shortly.',
      });

      // Redirect to scans page since we don't have a specific scan ID yet
      router.push(`/projects/${projectId}/scans`);
    } catch (error) {
      console.error('Error creating scan:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to create scan. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  // Helper function to detect language from file path
  const detectLanguage = (filePath: string): string => {
    const extension = filePath.split('.').pop()?.toLowerCase() || '';
    const languageMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'jsx',
      ts: 'typescript',
      tsx: 'tsx',
      py: 'python',
      rb: 'ruby',
      java: 'java',
      go: 'go',
      php: 'php',
      html: 'html',
      css: 'css',
      scss: 'scss',
      json: 'json',
      yaml: 'yaml',
      yml: 'yaml',
      md: 'markdown',
      sh: 'bash',
      bash: 'bash',
      c: 'c',
      cpp: 'cpp',
      cs: 'csharp',
      sql: 'sql',
      graphql: 'graphql',
      swift: 'swift',
      kt: 'kotlin',
      rs: 'rust',
      dart: 'dart',
    };

    return languageMap[extension] || 'text';
  };

  // Render the appropriate step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Select Scan Type</CardTitle>
              <CardDescription>
                Choose how you want to scan your repository
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    scanType === 'full'
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setScanType('full')}
                >
                  <div className="flex items-center">
                    <div
                      className={`rounded-full p-2 mr-4 ${
                        scanType === 'full' ? 'bg-primary/10' : 'bg-muted'
                      }`}
                    >
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Full Scan</h3>
                      <p className="text-sm text-muted-foreground">
                        Scan the entire codebase for all types of
                        vulnerabilities
                      </p>
                    </div>
                    {scanType === 'full' && (
                      <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                    )}
                  </div>
                </div>

                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    scanType === 'incremental'
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setScanType('incremental')}
                >
                  <div className="flex items-center">
                    <div
                      className={`rounded-full p-2 mr-4 ${
                        scanType === 'incremental'
                          ? 'bg-primary/10'
                          : 'bg-muted'
                      }`}
                    >
                      <GitCommit className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Incremental Scan</h3>
                      <p className="text-sm text-muted-foreground">
                        Scan only modified files and their dependencies in a
                        specific commit
                      </p>
                    </div>
                    {scanType === 'incremental' && (
                      <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                    )}
                  </div>
                </div>

                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    scanType === 'targeted'
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setScanType('targeted')}
                >
                  <div className="flex items-center">
                    <div
                      className={`rounded-full p-2 mr-4 ${
                        scanType === 'targeted' ? 'bg-primary/10' : 'bg-muted'
                      }`}
                    >
                      <List className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Targeted Scan</h3>
                      <p className="text-sm text-muted-foreground">
                        Select specific files or directories to scan
                      </p>
                    </div>
                    {scanType === 'targeted' && (
                      <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                    )}
                  </div>
                </div>

                {/* Branch Selection */}
                <div className="mt-6 space-y-2">
                  <Label>Select Branch</Label>
                  <Select
                    value={selectedBranch}
                    onValueChange={handleBranchChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBranches.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          <div className="flex items-center">
                            <GitBranch className="h-4 w-4 mr-2" />
                            {branch}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Commit selection (only for incremental analysis) */}
                {scanType === 'incremental' && (
                  <div className="mt-4 space-y-2">
                    <Label>Select Commit</Label>
                    <div className="border rounded-lg max-h-48 overflow-auto">
                      {recentCommits.length > 0 ? (
                        recentCommits.map((commit) => (
                          <div
                            key={commit.sha}
                            className={`p-3 border-b last:border-0 cursor-pointer hover:bg-muted/50 ${
                              selectedCommit === commit.sha
                                ? 'bg-primary/5'
                                : ''
                            }`}
                            onClick={() => handleCommitSelection(commit.sha)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="font-medium truncate max-w-[300px]">
                                  {commit.message}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {commit.author} ·{' '}
                                  {new Date(commit.date).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center">
                                {commit.modified_files && (
                                  <span className="text-xs mr-2 text-muted-foreground">
                                    {commit.modified_files.length} files
                                  </span>
                                )}
                                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                  {commit.sha.substring(0, 7)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          No commits found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Select Vulnerability Types</CardTitle>
              <CardDescription>
                Choose which types of vulnerabilities to scan for
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAllFiles ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <LoaderCircle className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-center text-muted-foreground">
                    Loading all repository files for full scan...
                    <br />
                    This may take a moment for large repositories.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all"
                      checked={
                        selectedVulnerabilityTypes.length ===
                        vulnerabilityTypes.length
                      }
                      onCheckedChange={(checked: boolean) =>
                        toggleAllVulnerabilityTypes(checked)
                      }
                    />
                    <label
                      htmlFor="select-all"
                      className="font-medium cursor-pointer"
                    >
                      Select All
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {vulnerabilityTypes.map((vulnType) => (
                      <div
                        key={vulnType.id}
                        className="flex items-start space-x-2"
                      >
                        <Checkbox
                          id={vulnType.id}
                          checked={selectedVulnerabilityTypes.includes(
                            vulnType.id
                          )}
                          onCheckedChange={() =>
                            toggleVulnerabilityType(vulnType.id)
                          }
                        />
                        <div>
                          <label
                            htmlFor={vulnType.id}
                            className="flex items-center font-medium cursor-pointer"
                          >
                            {vulnType.icon}
                            {vulnType.name}
                          </label>
                          <p className="text-sm text-muted-foreground ml-6">
                            {vulnType.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Custom Vulnerabilities Section */}
                  <div className="mt-8 pt-6 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">
                        Custom Vulnerabilities
                      </h3>
                      {!isAddingCustomVulnerability && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsAddingCustomVulnerability(true)}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Custom
                        </Button>
                      )}
                    </div>

                    {isLoadingCustomVulnerabilities ? (
                      <div className="flex items-center justify-center py-4">
                        <LoaderCircle className="h-5 w-5 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">
                          Loading custom vulnerabilities...
                        </span>
                      </div>
                    ) : isAddingCustomVulnerability ? (
                      <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">
                              Choose vulnerability source:
                            </h4>
                          </div>

                          {/* CVE Code Input Section */}
                          <div className="border p-4 rounded-md">
                            <div className="flex items-center gap-2 mb-2">
                              <input
                                type="radio"
                                id="use-cve"
                                name="vulnerability-source"
                                checked={
                                  isCveOfficial ||
                                  (!newVulnerabilityName &&
                                    !newVulnerabilityDescription)
                                }
                                onChange={() => {
                                  // Clear custom fields if user had entered them
                                  if (
                                    newVulnerabilityName ||
                                    newVulnerabilityDescription
                                  ) {
                                    setNewVulnerabilityName('');
                                    setNewVulnerabilityDescription('');
                                  }
                                }}
                                className="h-4 w-4"
                              />
                              <Label
                                htmlFor="use-cve"
                                className="font-medium cursor-pointer"
                              >
                                Use Official CVE
                              </Label>
                            </div>

                            <div className="pl-6">
                              <Label
                                htmlFor="vulnerability-cve"
                                className="text-sm"
                              >
                                CVE Code
                              </Label>
                              <div className="flex gap-2 mt-1">
                                <Input
                                  id="vulnerability-cve"
                                  placeholder="E.g., CVE-2023-4567"
                                  value={newVulnerabilityCveCode}
                                  onChange={(e) => {
                                    setNewVulnerabilityCveCode(e.target.value);
                                    setCveLookupError(null);
                                    setIsCveOfficial(false);

                                    // Clear custom fields if user had entered them
                                    if (
                                      newVulnerabilityName ||
                                      newVulnerabilityDescription
                                    ) {
                                      setNewVulnerabilityName('');
                                      setNewVulnerabilityDescription('');
                                    }
                                  }}
                                  className={
                                    cveLookupError ? 'border-red-500' : ''
                                  }
                                  disabled={isCveLookupLoading}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    lookupCveData(newVulnerabilityCveCode)
                                  }
                                  disabled={
                                    !newVulnerabilityCveCode ||
                                    isCveLookupLoading
                                  }
                                >
                                  {isCveLookupLoading ? (
                                    <>
                                      <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                                      Lookup
                                    </>
                                  ) : (
                                    'Lookup'
                                  )}
                                </Button>
                              </div>
                              {cveLookupError ? (
                                <div className="flex items-center mt-1">
                                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                                  <p className="text-xs text-red-500">
                                    {cveLookupError}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {isCveLookupLoading
                                    ? 'Looking up CVE data...'
                                    : 'Format: CVE-YYYY-NNNNN'}
                                  {isCveOfficial &&
                                    !isCveLookupLoading &&
                                    !isDuplicateCve && (
                                      <span className="ml-1 text-green-600">
                                        ✓ Official CVE data loaded
                                      </span>
                                    )}
                                </p>
                              )}

                              {isCveOfficial && (
                                <div className="mt-3 space-y-2">
                                  <div>
                                    <Label className="text-xs text-muted-foreground">
                                      Name (auto-populated)
                                    </Label>
                                    <p className="text-sm">
                                      {newVulnerabilityName}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-muted-foreground">
                                      Description (auto-populated)
                                    </Label>
                                    <p className="text-sm">
                                      {newVulnerabilityDescription}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Custom Vulnerability Section */}
                          <div className="border p-4 rounded-md">
                            <div className="flex items-center gap-2 mb-2">
                              <input
                                type="radio"
                                id="use-custom"
                                name="vulnerability-source"
                                checked={
                                  !isCveOfficial &&
                                  (newVulnerabilityName !== '' ||
                                    newVulnerabilityDescription !== '')
                                }
                                onChange={() => {
                                  // Clear CVE field if user had entered it
                                  if (newVulnerabilityCveCode) {
                                    setNewVulnerabilityCveCode('');
                                    setCveLookupError(null);
                                    setIsCveOfficial(false);
                                  }
                                }}
                                className="h-4 w-4"
                              />
                              <Label
                                htmlFor="use-custom"
                                className="font-medium cursor-pointer"
                              >
                                Define Custom Vulnerability
                              </Label>
                            </div>

                            <div className="pl-6">
                              <div className="mb-3">
                                <Label
                                  htmlFor="vulnerability-name"
                                  className="text-sm"
                                >
                                  Name
                                </Label>
                                <Input
                                  id="vulnerability-name"
                                  placeholder="E.g., Custom Authentication Bypass"
                                  value={newVulnerabilityName}
                                  onChange={(e) => {
                                    setNewVulnerabilityName(e.target.value);
                                    // Clear CVE field if user had entered it
                                    if (
                                      newVulnerabilityCveCode ||
                                      isCveOfficial
                                    ) {
                                      setNewVulnerabilityCveCode('');
                                      setCveLookupError(null);
                                      setIsCveOfficial(false);
                                    }
                                  }}
                                  disabled={isCveOfficial}
                                />
                              </div>
                              <div>
                                <Label
                                  htmlFor="vulnerability-description"
                                  className="text-sm"
                                >
                                  Description
                                </Label>
                                <Textarea
                                  id="vulnerability-description"
                                  placeholder="Describe the vulnerability and why it's important to scan for it..."
                                  value={newVulnerabilityDescription}
                                  onChange={(e) => {
                                    setNewVulnerabilityDescription(
                                      e.target.value
                                    );
                                    // Clear CVE field if user had entered it
                                    if (
                                      newVulnerabilityCveCode ||
                                      isCveOfficial
                                    ) {
                                      setNewVulnerabilityCveCode('');
                                      setCveLookupError(null);
                                      setIsCveOfficial(false);
                                    }
                                  }}
                                  rows={3}
                                  disabled={isCveOfficial}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsAddingCustomVulnerability(false);
                              setNewVulnerabilityName('');
                              setNewVulnerabilityDescription('');
                              setNewVulnerabilityCveCode('');
                              setCveLookupError(null);
                              setIsCveOfficial(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={addCustomVulnerability}
                            disabled={isDuplicateCve}
                            title={
                              isDuplicateCve
                                ? 'Cannot save duplicate CVE'
                                : 'Save vulnerability'
                            }
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : customVulnerabilities.length === 0 ? (
                      <div className="text-center py-6 border rounded-lg bg-muted/10">
                        <p className="text-muted-foreground mb-2">
                          No custom vulnerabilities defined yet
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsAddingCustomVulnerability(true)}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Your First Custom Vulnerability
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="relative mb-3">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search vulnerabilities..."
                            className="pl-8"
                            value={customVulnerabilitySearch}
                            onChange={(e) =>
                              setCustomVulnerabilitySearch(e.target.value)
                            }
                          />
                        </div>
                        <div className="max-h-[400px] overflow-y-auto pr-1 space-y-3">
                          {customVulnerabilities
                            .filter(
                              (vulnerability) =>
                                vulnerability.name
                                  .toLowerCase()
                                  .includes(
                                    customVulnerabilitySearch.toLowerCase()
                                  ) ||
                                (vulnerability.cve_code &&
                                  vulnerability.cve_code
                                    .toLowerCase()
                                    .includes(
                                      customVulnerabilitySearch.toLowerCase()
                                    ))
                            )
                            .map((vulnerability) => (
                              <div
                                key={vulnerability.id}
                                className="p-3 border rounded-lg hover:bg-muted/10"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start space-x-2">
                                    <Checkbox
                                      id={`custom-${vulnerability.id}`}
                                      checked={selectedCustomVulnerabilities.includes(
                                        vulnerability.id
                                      )}
                                      onCheckedChange={() =>
                                        toggleCustomVulnerabilitySelection(
                                          vulnerability.id
                                        )
                                      }
                                    />
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <label
                                          htmlFor={`custom-${vulnerability.id}`}
                                          className="font-medium cursor-pointer"
                                        >
                                          {vulnerability.name}
                                        </label>
                                        {vulnerability.cve_code ? (
                                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            Official CVE
                                          </span>
                                        ) : (
                                          <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
                                            Custom
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {vulnerability.description}
                                      </p>
                                      {vulnerability.cve_code && (
                                        <p className="text-xs text-primary mt-1 flex items-center font-mono">
                                          <ShieldAlert className="h-3 w-3 mr-1" />
                                          {vulnerability.cve_code}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() =>
                                      deleteCustomVulnerability(
                                        vulnerability.id
                                      )
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {scanType === 'full' && allFilesLoaded && (
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {selectedFiles.length} files will be included in this scan
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 3:
        // Modify to handle the Full Scan case properly
        if (scanType === 'full') {
          // Skip file selection for full scans - now we've already loaded the files
          return handleNext();
        }

        // Existing code for step 3
        return (
          <Card className="min-h-[500px]">
            <CardHeader>
              <CardTitle>Select Files</CardTitle>
              <CardDescription>
                {scanType === 'incremental'
                  ? 'These files were modified in the selected commit. You can customize which ones to scan.'
                  : 'Choose specific files or directories to include in the scan.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative mb-4">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search files..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  {/* File browser - make narrower */}
                  <div className="border rounded-lg p-2 min-h-[450px] max-h-[550px] overflow-auto w-1/3">
                    {fileStructure.length > 0 ? (
                      <FileBrowser items={fileStructure} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No files found
                      </div>
                    )}
                  </div>

                  {/* Code viewer - make wider */}
                  <div className="border rounded-lg min-h-[450px] max-h-[550px] overflow-auto w-2/3">
                    {loadingContent ? (
                      <div className="flex justify-center items-center h-full">
                        <LoaderCircle className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : viewingFile ? (
                      <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between bg-muted px-3 py-1 border-b">
                          <div className="flex items-center">
                            <FileCode className="h-4 w-4 mr-2" />
                            <span className="font-medium text-sm">
                              {viewingFile.split('/').pop()}
                            </span>
                            {scanType === 'incremental' && selectedCommit && (
                              <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                                Commit: {selectedCommit.substring(0, 7)}
                              </span>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFileSelection(viewingFile);
                            }}
                          >
                            {selectedFiles.includes(viewingFile)
                              ? 'Deselect'
                              : 'Select for scan'}
                          </Button>
                        </div>
                        <div className="flex-1 overflow-auto">
                          {contentError ? (
                            <div className="text-destructive text-sm p-2">
                              {contentError}
                            </div>
                          ) : (
                            <SyntaxHighlighter
                              language={detectLanguage(viewingFile)}
                              style={atomDark}
                              showLineNumbers={true}
                              customStyle={{
                                margin: 0,
                                borderRadius: 0,
                                fontSize: '0.85rem',
                                height: '100%',
                              }}
                              lineNumberStyle={{
                                minWidth: '2.5em',
                                paddingRight: '1em',
                                color: 'rgba(156, 163, 175, 0.5)',
                                textAlign: 'right',
                                userSelect: 'none',
                              }}
                              codeTagProps={{
                                style: {
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                  lineHeight: 1.5,
                                },
                              }}
                            >
                              {fileContent || ''}
                            </SyntaxHighlighter>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <FileCode className="h-10 w-10 mb-2 opacity-20" />
                        <p>Select a file to view its contents</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {selectedFiles.length} file(s) selected
                  </span>

                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFiles([])}
                    >
                      Deselect All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Select all visible files
                        const selectAllFiles = (items: FileItem[]) => {
                          items.forEach((item) => {
                            if (item.type === 'file') {
                              if (!selectedFiles.includes(item.path)) {
                                toggleFileSelection(item.path);
                              }
                            } else if (item.children) {
                              selectAllFiles(item.children);
                            }
                          });
                        };

                        selectAllFiles(fileStructure);
                      }}
                    >
                      Select All
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Confirm Scan Configuration</CardTitle>
              <CardDescription>
                Review your scan settings before starting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Scan Type
                  </h3>
                  <p className="font-medium">
                    {scanType === 'full' && 'Full Scan (All Files)'}
                    {scanType === 'incremental' &&
                      'Incremental Scan (Commit Analysis)'}
                    {scanType === 'targeted' &&
                      'Targeted Scan (Custom Selection)'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Branch
                  </h3>
                  <p className="font-medium flex items-center">
                    <GitBranch className="h-4 w-4 mr-2" />
                    {selectedBranch}
                  </p>
                </div>

                {scanType === 'incremental' && selectedCommit && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Commit
                    </h3>
                    <p className="font-medium flex items-center">
                      <GitCommit className="h-4 w-4 mr-2" />
                      {recentCommits.find((c) => c.sha === selectedCommit)
                        ?.message || selectedCommit}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      {selectedCommit.substring(0, 10)}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Vulnerability Types
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedVulnerabilityTypes.map((typeId) => {
                      const vulnType = vulnerabilityTypes.find(
                        (v) => v.id === typeId
                      );
                      return (
                        <div
                          key={typeId}
                          className="bg-muted px-2 py-1 rounded-full text-xs flex items-center"
                        >
                          {vulnType?.name || typeId}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedCustomVulnerabilities.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Custom Vulnerabilities
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedCustomVulnerabilities.map((vulnId) => {
                        const customVuln = customVulnerabilities.find(
                          (v) => v.id === vulnId
                        );
                        return (
                          <div
                            key={vulnId}
                            className="bg-muted px-2 py-1 rounded-full text-xs flex items-center gap-1"
                          >
                            {customVuln?.cve_code ? (
                              <>
                                <ShieldAlert className="h-3 w-3 text-blue-500" />
                                {customVuln.name}
                              </>
                            ) : (
                              <>
                                <Shield className="h-3 w-3 text-gray-500" />
                                {customVuln?.name || vulnId}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedFiles.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Selected Files
                    </h3>
                    <p className="text-sm">
                      {selectedFiles.length} file(s) selected
                    </p>

                    {/* Only show file list for non-full scans to avoid overwhelming UI */}
                    {scanType !== 'full' && (
                      <Accordion type="single" collapsible className="mt-2">
                        <AccordionItem value="files">
                          <AccordionTrigger>View files</AccordionTrigger>
                          <AccordionContent>
                            <div className="max-h-[200px] overflow-auto space-y-1">
                              {selectedFiles.map((file) => (
                                <div
                                  key={file}
                                  className="text-sm flex items-center"
                                >
                                  <FileCode className="h-3 w-3 mr-2 text-blue-500" />
                                  {file}
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-8">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/projects/${projectId}/scans`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">New Security Scan</h1>
          <p className="text-muted-foreground">
            Configure and run a security scan on your repository
          </p>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-center space-x-2 justify-center mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            {step > 1 && <div className="w-10 h-px bg-muted" />}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= step
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted bg-muted text-muted-foreground'
              }`}
            >
              {step}
            </div>
            {step < 4 && <div className="w-10 h-px bg-muted" />}
          </div>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Loading state */}
      {(isLoading || loadingCommitFiles || loadingAllFiles) && (
        <div className="flex justify-center my-12">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Step content */}
      {!isLoading &&
        !loadingCommitFiles &&
        !loadingAllFiles &&
        renderStepContent()}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        {isLoading ? (
          <div className="w-full flex flex-col items-center justify-center py-4">
            <LoaderCircle className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Creating security scan...</p>
          </div>
        ) : (
          <>
            {currentStep > 1 && (
              <Button
                onClick={handleBack}
                variant="outline"
                disabled={loadingCommitFiles || loadingAllFiles}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}

            {currentStep < 4 && (
              <Button
                onClick={handleNext}
                className="ml-auto"
                disabled={loadingCommitFiles || loadingAllFiles}
              >
                {loadingCommitFiles || loadingAllFiles ? (
                  <>
                    <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                    {loadingAllFiles
                      ? 'Loading All Files...'
                      : 'Loading Files...'}
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}

            {currentStep === 4 && (
              <Button
                onClick={handleCreateScan}
                className="ml-auto"
                disabled={loadingCommitFiles || loadingAllFiles}
              >
                <Shield className="h-4 w-4 mr-2" />
                Start Security Scan
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
