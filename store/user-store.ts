import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/database";

/**
 * Store layer (Zustand) — client-side app state.
 * Holds the current auth user + profile, hydrated by the `useUser` hook.
 */
interface UserState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ user: null, profile: null, isLoading: false }),
}));
