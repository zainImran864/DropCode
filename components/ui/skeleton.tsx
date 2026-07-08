import { cn } from "@/lib/utils";

/**
 * Base skeleton block. Compose it (set width/height via className) to mirror
 * the shape of whatever content is loading.
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-zinc-200/70 dark:bg-zinc-800/70",
        className,
      )}
      {...props}
    />
  );
}

/** Convenience: a line of text of a given width. */
export function SkeletonText({ className }: { className?: string }) {
  return <Skeleton className={cn("h-4 w-full", className)} />;
}
