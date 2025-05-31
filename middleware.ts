import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isProfileRoute = createRouteMatcher(["/profile"]);

export default clerkMiddleware(async (auth, req) => {
  // Allow access to public routes (sign-in, sign-up)
  if (isPublicRoute(req)) {
    return;
  }

  // Check if user is authenticated
  const { userId } = await auth();

  // If not authenticated, redirect to sign-in
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  if (isProfileRoute(req)) {
    return;
  }

  try {
    try {
      // Check if user has completed profile setup
      const userProfile = await prisma.userProfile.findUnique({
        where: { userId },
        select: { languageDialect: true },
      });

      // If no profile or no language dialect selected, redirect to profile
      if (!userProfile || !userProfile.languageDialect) {
        const profileUrl = new URL("/profile", req.url);
        return NextResponse.redirect(profileUrl);
      }
    } catch (error) {
      console.error("Error checking user profile:", error);
      // On database error, allow access (fail gracefully)
    }
    // Check if user has completed profile setup
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId },
      select: { languageDialect: true },
    });

    // If no profile or no language dialect selected, redirect to profile
    if (!userProfile || !userProfile.languageDialect) {
      const profileUrl = new URL("/profile", req.url);
      return NextResponse.redirect(profileUrl);
    }
  } catch (error) {
    console.error("Error checking user profile:", error);
    // On database error, allow access (fail gracefully)
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
