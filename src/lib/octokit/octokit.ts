import { createClient } from "@/lib/supabase/server";
import { Octokit } from "@octokit/rest";

export type OctokitRepo = {
  octokit: Octokit;
  repoFullName: string;
};

export async function getOctokitRepo(projectId: string): Promise<OctokitRepo> {
  // Create server-side Supabase client
  const supabase = await createClient();

  // Get authenticated user data
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Authentication required");
  }

  // Fetch the project data
  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (projectError || !projectData) {
    throw new Error("Project not found");
  }

  // Check if the user owns this project
  if (projectData.user_id !== user.id) {
    throw new Error("You don't have access to this project");
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
    throw new Error("GitHub token not found");
  }

  const githubToken = githubProfile.github_access_token;

  // Initialize Octokit with the token
  const octokit = new Octokit({
    auth: githubToken,
  });

  return {
    octokit,
    repoFullName,
  };
}
