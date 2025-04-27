'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { TransformedRepository } from '@/types/github';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  Key,
  Loader2,
  Plus,
  Search,
  Settings,
  Trash2,
  Lock,
  Globe,
  Upload,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type EnvVariable = {
  key: string;
  value: string;
  id: string;
};

type ProjectMetadata = {
  name: string;
  description: string;
  targetUrl: string;
  scanFrequency: string;
};

export default function NewProjectPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [repositories, setRepositories] = useState<TransformedRepository[]>([]);
  const [selectedRepo, setSelectedRepo] =
    useState<TransformedRepository | null>(null);
  const [envVariables, setEnvVariables] = useState<EnvVariable[]>([]);
  const [metadata, setMetadata] = useState<ProjectMetadata>({
    name: '',
    description: '',
    targetUrl: '',
    scanFrequency: 'weekly',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/github/repositories');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch repositories');
      }

      const data = await response.json();
      setRepositories(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load repositories';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEnvVariable = () => {
    setEnvVariables([
      ...envVariables,
      { key: '', value: '', id: Math.random().toString() },
    ]);
  };

  const handleRemoveEnvVariable = (id: string) => {
    setEnvVariables(envVariables.filter((v) => v.id !== id));
  };

  const handleEnvVariableChange = (
    id: string,
    field: 'key' | 'value',
    value: string
  ) => {
    setEnvVariables(
      envVariables.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleSelectRepo = (repo: TransformedRepository) => {
    setSelectedRepo(repo);
    setCurrentStep(2);
    // Pre-fill project name with repo name
    setMetadata((prev) => ({
      ...prev,
      name: repo.name,
      description: repo.description || '',
    }));
  };

  const filteredRepositories = repositories.filter((repo) =>
    repo.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateProject = async () => {
    try {
      if (!selectedRepo) {
        toast.error('Please select a repository');
        return;
      }

      const response = await fetch('/api/projects/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repository: selectedRepo,
          metadata: {
            name: metadata.name,
            description: metadata.description,
            target_url: metadata.targetUrl,
            scan_frequency: metadata.scanFrequency,
          },
          env_variables: envVariables.map(({ key, value }) => ({ key, value })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (
          data.code === 'P2002' ||
          data.error?.includes('unique constraint')
        ) {
          throw new Error(
            `A project for repository "${selectedRepo.fullName}" already exists. Please choose a different repository.`
          );
        }
        throw new Error(data.error || 'Failed to create project');
      }

      const { project, error: fileError } = await response.json();

      // Show success toast
      toast.success('Project created successfully!');

      // If there was an error fetching files, show a warning toast
      if (fileError) {
        toast.error(fileError);
      }

      // Navigate to the project page
      router.push(`/projects/${project.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to create project'
      );
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Select Repository</CardTitle>
              <CardDescription>
                Choose the repository you want to create a project for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search repositories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">
                  <p>{error}</p>
                  <Button
                    variant="outline"
                    onClick={fetchRepositories}
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </div>
              ) : filteredRepositories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? (
                    <p>
                      No repositories found matching &ldquo;{searchQuery}&rdquo;
                    </p>
                  ) : (
                    <div>
                      <p>No repositories found.</p>
                      <p className="text-sm mt-2">
                        Make sure you have connected your GitHub account.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="rounded-md border max-h-[300px] overflow-y-auto">
                    {filteredRepositories.map((repo, index) => (
                      <div
                        key={repo.id}
                        onClick={() => handleSelectRepo(repo)}
                        className={`cursor-pointer transition-colors p-2 ${
                          index !== filteredRepositories.length - 1
                            ? 'border-b'
                            : ''
                        } ${
                          selectedRepo?.id === repo.id
                            ? 'bg-primary/5'
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              {repo.isPrivate ? (
                                <Lock className="h-3 w-3 text-muted-foreground" />
                              ) : (
                                <Globe className="h-3 w-3 text-blue-500" />
                              )}
                              <div className="font-medium text-sm truncate">
                                {repo.fullName}
                              </div>
                            </div>
                          </div>
                          {selectedRepo?.id === repo.id && (
                            <CheckCircle className="h-4 w-4 text-primary shrink-0 ml-4" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="mr-2 h-5 w-5" />
                Environment Variables
              </CardTitle>
              <CardDescription>
                Add environment variables needed for your project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {envVariables.length > 0 && (
                  <div className="grid grid-cols-[1fr_1fr_auto] gap-4">
                    <div>
                      <Label>Key</Label>
                    </div>
                    <div>
                      <Label>Value</Label>
                    </div>
                    <div className="w-10" /> {/* Spacer for delete button */}
                  </div>
                )}
                <div className="space-y-3">
                  {envVariables.map((variable) => (
                    <div
                      key={variable.id}
                      className="grid grid-cols-[1fr_1fr_auto] gap-4"
                    >
                      <Input
                        value={variable.key}
                        onChange={(e) =>
                          handleEnvVariableChange(
                            variable.id,
                            'key',
                            e.target.value
                          )
                        }
                        placeholder="API_KEY"
                      />
                      <Input
                        value={variable.value}
                        onChange={(e) =>
                          handleEnvVariableChange(
                            variable.id,
                            'value',
                            e.target.value
                          )
                        }
                        placeholder="Enter value"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveEnvVariable(variable.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleAddEnvVariable}
                    className="flex-1"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Environment Variable
                  </Button>
                  <div className="flex-1">
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Check if the filename matches .env.* pattern
                          if (!file.name.match(/^\.env(\..*)?$/)) {
                            toast.error('Please select a .env file');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const content = event.target?.result as string;
                            const lines = content.split('\n');
                            const newVars = lines
                              .filter(
                                (line) => line.trim() && !line.startsWith('#')
                              )
                              .map((line) => {
                                const [key, ...valueParts] = line.split('=');
                                const value = valueParts.join('=').trim();
                                return {
                                  key: key.trim(),
                                  value: value.replace(/^["']|["']$/g, ''),
                                  id: Math.random().toString(),
                                };
                              });
                            setEnvVariables([...envVariables, ...newVars]);
                          };
                          reader.readAsText(file);
                        }
                      }}
                      className="hidden"
                      id="env-file-input"
                      aria-label="Import environment variables from file"
                    />
                    <Button
                      variant="outline"
                      onClick={() =>
                        document.getElementById('env-file-input')?.click()
                      }
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Import from .env
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Project Settings
              </CardTitle>
              <CardDescription>Configure your project details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input
                    value={metadata.name}
                    onChange={(e) =>
                      setMetadata({ ...metadata, name: e.target.value })
                    }
                    placeholder="My Project"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={metadata.description}
                    onChange={(e) =>
                      setMetadata({ ...metadata, description: e.target.value })
                    }
                    placeholder="Describe your project..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Target URL</Label>
                  <Input
                    value={metadata.targetUrl}
                    onChange={(e) =>
                      setMetadata({ ...metadata, targetUrl: e.target.value })
                    }
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Scan Frequency</Label>
                  <Select
                    value={metadata.scanFrequency}
                    onValueChange={(value) =>
                      setMetadata({
                        ...metadata,
                        scanFrequency:
                          value as ProjectMetadata['scanFrequency'],
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select scan frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Confirm Project Setup
              </CardTitle>
              <CardDescription>
                Review your project configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Repository</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedRepo?.fullName}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Environment Variables</h3>
                  <div className="space-y-1">
                    {envVariables.map((v) => (
                      <p key={v.id} className="text-sm text-muted-foreground">
                        {v.key}: ••••••••
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Project Settings</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Name: {metadata.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Target URL: {metadata.targetUrl}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Scan Frequency: {metadata.scanFrequency}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground mt-2">
          Set up a new pen-testing project by connecting your GitHub repository
        </p>
      </div>

      <div className="flex items-center space-x-2 mb-8">
        <div className="flex items-center space-x-2 text-sm">
          <div
            className={`flex items-center ${
              currentStep >= 1
                ? 'text-primary font-medium'
                : 'text-muted-foreground'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 1
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted bg-muted text-muted-foreground'
              }`}
            >
              1
            </div>
            <span className="ml-2">Repository</span>
          </div>
          <div className="w-12 h-px bg-muted" />
          <div
            className={`flex items-center ${
              currentStep >= 2
                ? 'text-primary font-medium'
                : 'text-muted-foreground'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 2
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted bg-muted text-muted-foreground'
              }`}
            >
              2
            </div>
            <span className="ml-2">Environment</span>
          </div>
          <div className="w-12 h-px bg-muted" />
          <div
            className={`flex items-center ${
              currentStep >= 3
                ? 'text-primary font-medium'
                : 'text-muted-foreground'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 3
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted bg-muted text-muted-foreground'
              }`}
            >
              3
            </div>
            <span className="ml-2">Settings</span>
          </div>
          <div className="w-12 h-px bg-muted" />
          <div
            className={`flex items-center ${
              currentStep >= 4
                ? 'text-primary font-medium'
                : 'text-muted-foreground'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 4
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted bg-muted text-muted-foreground'
              }`}
            >
              4
            </div>
            <span className="ml-2">Review</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl">{renderStepContent()}</div>

      <div className="flex justify-between mt-8">
        {currentStep > 1 && (
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        {currentStep < 4 && (
          <Button onClick={handleNext} className="ml-auto">
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
        {currentStep === 4 && (
          <Button onClick={handleCreateProject} className="ml-auto">
            Create Project
            <CheckCircle className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
