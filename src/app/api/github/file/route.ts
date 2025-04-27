import { NextRequest, NextResponse } from 'next/server';

// GET /api/github/file?repo=owner/repo&path=path/to/file
export async function GET(req: NextRequest) {
  // Use static GitHub token from .env for now
  const githubToken = process.env.GITHUB_ACCESS_TOKEN;
  if (!githubToken) {
    return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 });
  }
  const { searchParams } = new URL(req.url);
  const repo = searchParams.get('repo');
  const path = searchParams.get('path') || '';
  if (!repo || !path) return NextResponse.json({ error: 'Missing repo or path' }, { status: 400 });

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
  // File content is base64 encoded
  return NextResponse.json(data);
}

// POST /api/github/file
export async function POST(req: NextRequest) {
  // Use static GitHub token from .env for now
  const githubToken = process.env.GITHUB_ACCESS_TOKEN;
  if (!githubToken) {
    return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 });
  }
  const { repo, path, content, message, sha } = await req.json();
  if (!repo || !path || !content || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  // Get current file SHA if not provided
  let fileSha = sha;
  if (!fileSha) {
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    if (res.ok) {
      const data = await res.json();
      fileSha = data.sha;
    }
  }
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
  const res2 = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `token ${githubToken}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(content).toString('base64'),
      sha: fileSha,
    }),
  });
  if (!res2.ok) {
    return NextResponse.json({ error: 'GitHub API error', details: await res2.json() }, { status: res2.status });
  }
  const data2 = await res2.json();
  return NextResponse.json(data2);
}
