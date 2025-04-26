import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET endpoint to fetch a single vulnerability with resolution details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const awaitedParams = await params;
    const id = awaitedParams.id;

    // Create Supabase client
    const supabase = await createClient();

    // Get the vulnerability with resolution details
    const { data: vulnerability, error } = await supabase
      .from('vulnerabilities')
      .select(`
        id,
        status,
        resolution_note,
        resolved_by,
        resolved_at
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching vulnerability:', error);
      return NextResponse.json(
        { error: 'Failed to fetch vulnerability' },
        { status: 500 }
      );
    }

    if (!vulnerability) {
      return NextResponse.json(
        { error: 'Vulnerability not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(vulnerability);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update vulnerability resolution status and notes
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const awaitedParams = await params;
    const id = awaitedParams.id;

    // Create Supabase client
    const supabase = await createClient();

    // Check authentication - use getUser() for better security
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { status, resolution_note } = body;

    // Validate required fields
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status values
    const validStatuses = ['open', 'in_progress', 'resolved', 'false_positive'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Add resolution details if status is 'resolved'
    if (status === 'resolved') {
      updateData.resolution_note = resolution_note || '';
      updateData.resolved_by = user.id;
      updateData.resolved_at = new Date().toISOString();
    }

    // Update the vulnerability
    const { data, error } = await supabase
      .from('vulnerabilities')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating vulnerability:', error);
      return NextResponse.json(
        { error: 'Failed to update vulnerability' },
        { status: 500 }
      );
    }

    return NextResponse.json(data[0] || {});
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
