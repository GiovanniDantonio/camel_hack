'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Database } from '@/types/database.types';
import { AlertCircle, CheckCircle2, GitFork, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ProjectSearch } from './project-search';

type ProjectData = Database['public']['Tables']['projects']['Row'];

// Define the extended type with vulnerability data
interface ProjectWithVulnerabilities extends ProjectData {
  vulnerabilityCount: number;
  riskScore: number | null;
  status: 'vulnerable' | 'secure';
}

interface ProjectsClientProps {
  projects: ProjectWithVulnerabilities[];
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  // Toast API for success/error feedback
  const { toast } = useToast();

  // Local copy so we can mutate immediately after deletion
  const [projectList, setProjectList] = useState(projects);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered list taking search term into account
  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projectList;

    const searchLower = searchTerm.toLowerCase();
    return projectList.filter(
      (project) =>
        project.project_name.toLowerCase().includes(searchLower) ||
        (project.description?.toLowerCase().includes(searchLower) ?? false) ||
        (project.repository_full_name?.toLowerCase().includes(searchLower) ??
          false)
    );
  }, [projectList, searchTerm]);

  /**
   * Delete a project permanently and update local state.
   * Shows confirmation prompt and toast notifications.
   */
  const handleDeleteProject = useCallback(
    async (projectId: string) => {
      // Simple confirmation to avoid accidental deletions
      if (!window.confirm('Are you sure you want to delete this project?')) {
        return;
      }

      try {
        const response = await fetch(`/api/projects/settings?id=${projectId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete project');
        }

        // Optimistically remove from UI
        setProjectList((prev) => prev.filter((p) => p.id !== projectId));

        toast({
          title: 'Project deleted',
          description: 'The project was removed successfully.',
        });
      } catch (err) {
        console.error('Error deleting project:', err);
        toast({
          title: 'Error deleting project',
          description:
            err instanceof Error ? err.message : 'Unexpected error occurred',
          variant: 'destructive',
        });
      }
    },
    [toast],
  );

  return (
    <div className="space-y-4">
      <ProjectSearch onSearchChange={setSearchTerm} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Link
            href={`/projects/${project.id}`}
            key={project.id}
            className="block h-full"
          >
            <Card className="relative h-full hover:shadow-md transition-shadow border-2 hover:border-primary/50">
              {/* Quick delete button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteProject(project.id);
                }}
                className="absolute top-2 right-2 z-10 rounded-full bg-muted p-1 text-muted-foreground hover:bg-destructive hover:text-white transition-colors"
                aria-label="Delete project"
              >
                <X className="h-3 w-3" />
              </button>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {project.project_name}
                  </CardTitle>
                  <Badge
                    className="capitalize shrink-0 mt-1"
                    style={{
                      backgroundColor: (() => {
                        const score = project.riskScore ?? 0;
                        if (score <= 20) return '#059669'; // green
                        if (score <= 40) return '#d97706'; // yellow-600
                        if (score <= 70) return '#ea580c'; // orange-600
                        return '#dc2626'; // red-600
                      })(),
                      color: 'white',
                    }}
                  >
                    {project.riskScore !== null ? (
                      (() => {
                        const score = project.riskScore ?? 0;
                        if (score <= 20) return 'Low Risk';
                        if (score <= 70) return 'Medium Risk';
                        return 'High Risk';
                      })()
                    ) : (
                      project.status === 'vulnerable' ? 'At Risk' : 'Secure'
                    )}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 mt-1">
                  {project.description || 'No description provided'}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {project.repository_full_name && (
                  <div className="flex items-center text-sm text-muted-foreground mb-4 overflow-hidden">
                    <GitFork className="shrink-0 mr-2 h-4 w-4" />
                    <span className="truncate">
                      {project.repository_full_name}
                    </span>
                  </div>
                )}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Last Scan</span>
                    <span className="font-medium">
                      {project.updated_at
                        ? new Date(project.updated_at).toLocaleDateString()
                        : 'Never'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Vulnerabilities
                    </span>
                    <span
                      className={`font-medium ${
                        project.vulnerabilityCount > 0
                          ? 'text-destructive'
                          : 'text-green-600'
                      }`}
                    >
                      {project.vulnerabilityCount || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {/* Add Project Card */}
        <Link href="/projects/new-project" className="block h-full">
          <Card className="h-full border-dashed hover:border-primary hover:border-2 transition-all">
            <CardContent className="flex flex-col items-center justify-center h-full py-8">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <p className="font-medium">Add a new project</p>
              <CardDescription className="text-center mt-1">
                Create a new project to monitor
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
