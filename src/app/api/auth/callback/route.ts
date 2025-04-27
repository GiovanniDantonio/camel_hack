import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/projects";

  if (!code) {
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/auth-code-error?error=no_code&error_description=${
        encodeURIComponent(
          "No code provided",
        )
      }`,
    );
  }

  try {
    // Create a Supabase client using your utility function
    const supabase = await createClient();

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/auth-code-error?error=${
          encodeURIComponent(
            error.name,
          )
        }&error_description=${encodeURIComponent(error.message)}`,
      );
    }

    // After successful exchange, store the GitHub token in the users table
    if (data?.session) {
      const githubToken = data.session.provider_token;

      if (githubToken) {
        // Fetch GitHub user profile information using the token
        const githubUserResponse = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (!githubUserResponse.ok) {
          console.error(
            "Error fetching GitHub user data:",
            await githubUserResponse.text(),
          );
        } else {
          const githubUser = await githubUserResponse.json();

          // Insert/update the github_profiles table with the user's information
          const { error: profileError } = await supabase
            .from("github_profiles")
            .upsert({
              user_id: data.session.user.id,
              github_username: githubUser.login,
              github_access_token: githubToken,
              github_avatar_url: githubUser.avatar_url,
              github_bio: githubUser.bio,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: "user_id",
            });

          if (profileError) {
            console.error("Error saving GitHub profile:", profileError);
            // Continue even if saving fails - don't block the auth flow
          } else {
            console.log("Successfully saved GitHub profile");
          }
        }
      }
    }

    console.log("Auth exchange successful, redirecting to:", next);
    return NextResponse.redirect(`${requestUrl.origin}${next}`);
  } catch (error) {
    console.error("Error in auth callback:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/auth-code-error?error=server_error&error_description=${
        encodeURIComponent(
          message,
        )
      }`,
    );
  }
}
