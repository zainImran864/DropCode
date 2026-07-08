import "server-only";
import { serverEnv } from "@/lib/env";
import { getLanguage } from "@/lib/languages";
import type { RunResult } from "@/types/run";

interface Runtime {
  language: string;
  version: string;
  aliases: string[];
}

let runtimesCache: Runtime[] | null = null;

/** Resolve the Piston version for a language (Piston /execute requires one). */
async function resolveVersion(base: string, piston: string): Promise<string> {
  if (!runtimesCache) {
    const res = await fetch(`${base}/runtimes`);
    runtimesCache = res.ok ? ((await res.json()) as Runtime[]) : [];
  }
  const match = runtimesCache.find(
    (r) => r.language === piston || (r.aliases ?? []).includes(piston),
  );
  return match?.version ?? "*";
}

/** Execute source code via Piston and return normalized output. */
export async function runCode(
  language: string,
  source: string,
  stdin = "",
): Promise<RunResult> {
  const base = serverEnv().PISTON_URL;
  const piston = getLanguage(language)?.piston ?? language;
  const version = await resolveVersion(base, piston);

  const res = await fetch(`${base}/execute`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      language: piston,
      version,
      files: [{ content: source }],
      stdin,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Piston returned ${res.status}. ${text.slice(0, 200)}`.trim(),
    );
  }

  const data = (await res.json()) as {
    language?: string;
    version?: string;
    run?: { stdout?: string; stderr?: string; code?: number; output?: string };
    compile?: { output?: string };
  };
  const run = data.run ?? {};

  return {
    language: data.language ?? piston,
    version: data.version ?? version,
    stdout: run.stdout ?? "",
    stderr: run.stderr ?? "",
    code: run.code ?? 0,
    output: run.output ?? "",
    compileOutput: data.compile?.output || null,
  };
}
