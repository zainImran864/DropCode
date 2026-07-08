import { cn } from "@/lib/utils";

function initialsFrom(name?: string | null): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

interface AvatarProps {
  name?: string | null;
  src?: string | null;
  className?: string;
}

/** Reusable avatar — image if available, otherwise initials. Size via className. */
export function Avatar({ name, src, className }: AvatarProps) {
  const base = "h-8 w-8 shrink-0 rounded-full";
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={name ?? "avatar"}
        className={cn(base, "object-cover", className)}
      />
    );
  }
  return (
    <div
      className={cn(
        base,
        "flex items-center justify-center bg-indigo-100 text-xs font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
        className,
      )}
    >
      {initialsFrom(name)}
    </div>
  );
}
