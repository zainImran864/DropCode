import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

/**
 * API layer — pure data-access functions. No React, no state.
 * These run on the server (Server Components / Route Handlers / Actions).
 */

/** The authenticated user's profile, or null if signed out. */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return null;
  return data as Profile;
}
