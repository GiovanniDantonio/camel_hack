import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// POST route handler for GitHub OAuth signin
export async function POST(request: Request) {
  try {
    // Create a Supabase client using the server utility
    const supabase = await createClient();

    // Extract redirectTo from request body if available
    let redirectPath = "/projects"; // Default to dashboard

    try {
      const body = await request.json();
      if (body.redirectTo) {
        redirectPath = body.redirectTo;
      }
    } catch {
      // Continue if JSON parsing fails
      console.log("Request body parsing failed, using default redirect path");
    }

    // Get origin from request
    const origin = new URL(request.url).origin;

    // Initialize GitHub OAuth flow with Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${origin}/api/auth/callback?next=${
          encodeURIComponent(
            redirectPath,
          )
        }`,
        scopes: "repo",
      },
    });

    if (error) {
      console.error("GitHub auth error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return the auth URL for client-side redirect
    return NextResponse.json({ url: data.url }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error during GitHub auth:", error);
    const message = error instanceof Error
      ? error.message
      : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
