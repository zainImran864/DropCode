"use client";

import { FiX, FiLoader, FiTerminal, FiAlertTriangle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useRunStore } from "@/store/run-store";

export function OutputPanel() {
  const isOpen = useRunStore((s) => s.isOpen);
  const isRunning = useRunStore((s) => s.isRunning);
  const result = useRunStore((s) => s.result);
  const error = useRunStore((s) => s.error);
  const setOpen = useRunStore((s) => s.setOpen);

  if (!isOpen) return null;

  return (
    <div className="flex h-56 shrink-0 flex-col border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-1.5 dark:border-zinc-800">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          <FiTerminal size={13} />
          Output
          {result && (
            <span className="normal-case text-zinc-400">
              · {result.language} {result.version}
            </span>
          )}
        </span>
        <div className="flex items-center gap-3">
          {result && (
            <span
              className={
                result.code === 0 ? "text-xs text-emerald-600" : "text-xs text-red-500"
              }
            >
              exit {result.code}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close output"
            className="h-6 w-6"
            onClick={() => setOpen(false)}
          >
            <FiX size={15} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 font-mono text-xs">
        {isRunning ? (
          <div className="flex items-center gap-2 text-zinc-400">
            <FiLoader size={14} className="animate-spin" /> Running…
          </div>
        ) : error ? (
          <div className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-red-600 dark:bg-red-500/10">
            <FiAlertTriangle size={14} className="mt-0.5 shrink-0" />
            <pre className="whitespace-pre-wrap wrap-break-word">{error}</pre>
          </div>
        ) : result ? (
          <div className="flex flex-col gap-2 whitespace-pre-wrap wrap-break-word">
            {result.compileOutput && (
              <div>
                <p className="mb-0.5 text-[10px] uppercase text-zinc-400">
                  Compile
                </p>
                <pre className="whitespace-pre-wrap text-amber-600">
                  {result.compileOutput}
                </pre>
              </div>
            )}
            {result.stdout && (
              <pre className="whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">
                {result.stdout}
              </pre>
            )}
            {result.stderr && (
              <pre className="whitespace-pre-wrap text-red-500">
                {result.stderr}
              </pre>
            )}
            {!result.stdout && !result.stderr && !result.compileOutput && (
              <span className="text-zinc-400">
                (no output) — exit code {result.code}
              </span>
            )}
          </div>
        ) : (
          <span className="text-zinc-400">Run a file to see output here.</span>
        )}
      </div>
    </div>
  );
}
