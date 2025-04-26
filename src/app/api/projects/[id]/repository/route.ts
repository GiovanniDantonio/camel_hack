import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database.types";

// GitHub API URL for repository details
const GITHUB_API_URL = "https://api.github.com";

type ProjectData = Database["public"]["Tables"]["projects"]["Row"];

interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

interface BranchWithCommits {
  name: string;
  is_default: boolean;
  commits: {
    sha: string;
    message: string;
    author: string;
    date: string;
  }[];
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Await params to avoid Next.js dynamic API warning
    const { id: projectId } = await params;

    console.log("Fetching project and repository data");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    // Create server-side Supabase client
    const supabase = await createClient();

    // Get authenticated user data directly from Supabase Auth server
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Fetch the project data including repository details
    const { data: projectData, error: projectError }: {
      data: ProjectData | null;
      error: Error | null;
    } = await supabase
      .from("projects")
      .select(
        "*",
      )
      .eq("id", projectId)
      .single();

    if (projectError || !projectData) {
      return NextResponse.json(
        {
          error: "Project not found" +
            (projectError ? ": " + projectError.message : ""),
        },
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

    // Get the GitHub access token from github_profiles table instead of provider_token
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

    // Fetch repository data from GitHub API
    const repoResponse = await fetch(
      `${GITHUB_API_URL}/repos/${repoFullName}`,
      {
        headers: {
          "Authorization": `Bearer ${githubToken}`,
          "Accept": "application/vnd.github.v3+json",
        },
      },
    );

    if (!repoResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch repository data" },
        { status: repoResponse.status },
      );
    }

    const repoData = await repoResponse.json();

    // Fetch branch data
    const branchesResponse = await fetch(
      `${GITHUB_API_URL}/repos/${repoFullName}/branches`,
      {
        headers: {
          "Authorization": `Bearer ${githubToken}`,
          "Accept": "application/vnd.github.v3+json",
        },
      },
    );

    const branchesData: GitHubBranch[] = branchesResponse.ok
      ? await branchesResponse.json()
      : [];

    // Fetch commits for each branch
    const branchesWithCommits: BranchWithCommits[] = await Promise.all(
      branchesData.map(async (branch) => {
        const commitsResponse = await fetch(
          `${GITHUB_API_URL}/repos/${repoFullName}/commits?sha=${branch.name}&per_page=100`,
          {
            headers: {
              "Authorization": `Bearer ${githubToken}`,
              "Accept": "application/vnd.github.v3+json",
            },
          },
        );

        let commits: BranchWithCommits["commits"] = [];
        if (commitsResponse.ok) {
          const commitsData = await commitsResponse.json() as GitHubCommit[];
          commits = commitsData.map((commit) => ({
            sha: commit.sha.substring(0, 7),
            message: commit.commit.message.split("\n")[0],
            author: commit.commit.author.name,
            date: commit.commit.author.date,
          }));
        }

        return {
          name: branch.name,
          is_default: branch.name === repoData.default_branch,
          commits,
        };
      }),
    );

    // Fetch languages data
    const languagesResponse = await fetch(
      `${GITHUB_API_URL}/repos/${repoFullName}/languages`,
      {
        headers: {
          "Authorization": `Bearer ${githubToken}`,
          "Accept": "application/vnd.github.v3+json",
        },
      },
    );

    const languagesData = languagesResponse.ok
      ? await languagesResponse.json()
      : {};

    // Return both project data and GitHub repository data
    return NextResponse.json({
      project: {
        id: projectData.id,
        name: projectData.project_name,
        repository_full_name: projectData.repository_full_name,
        repository_id: projectData.repository_id,
        repository_name: projectData.repository_name,
        repository_description: projectData.repository_description,
        repository_is_private: false, // NEW_projects doesn't have this field, defaulting to false
      },
      repository: {
        name: repoData.name,
        full_name: repoData.full_name,
        description: repoData.description,
        html_url: repoData.html_url,
        default_branch: repoData.default_branch,
        created_at: repoData.created_at,
        updated_at: repoData.updated_at,
        pushed_at: repoData.pushed_at,
        size: repoData.size,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        open_issues: repoData.open_issues_count,
        watchers: repoData.watchers_count,
        license: repoData.license,
        private: repoData.private,
        branches: branchesWithCommits,
        languages: languagesData,
      },
    });
  } catch (error) {
    console.error("Error fetching project and repository data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
