import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/lib/supabase/server";

// GET /api/github/files?repo=owner/repo&path=path/to/dir
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { data: githubProfile, error: profileError } = await supabase
    .from('github_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (profileError || !githubProfile || !githubProfile.github_access_token) {
    return NextResponse.json({ error: 'No GitHub OAuth token on file for user' }, { status: 401 });
  }
  const githubToken = githubProfile.github_access_token;

  const { searchParams } = new URL(req.url);
  const repo = searchParams.get('repo');
  const path = searchParams.get('path') || '';
  if (!repo) return NextResponse.json({ error: 'Missing repo' }, { status: 400 });

  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `token ${githubToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
  if (!res.ok) {
    return NextResponse.json({ error: 'GitHub API error', details: await res.json() }, { status: res.status });
  }
  const data = await res.json();
  return NextResponse.json(data);
}
