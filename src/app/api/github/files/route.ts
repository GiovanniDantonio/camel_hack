import { NextRequest, NextResponse } from 'next/server';

// GET /api/github/files?repo=owner/repo&path=path/to/dir
export async function GET(req: NextRequest) {
  // Use static GitHub token from .env for now
  const githubToken = process.env.GITHUB_ACCESS_TOKEN;
  if (!githubToken) {
    return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 });
  }
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
