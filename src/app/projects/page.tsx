import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import ProtectedRoute from '@/components/auth/protected-route';
import { ProjectsClient } from '@/components/projects/projects-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';

type ProjectData = Database['public']['Tables']['projects']['Row'];

// Define the extended type with vulnerability data
interface ProjectWithVulnerabilities extends ProjectData {
  vulnerabilityCount: number;
  status: 'vulnerable' | 'secure';
}

async function ProjectsList() {
  const supabase = await createClient();

  // Get the current user with secure authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (!user || authError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed rounded-lg">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-medium mb-2">Authentication required</h3>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your projects.
          </p>
        </div>
      </div>
    );
  }

  // Fetch projects for current user only
  const { data: projectsData, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching projects:', error);
    return null;
  }

  const projects = projectsData as ProjectWithVulnerabilities[];

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed rounded-lg">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-6">
            Start by creating your first project to begin monitoring for
            security vulnerabilities.
          </p>
          <Link href="/projects/new-project">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create your first project
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <ProjectsClient projects={projects} />;
}

function LoadingProjects() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="h-full animate-pulse">
          <CardHeader className="pb-2">
            <div className="h-6 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-muted rounded w-full mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor your security testing projects
            </p>
          </div>
          <Link href="/projects/new-project">
            <Button className="whitespace-nowrap">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Content section */}
        <Suspense fallback={<LoadingProjects />}>
          <ProjectsList />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
