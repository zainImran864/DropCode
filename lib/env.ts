const DEFAULT_PISTON_URL = "https://emkc.org/api/v2/piston";

/** Treat empty/whitespace-only env values the same as "not set". */
function val(v: string | undefined): string | undefined {
  const t = v?.trim();
  return t ? t : undefined;
}

function isUrl(v: string | undefined): boolean {
  if (!v) return false;
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
}

/**
 * Public env — inlined into the browser bundle by Next.js. Safe to expose.
 * Kept resilient (no throw) so a blank/misconfigured value on the host can
 * never crash a render; falls back to sensible defaults.
 */
export const publicEnv = {
  NEXT_PUBLIC_SUPABASE_URL: val(process.env.NEXT_PUBLIC_SUPABASE_URL) ?? "",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    val(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ?? "",
  NEXT_PUBLIC_SITE_URL:
    val(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000",
};

/**
 * Server-only config. Never throws: a blank or invalid value is ignored so
 * misconfiguration on the host degrades gracefully instead of 500-ing.
 * Never import the return value into a client component.
 */
export function serverEnv() {
  const pistonRaw = val(process.env.PISTON_URL);
  return {
    SUPABASE_SECRET_KEY: val(process.env.SUPABASE_SECRET_KEY),
    LIVEBLOCKS_SECRET_KEY: val(process.env.LIVEBLOCKS_SECRET_KEY),
    PISTON_URL: isUrl(pistonRaw) ? pistonRaw! : DEFAULT_PISTON_URL,
  };
}
