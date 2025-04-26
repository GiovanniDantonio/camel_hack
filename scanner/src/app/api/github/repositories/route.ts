import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GitHubRepository, TransformedRepository } from "@/types/github";

// Function to transform GitHub API response to our format
function transformRepository(repo: GitHubRepository): TransformedRepository {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    isPrivate: repo.private,
    updatedAt: repo.updated_at,
  };
}

export async function GET() {
  try {
    // Get the current session using Supabase
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth
      .getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First, try to get github profile information which should include access token
    const { data: githubProfile, error: profileError } = await supabase
      .from("github_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: "Failed to get GitHub profile" },
        { status: 500 },
      );
    }

    if (!githubProfile || !githubProfile.github_access_token) {
      return NextResponse.json(
        { error: "No GitHub access token found" },
        { status: 400 },
      );
    }

    // Get both private and public repositories from GitHub API
    const accessToken = githubProfile.github_access_token;
    const response = await fetch(
      "https://api.github.com/user/repos?sort=updated&per_page=100",
      {
        headers: {
          "Authorization": `token ${accessToken}`,
          "Accept": "application/vnd.github.v3+json",
        },
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("GitHub API error:", error);
      return NextResponse.json(
        { error: "Failed to fetch repositories from GitHub" },
        { status: response.status },
      );
    }

    const repositories = await response.json() as GitHubRepository[];

    // Transform to our format
    const transformedRepos = repositories.map(transformRepository);

    return NextResponse.json(transformedRepos);
  } catch (error) {
    console.error("Error in GitHub repositories endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
