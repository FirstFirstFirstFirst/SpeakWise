// middleware.ts - MUCH SIMPLER VERSION
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return;
  }

  const { userId } = await auth();

  // Redirect to sign-in if not authenticated
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Optional: Only sync user on first visit (much more efficient)
  // You can move this to a one-time operation or do it client-side
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");
  const isFirstVisit = !req.cookies.get("user-synced");

  if (!isApiRoute && isFirstVisit) {
    try {
      // Set cookie to avoid repeated sync calls
      const response = NextResponse.next();
      response.cookies.set("user-synced", "true", {
        maxAge: 60 * 60 * 24, // 24 hours
        httpOnly: true,
      });

      // Trigger sync in background (non-blocking)
      fetch(new URL("/api/user/sync", req.url), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Clerk-User-Id": userId,
        },
      }).catch((err) => console.error("Background sync failed:", err));

      return response;
    } catch (error) {
      console.error("Middleware error:", error);
    }
  }

  // Let the request proceed - profile protection is now handled client-side
  return NextResponse.next();
});

export const config = {
  matcher: [
    // More efficient matcher - excludes static assets
    "/((?!_next|static|favicon.ico|.*\\..*|api/webhooks).*)",
    "/api/((?!webhooks).)*",
  ],
};
