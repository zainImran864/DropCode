/**
 * Supported languages. `monaco` = Monaco editor id, `piston` = Piston runtime.
 * Used by the workspace picker now; the editor + Run Code map to these later.
 */
export interface LanguageOption {
  value: string;
  label: string;
  monaco: string;
  piston: string;
}

export const LANGUAGES: LanguageOption[] = [
  { value: "javascript", label: "JavaScript", monaco: "javascript", piston: "javascript" },
  { value: "typescript", label: "TypeScript", monaco: "typescript", piston: "typescript" },
  { value: "python", label: "Python", monaco: "python", piston: "python" },
  { value: "java", label: "Java", monaco: "java", piston: "java" },
  { value: "cpp", label: "C++", monaco: "cpp", piston: "c++" },
  { value: "c", label: "C", monaco: "c", piston: "c" },
  { value: "go", label: "Go", monaco: "go", piston: "go" },
  { value: "rust", label: "Rust", monaco: "rust", piston: "rust" },
  { value: "ruby", label: "Ruby", monaco: "ruby", piston: "ruby" },
  { value: "php", label: "PHP", monaco: "php", piston: "php" },
];

export function getLanguage(value: string): LanguageOption | undefined {
  return LANGUAGES.find((l) => l.value === value);
}

export function languageLabel(value: string): string {
  return getLanguage(value)?.label ?? value;
}

const EXTENSION_MAP: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  java: "java",
  cpp: "cpp",
  cc: "cpp",
  cxx: "cpp",
  c: "c",
  h: "c",
  go: "go",
  rs: "rust",
  rb: "ruby",
  php: "php",
};

/** Infer a language from a filename extension, or null if unknown. */
export function languageFromFilename(name: string): string | null {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_MAP[ext] ?? null;
}
