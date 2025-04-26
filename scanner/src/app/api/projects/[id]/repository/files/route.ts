import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Octokit } from "@octokit/rest";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id: projectId } = await params;

    // Get the query parameters
    const url = new URL(request.url);
    const branch = url.searchParams.get("branch");
    const path = url.searchParams.get("path") || "";
    const commit = url.searchParams.get("commit");

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

    // Get repository content based on path, branch/commit
    const response = commit
      ? await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref: commit,
      })
      : await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref: branch || undefined,
      });

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
      path,
      branch: branch || undefined,
      commit: commit || undefined,
    });
  } catch (error: unknown) {
    console.error("Error fetching repository files:", error);

    // Check for specific GitHub API errors
    if (
      error && typeof error === "object" && "status" in error &&
      error.status === 404
    ) {
      return NextResponse.json(
        { error: "Path not found in repository" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch repository files" },
      { status: 500 },
    );
  }
}
