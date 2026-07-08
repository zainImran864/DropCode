/** Join conditional className strings. Lightweight `clsx` substitute. */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
