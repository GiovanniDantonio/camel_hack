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
    const sha = url.searchParams.get("sha");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    if (!sha) {
      return NextResponse.json(
        { error: "Commit SHA is required" },
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

    // Get commit details
    const response = await octokit.repos.getCommit({
      owner,
      repo,
      ref: sha,
    });

    const commit = response.data;

    // Extract required information
    const result = {
      sha: commit.sha,
      message: commit.commit.message,
      author: {
        name: commit.commit.author?.name || "Unknown",
        email: commit.commit.author?.email || "",
        date: commit.commit.author?.date || "",
        avatar_url: commit.author?.avatar_url || "",
      },
      committer: {
        name: commit.commit.committer?.name || "Unknown",
        email: commit.commit.committer?.email || "",
        date: commit.commit.committer?.date || "",
      },
      stats: {
        total: commit.stats?.total || 0,
        additions: commit.stats?.additions || 0,
        deletions: commit.stats?.deletions || 0,
      },
      files: commit.files?.map((file) => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
        patch: file.patch,
      })) || [],
      parents: commit.parents?.map((parent) => ({
        sha: parent.sha,
        url: parent.html_url,
      })) || [],
      html_url: commit.html_url,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching commit details:", error);
    return NextResponse.json(
      { error: "Failed to fetch commit details" },
      { status: 500 },
    );
  }
}
