import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';
import { NextResponse } from 'next/server';

type ProjectData = Database['public']['Tables']['projects']['Row'];

export async function PATCH(request: Request) {
  try {
    // Get project ID from query params
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Get the request body
    const {
      project_name,
      description,
      target_url,
      scan_frequency,
    }: Partial<ProjectData> = await request.json();

    // Add validation for project_name
    if (!project_name || project_name.trim() === '') {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    // Create server-side Supabase client
    const supabase = await createClient();

    // Get authenticated user data directly from Supabase Auth server
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the project to verify ownership
    const { data: existingProject, error: projectError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single();

    if (projectError || !existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Verify project ownership
    if (existingProject.user_id !== user.id) {
      return NextResponse.json(
        { error: "You don't have permission to update this project" },
        { status: 403 }
      );
    }

    // Update the project
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({
        project_name,
        description,
        scan_frequency,
        target_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating project:', updateError);
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Get project ID from query params
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Create server-side Supabase client
    const supabase = await createClient();

    // Get authenticated user data directly from Supabase Auth server
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the project to verify ownership
    const { data: existingProject, error: projectError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single();

    if (projectError || !existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Verify project ownership
    if (existingProject.user_id !== user.id) {
      return NextResponse.json(
        { error: "You don't have permission to delete this project" },
        { status: 403 }
      );
    }

    // Delete the project
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (deleteError) {
      console.error('Error deleting project:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete project' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Get project ID from query params
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Create server-side Supabase client
    const supabase = await createClient();

    // Get authenticated user data directly from Supabase Auth server
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the project data
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError || !projectData) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Verify project ownership
    if (projectData.user_id !== user.id) {
      return NextResponse.json(
        { error: "You don't have permission to access this project" },
        { status: 403 }
      );
    }

    return NextResponse.json(projectData);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
