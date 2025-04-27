import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Octokit } from "@octokit/rest";

// -------------------------------------------------------------
// Helpers: parse query params once so they are available in both
// try and catch blocks. Doing this outside `try` avoids the TS
// error that variables are not in scope inside `catch`.
// -------------------------------------------------------------

function parseQueryParams(request: Request) {
  const url = new URL(request.url);
  return {
    branch: url.searchParams.get("branch") ?? undefined,
    repoPath: url.searchParams.get("path") || "",
    commit: url.searchParams.get("commit") ?? undefined,
  } as const;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { branch, repoPath, commit } = parseQueryParams(request);

  try {
    const { id: projectId } = await params;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    // Create server-side Supabase client
    const supabase = await createClient();

    // Get authenticated user data
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Fetch the project data
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (projectError || !projectData) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 },
      );
    }

    // Check if the user owns this project
    if (projectData.user_id !== user.id) {
      return NextResponse.json(
        { error: "You don't have access to this project" },
        { status: 403 },
      );
    }

    // Get the repository full name from project data
    const repoFullName = projectData.repository_full_name;

    if (!repoFullName) {
      return NextResponse.json(
        { error: "Project repository not configured" },
        { status: 400 },
      );
    }

    // Get the GitHub access token
    const { data: githubProfile, error: githubProfileError } = await supabase
      .from("github_profiles")
      .select("github_access_token")
      .eq("user_id", user.id)
      .single();

    if (
      githubProfileError || !githubProfile || !githubProfile.github_access_token
    ) {
      return NextResponse.json(
        { error: "GitHub token not found" },
        { status: 401 },
      );
    }

    const githubToken = githubProfile.github_access_token;

    // Initialize Octokit with the token
    const octokit = new Octokit({
      auth: githubToken,
    });

    // Extract owner and repo from the full name
    const [owner, repo] = repoFullName.split("/");

    // ---------------------------------------------------------------------
    // Get repository content. Attempt commit ref first (if provided). If the
    // ref does not exist (GitHub returns 404), fall back to the branch.
    // This prevents 500s when the UI passes a label that is not an actual
    // commit SHA.
    // ---------------------------------------------------------------------
    let response;
    try {
      if (commit) {
        response = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: repoPath,
          ref: commit,
        });
      } else {
        response = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: repoPath,
          ref: branch || undefined,
        });
      }
    } catch (err: any) {
      // If commit lookup failed (most commonly 404), retry using branch ref
      if (commit && err?.status === 404) {
        console.warn(
          `[repository/files] Commit ref "${commit}" not found. Falling back to branch "${branch ?? 'default'}"`,
        );
        response = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: repoPath,
          ref: branch || undefined,
        });
      } else {
        throw err;
      }
    }

    // If after fallback we still get 404, treat as empty directory
    if (!response) {
      return NextResponse.json({ files: [], path: repoPath, branch, commit }, { status: 200 });
    }

    // Process and return the content
    const data = response.data;
    let files = [];

    if (Array.isArray(data)) {
      // Directory listing
      files = data.map((item) => ({
        name: item.name,
        path: item.path,
        type: item.type,
        size: item.size,
        url: item.html_url,
        download_url: item.download_url,
        sha: item.sha,
      }));
    } else {
      // Single file - shouldn't happen but handle it anyway
      files = [{
        name: data.name,
        path: data.path,
        type: data.type,
        size: data.size,
        url: data.html_url,
        download_url: data.download_url,
        sha: data.sha,
      }];
    }

    return NextResponse.json({
      files,
      path: repoPath,
      branch: branch || undefined,
      commit: commit || undefined,
    });
  } catch (error: unknown) {
    // If it's a 404, it's simply a non-existent path – treat as empty without noise
    if (
      error && typeof error === "object" && "status" in error &&
      (error as { status?: number }).status === 404
    ) {
      console.info(
        `[repository/files] Path "${repoPath}" not found in ref ${commit ?? branch ?? "default"}, returning empty list`,
      );
      return NextResponse.json({ files: [], path: repoPath, branch, commit }, { status: 200 });
    }

    // Unexpected error – log and surface 500
    console.error("[repository/files] Unexpected error fetching files:", error);
    return NextResponse.json(
      { error: "Failed to fetch repository files" },
      { status: 500 },
    );
  }
}
