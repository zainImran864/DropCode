import { Skeleton } from "@/components/ui/skeleton";

/** Fills the editor area while Liveblocks connects / Monaco loads. */
export function EditorSkeleton() {
  return (
    <div className="flex h-full flex-col gap-3 p-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: `${35 + ((i * 37) % 55)}%` }}
        />
      ))}
    </div>
  );
}
