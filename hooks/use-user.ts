"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/store/user-store";

/**
 * Hook layer — bridges the API/Supabase to the Zustand store for components.
 * Mount once (e.g. in a top-level provider) to keep auth state in sync.
 */
export function useUser() {
  const { user, profile, isLoading, setUser, setLoading, reset } =
    useUserStore();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        reset();
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading, reset]);

  return { user, profile, isLoading };
}
