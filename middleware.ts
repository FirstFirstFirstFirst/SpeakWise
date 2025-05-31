import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return;
  }

  const { userId } = await auth();
  
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  try {
    // Call our user sync API to ensure User record exists
    const syncResponse = await fetch(new URL("/api/user/sync", req.url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Clerk-User-Id": userId,
      },
    });

    if (!syncResponse.ok) {
      console.error("Failed to sync user:", await syncResponse.text());
    }

    // Check if user has completed their profile
    const profileResponse = await fetch(new URL("/api/user/profile", req.url), {
      method: "GET",
      headers: {
        "X-Clerk-User-Id": userId,
      },
    });

    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      
      if (!profileData.languageDialect && !req.nextUrl.pathname.startsWith("/profile")) {
        const profileUrl = new URL("/profile", req.url);
        return NextResponse.redirect(profileUrl);
      }
    }
  } catch (error) {
    console.error("Middleware error:", error);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
