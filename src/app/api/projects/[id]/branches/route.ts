import { getProjectById } from '@/lib/services/project-service';
import { getRepositoryBranches } from '@/lib/services/repository-service';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const project = await getProjectById(params.id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if user has access to the project
    const { data: projectMember } = await supabase
      .from('project_members')
      .select('*')
      .eq('project_id', params.id)
      .eq('user_id', session.user.id)
      .single();

    if (!projectMember) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const branches = await getRepositoryBranches(project.repository_url);
    return NextResponse.json({ branches });
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branches' },
      { status: 500 }
    );
  }
}
