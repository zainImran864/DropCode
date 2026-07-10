"use server";

import { requireUser } from "@/lib/auth";
import { runCode } from "@/lib/code-runner";
import type { RunResult } from "@/types/run";
import type { ActionResult } from "./actions";

const MAX_SOURCE_BYTES = 100_000;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 15; // runs per user per minute

const runHits = new Map<string, number[]>();

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const recent = (runHits.get(userId) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS,
  );
  if (recent.length >= RATE_MAX) {
    runHits.set(userId, recent);
    return true;
  }
  recent.push(now);
  runHits.set(userId, recent);
  return false;
}

export async function runCodeAction(
  language: string,
  source: string,
): Promise<ActionResult<RunResult>> {
  const user = await requireUser();

  if (isRateLimited(user.id)) {
    return { ok: false, error: "Too many runs — please wait a moment." };
  }
  if (!source.trim()) return { ok: false, error: "Nothing to run." };
  if (source.length > MAX_SOURCE_BYTES) {
    return { ok: false, error: "File is too large to run." };
  }

  try {
    const result = await runCode(language, source);
    return { ok: true, data: result };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to run code.",
    };
  }
}
