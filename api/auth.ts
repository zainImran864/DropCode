import { createClient } from "@/lib/supabase/client";
import { publicEnv } from "@/lib/env";
import type { LoginInput, RegisterInput } from "@/lib/validations/auth";

/**
 * API layer — client-side auth mutations via the browser Supabase client.
 * Runs in the browser; the browser client persists the session to cookies so
 * the server (proxy.ts + Server Components) can read it.
 */

export function signInWithPassword({ email, password }: LoginInput) {
  return createClient().auth.signInWithPassword({ email, password });
}

export function signUpWithEmail({ displayName, email, password }: RegisterInput) {
  return createClient().auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      // Confirmation link returns here with a `code` to exchange for a session.
      emailRedirectTo: `${publicEnv.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/dashboard`,
    },
  });
}

export function signOut() {
  return createClient().auth.signOut();
}
