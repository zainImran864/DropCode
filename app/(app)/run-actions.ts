"use server";

import { requireUser } from "@/lib/auth";
import { runCode } from "@/lib/code-runner";
import type { RunResult } from "@/types/run";
import type { ActionResult } from "./actions";

const MAX_SOURCE_BYTES = 100_000;

export async function runCodeAction(
  language: string,
  source: string,
): Promise<ActionResult<RunResult>> {
  await requireUser();

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
