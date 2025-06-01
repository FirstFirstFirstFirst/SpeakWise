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
      console.error(
        "Failed to sync user:",
        syncResponse.status,
        syncResponse.statusText
      );
      // Don't block the request if sync fails
    }

    // Check if user has completed their profile
    const profileResponse = await fetch(new URL("/api/user/profile", req.url), {
      method: "GET",
      headers: {
        "X-Clerk-User-Id": userId,
      },
    });

    if (profileResponse.ok) {
      // Check if the response is actually JSON
      const contentType = profileResponse.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const profileData = await profileResponse.json();

          if (
            !profileData.languageDialect &&
            !req.nextUrl.pathname.startsWith("/profile")
          ) {
            const profileUrl = new URL("/profile", req.url);
            return NextResponse.redirect(profileUrl);
          }
        } catch (jsonError) {
          console.error("Failed to parse profile JSON:", jsonError);
          // Continue without blocking if JSON parsing fails
        }
      } else {
        console.error("Profile API returned non-JSON response:", contentType);
        // Handle non-JSON response - maybe redirect to profile setup
        if (!req.nextUrl.pathname.startsWith("/profile")) {
          const profileUrl = new URL("/profile", req.url);
          return NextResponse.redirect(profileUrl);
        }
      }
    } else {
      console.error(
        "Profile check failed:",
        profileResponse.status,
        profileResponse.statusText
      );
      // Optionally redirect to profile setup if the API call fails
      if (!req.nextUrl.pathname.startsWith("/profile")) {
        const profileUrl = new URL("/profile", req.url);
        return NextResponse.redirect(profileUrl);
      }
    }
  } catch (error) {
    console.error("Middleware error:", error);
    // Don't block the request even if there are errors
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
