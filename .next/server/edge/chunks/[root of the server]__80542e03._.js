(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root of the server]__80542e03._.js", {

"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[project]/src/lib/supabase/server.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createClient": (()=>createClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$headers$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/headers.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/request/cookies.js [middleware-edge] (ecmascript)");
;
;
async function createClient(admin = false) {
    for (const env of [
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "SUPABASE_SERVICE_ROLE_KEY"
    ]){
        if (!process.env[env]) {
            throw new Error(`Missing env.${env}`);
        }
    }
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://htpiytutvbshtojgbxwy.supabase.co"), admin ? process.env.SUPABASE_SERVICE_ROLE_KEY : ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cGl5dHV0dmJzaHRvamdieHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDQ1MjUsImV4cCI6MjA1NzQ4MDUyNX0.RzEXSbKOIcEpj0rX58H1vmFHoNdn6C3k1geg5Gfg8Nc"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // The `setAll` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            }
        }
    });
}
}}),
"[project]/src/lib/supabase/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "updateSession": (()=>updateSession)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/server.ts [middleware-edge] (ecmascript)");
;
;
async function updateSession(request) {
    // Create a response object to modify and return
    const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
        request
    });
    // Create a Supabase client for the middleware
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["createClient"])();
    // Refresh the user's session if it exists
    await supabase.auth.getUser();
    // Get the current URL and user
    const { data: { user } } = await supabase.auth.getUser();
    // Define public routes that don't require authentication
    const publicRoutes = [
        "/login",
        "/register",
        "/",
        "/api/auth/signin",
        "/api/auth/callback",
        "/auth/auth-code-error",
        "/api/test"
    ];
    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some((route)=>request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + "/") || request.nextUrl.pathname.startsWith("/api/auth/"));
    // Check for static assets
    const isStaticAsset = request.nextUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico)$/);
    // If no user and trying to access protected route, redirect to login
    if (!user && !isPublicRoute && !isStaticAsset) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("from", request.nextUrl.pathname);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
    }
    // If trying to access login/register while logged in, redirect to dashboard
    if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register")) {
        const url = request.nextUrl.clone();
        url.pathname = "/projects";
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
    }
    // Return the response with updated cookies
    return response;
}
}}),
"[project]/src/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "config": (()=>config),
    "middleware": (()=>middleware)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$middleware$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/middleware.ts [middleware-edge] (ecmascript)");
;
async function middleware(request) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$middleware$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["updateSession"])(request);
}
const config = {
    matcher: [
        /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */ "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
    ]
};
}}),
}]);

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__80542e03._.js.map