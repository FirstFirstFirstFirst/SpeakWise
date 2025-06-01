// components/ProfileProtection.tsx
"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useProfileStore } from "@/stores/profileStore";

interface ProfileProtectionProps {
  children: React.ReactNode;
}

export function ProfileProtection({ children }: ProfileProtectionProps) {
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const { profileCompleted, loadProfile, isLoading } = useProfileStore();

  // Don't protect these routes
  const isPublicRoute =
    pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");
  const isProfileRoute = pathname?.startsWith("/profile");

  useEffect(() => {
    if (!userLoaded || isPublicRoute) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    // Load profile data
    loadProfile(user.id);
  }, [user, userLoaded, isPublicRoute, loadProfile]);

  useEffect(() => {
    // Redirect to profile completion if needed
    if (
      userLoaded &&
      user &&
      !isLoading &&
      !profileCompleted &&
      !isProfileRoute &&
      !isPublicRoute
    ) {
      router.push("/profile");
    }
  }, [
    userLoaded,
    user,
    isLoading,
    profileCompleted,
    isProfileRoute,
    isPublicRoute,
    router,
  ]);

  // Show loading state
  if (!userLoaded || (user && isLoading && !profileCompleted)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
