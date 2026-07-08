/** Join conditional className strings. Lightweight `clsx` substitute. */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

const CURSOR_PALETTE = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
];

/** Deterministic color for a user (cursor/presence), derived from their id. */
export function colorFromString(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return CURSOR_PALETTE[hash % CURSOR_PALETTE.length]!;
}
