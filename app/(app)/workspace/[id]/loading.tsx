import { EditorSkeleton } from "@/components/editor/editor-skeleton";

export default function Loading() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-zinc-50 dark:bg-black">
      <div className="h-14 shrink-0 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950" />
      <div className="min-h-0 flex-1">
        <EditorSkeleton />
      </div>
    </div>
  );
}
