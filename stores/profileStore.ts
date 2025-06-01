// stores/profileStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ProfileState {
  userId: string | null;
  country: string | null;
  languageDialect: string | null;
  profileCompleted: boolean;
  isLoading: boolean;
  lastUpdated: number | null;

  // Actions
  setProfile: (profile: Partial<ProfileState>) => void;
  loadProfile: (userId: string) => Promise<void>;
  saveProfile: (data: {
    country: string;
    languageDialect: string;
  }) => Promise<boolean>;
  clearProfile: () => void;
  isProfileStale: () => boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      userId: null,
      country: null,
      languageDialect: null,
      profileCompleted: false,
      isLoading: false,
      lastUpdated: null,

      setProfile: (profile) =>
        set((state) => ({
          ...state,
          ...profile,
          lastUpdated: Date.now(),
        })),

      isProfileStale: () => {
        const { lastUpdated } = get();
        if (!lastUpdated) return true;
        return Date.now() - lastUpdated > CACHE_DURATION;
      },

      loadProfile: async (userId: string) => {
        const state = get();

        // Return cached data if fresh and for same user
        if (
          state.userId === userId &&
          !state.isProfileStale() &&
          state.lastUpdated
        ) {
          return;
        }

        set({ isLoading: true });

        try {
          const response = await fetch("/api/user/profile");
          if (response.ok) {
            const data = await response.json();
            set({
              userId: data.userId,
              country: data.country,
              languageDialect: data.languageDialect,
              profileCompleted: Boolean(data.languageDialect && data.country),
              lastUpdated: Date.now(),
              isLoading: false,
            });
          } else {
            // Handle profile not found - user needs to complete profile
            set({
              userId,
              country: null,
              languageDialect: null,
              profileCompleted: false,
              lastUpdated: Date.now(),
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("Failed to load profile:", error);
          set({ isLoading: false });
        }
      },

      saveProfile: async (data) => {
        set({ isLoading: true });

        try {
          const response = await fetch("/api/user/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            // Optimistically update the store
            set({
              country: data.country,
              languageDialect: data.languageDialect,
              profileCompleted: true,
              lastUpdated: Date.now(),
              isLoading: false,
            });
            return true;
          } else {
            set({ isLoading: false });
            return false;
          }
        } catch (error) {
          console.error("Failed to save profile:", error);
          set({ isLoading: false });
          return false;
        }
      },

      clearProfile: () =>
        set({
          userId: null,
          country: null,
          languageDialect: null,
          profileCompleted: false,
          isLoading: false,
          lastUpdated: null,
        }),
    }),
    {
      name: "profile-store",
      storage: createJSONStorage(() => localStorage),
      // Only persist essential data
      partialize: (state) => ({
        userId: state.userId,
        country: state.country,
        languageDialect: state.languageDialect,
        profileCompleted: state.profileCompleted,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
