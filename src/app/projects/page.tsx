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
  riskScore: number | null;
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

  // -------------------------------------------------------------
  // Augment each project with vulnerability statistics
  // -------------------------------------------------------------

  for (const project of projects) {
    // Count vulnerabilities for this project (across all scans)
    const { count: vulnCount, error: vulnErr } = await supabase
      .from("vulnerabilities")
      .select("id", { count: "exact", head: true})
      .eq("project_id", project.id);

    // Latest completed scan risk score
    const { data: scanData, error: scanErr } = await supabase
      .from("scans")
      .select("risk_score")
      .eq("project_id", project.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false})
      .limit(1)
      .maybeSingle();

    if (vulnErr) {
      console.error(
        `Error counting vulnerabilities for project ${project.id}:`,
        vulnErr,
      );
    }
    if (scanErr) {
      console.error(
        `Error fetching last scan for project ${project.id}:`,
        scanErr,
      );
    }

    project.vulnerabilityCount = vulnCount || 0;
    project.riskScore = scanData?.risk_score ?? null;

    // Determine status: secure if riskScore ≤20 & 0 vulnerabilities else vulnerable
    const risk = project.riskScore ?? 0;
    project.status = risk > 20 || project.vulnerabilityCount > 0
      ? "vulnerable"
      : "secure";
  }

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
