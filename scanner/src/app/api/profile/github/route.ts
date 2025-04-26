import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Create a Supabase client with server-side authentication
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Fetch GitHub profile using the server-side client
    const { data: githubProfile, error: profileError } = await supabase
      .from('github_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching GitHub profile:', profileError);
      
      // If the error is "not found", return a 404 instead of a 500
      if (profileError.code === 'PGRST116') {
        return NextResponse.json({ error: 'GitHub profile not found' }, { status: 404 });
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch GitHub profile' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ githubProfile });
  } catch (error) {
    console.error('Unexpected error in GitHub profile endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
