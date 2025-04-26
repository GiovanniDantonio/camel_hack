import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "./server";

export async function updateSession(request: NextRequest) {
  // Create a response object to modify and return
  const response = NextResponse.next({
    request,
  });

  // Create a Supabase client for the middleware
  const supabase = await createClient();

  // Refresh the user's session if it exists
  await supabase.auth.getUser();

  // Get the current URL and user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/login",
    "/register",
    "/", // Homepage is public
    "/api/auth/signin",
    "/api/auth/callback",
    "/auth/auth-code-error",
    "/api/test",
  ];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(
    (route) =>
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith(route + "/") ||
      request.nextUrl.pathname.startsWith("/api/auth/"),
  );

  // Check for static assets
  const isStaticAsset = request.nextUrl.pathname.match(
    /\.(js|css|png|jpg|jpeg|gif|svg|ico)$/,
  );

  // If no user and trying to access protected route, redirect to login
  if (!user && !isPublicRoute && !isStaticAsset) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // If trying to access login/register while logged in, redirect to dashboard
  if (
    user &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/projects";
    return NextResponse.redirect(url);
  }

  // Return the response with updated cookies
  return response;
}
