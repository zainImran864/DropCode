import "server-only";
import { serverEnv } from "@/lib/env";
import { getLanguage } from "@/lib/languages";
import type { RunResult } from "@/types/run";

/**
 * Code execution. Defaults to Wandbox (free, no key) because the public Piston
 * API (emkc.org) became whitelist-only in 2026. If PISTON_URL points at a
 * self-hosted Piston instance (any non-emkc host), that is used instead.
 */
export async function runCode(
  language: string,
  source: string,
  stdin = "",
): Promise<RunResult> {
  const pistonUrl = serverEnv().PISTON_URL;
  if (pistonUrl && !pistonUrl.includes("emkc.org")) {
    return runViaPiston(pistonUrl, language, source, stdin);
  }
  return runViaWandbox(language, source, stdin);
}

/* -------------------------------- Wandbox -------------------------------- */

const WANDBOX_URL = "https://wandbox.org/api/compile.json";
const WANDBOX_LIST_URL = "https://wandbox.org/api/list.json";

// DropCode language value -> Wandbox `language` label (as in list.json).
const WANDBOX_LANGUAGE: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  c: "C",
  cpp: "C++",
  java: "Java",
  go: "Go",
  rust: "Rust",
  ruby: "Ruby",
  php: "PHP",
};

interface WandboxCompiler {
  name: string;
  language: string;
}
let wandboxList: WandboxCompiler[] | null = null;

/** Resolve a real Wandbox compiler id for a language from its live list. */
async function wandboxCompilerFor(language: string): Promise<string | null> {
  const label = WANDBOX_LANGUAGE[language];
  if (!label) return null;
  if (!wandboxList) {
    const r = await fetch(WANDBOX_LIST_URL);
    wandboxList = r.ok ? ((await r.json()) as WandboxCompiler[]) : [];
  }
  return wandboxList.find((c) => c.language === label)?.name ?? null;
}

async function runViaWandbox(
  language: string,
  source: string,
  stdin: string,
): Promise<RunResult> {
  const compiler = await wandboxCompilerFor(language);
  if (!compiler) {
    return {
      language,
      version: "",
      stdout: "",
      stderr: `Running "${language}" isn't supported by the runner yet.`,
      code: 1,
      output: "",
      compileOutput: null,
    };
  }

  const res = await fetch(WANDBOX_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ compiler, code: source, stdin }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Runner returned ${res.status}. ${text.slice(0, 200)}`.trim());
  }

  const data = (await res.json()) as {
    status?: string;
    program_output?: string;
    program_error?: string;
    compiler_error?: string;
  };

  const stdout = data.program_output ?? "";
  const stderr = data.program_error ?? "";
  const code = Number.parseInt(data.status ?? "0", 10);

  return {
    language,
    version: compiler,
    stdout,
    stderr,
    code: Number.isNaN(code) ? 0 : code,
    output: `${stdout}${stderr}`,
    compileOutput: data.compiler_error || null,
  };
}

/* -------------------------- Self-hosted Piston --------------------------- */

interface Runtime {
  language: string;
  version: string;
  aliases: string[];
}
let runtimesCache: Runtime[] | null = null;

async function runViaPiston(
  base: string,
  language: string,
  source: string,
  stdin: string,
): Promise<RunResult> {
  const piston = getLanguage(language)?.piston ?? language;

  if (!runtimesCache) {
    const r = await fetch(`${base}/runtimes`);
    runtimesCache = r.ok ? ((await r.json()) as Runtime[]) : [];
  }
  const version =
    runtimesCache.find(
      (r) => r.language === piston || (r.aliases ?? []).includes(piston),
    )?.version ?? "*";

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
    throw new Error(`Runner returned ${res.status}. ${text.slice(0, 200)}`.trim());
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
