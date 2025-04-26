import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    // Get the current session using Supabase
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth
      .getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { repository, metadata, env_variables } = await request.json();

    if (!repository || !metadata) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Insert into NEW_projects table
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        project_name: metadata.name,
        description: metadata.description,
        repository_id: repository.id,
        repository_name: repository.name,
        repository_full_name: repository.fullName,
        repository_description: repository.description,
        repository_url: `https://github.com/${repository.fullName}`,
        scan_frequency: metadata.scan_frequency,
        target_url: metadata.target_url,
        user_id: user.id,
      })
      .select()
      .single();

    if (projectError) {
      console.error("Error creating project:", projectError);
      return NextResponse.json(
        { error: "Failed to create project" },
        { status: 500 },
      );
    }

    // If there are environment variables, insert them
    if (env_variables && env_variables.length > 0) {
      const { error: envError } = await supabase
        .from("project_env_vars")
        .insert(
          env_variables.map((
            { key, value }: { key: string; value: string },
          ) => ({
            project_id: project.id,
            key,
            value,
          })),
        );

      if (envError) {
        console.error("Error creating environment variables:", envError);
        // Don't fail the whole request if env vars fail
      }
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error in project creation endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
