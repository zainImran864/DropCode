import { z } from "zod";

/**
 * Public env — inlined into the browser bundle by Next.js. Safe to expose.
 * Validated eagerly at import so a missing/malformed value fails fast.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
});

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

/**
 * Server-only secrets. Optional for now so the app boots before the
 * Liveblocks/admin keys exist; tighten to required in their phases.
 * Never import the return value into a client component.
 */
const serverEnvSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().min(1).optional(),
  LIVEBLOCKS_SECRET_KEY: z.string().min(1).optional(),
  PISTON_URL: z.string().url().default("https://emkc.org/api/v2/piston"),
});

let cached: z.infer<typeof serverEnvSchema> | null = null;

export function serverEnv() {
  if (typeof window !== "undefined") {
    throw new Error("serverEnv() must not be called on the client");
  }
  if (!cached) {
    cached = serverEnvSchema.parse({
      SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
      LIVEBLOCKS_SECRET_KEY: process.env.LIVEBLOCKS_SECRET_KEY,
      PISTON_URL: process.env.PISTON_URL,
    });
  }
  return cached;
}
