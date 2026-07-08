"use client";

import { toast } from "sonner";
import { runCodeAction } from "@/app/(app)/run-actions";
import { useEditorStore } from "@/store/editor-store";
import { useRunStore } from "@/store/run-store";

/** Hook layer — runs the active editor's content via the run action. */
export function useRun() {
  const getContent = useEditorStore((s) => s.getContent);
  const isRunning = useRunStore((s) => s.isRunning);
  const setRunning = useRunStore((s) => s.setRunning);
  const setResult = useRunStore((s) => s.setResult);
  const setError = useRunStore((s) => s.setError);
  const setOpen = useRunStore((s) => s.setOpen);

  async function run(language: string) {
    const content = getContent?.() ?? "";
    if (!content.trim()) {
      toast.error("Nothing to run.");
      return;
    }
    setOpen(true);
    setResult(null);
    setError(null);
    setRunning(true);
    const res = await runCodeAction(language, content);
    setRunning(false);
    if (!res.ok) {
      // Show the error in the output panel (persistent), not just a toast.
      setError(res.error);
      return;
    }
    setResult(res.data);
  }

  return { run, isRunning };
}
