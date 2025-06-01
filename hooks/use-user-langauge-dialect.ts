// hooks/useUserLanguageDialect.ts
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { LanguageDialectType } from "@/types/user";

interface UserLanguageDialectHook {
  languageDialect: LanguageDialectType;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserLanguageDialect(): UserLanguageDialectHook {
  const { user } = useUser();
  const [languageDialect, setLanguageDialect] =
    useState<LanguageDialectType>("general");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserLanguageDialect = async (): Promise<void> => {
    if (!user) {
      setLanguageDialect("general");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/user/profile");

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const profileData = await response.json();

      if (profileData.languageDialect) {
        setLanguageDialect(profileData.languageDialect as LanguageDialectType);
      } else {
        setLanguageDialect("general");
      }
    } catch (err) {
      console.error("Error fetching user language dialect:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setLanguageDialect("general"); // Fallback to general
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserLanguageDialect();
  }, [user]);

  return {
    languageDialect,
    isLoading,
    error,
    refetch: fetchUserLanguageDialect,
  };
}
