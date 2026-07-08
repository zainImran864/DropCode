"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 p-6 text-center dark:bg-black">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="max-w-md text-sm text-zinc-500">
        This page hit an error while loading.
        {error.digest ? ` (ref: ${error.digest})` : ""}
      </p>
      <div className="flex gap-2">
        <button onClick={reset} className={buttonClasses({ size: "sm" })}>
          Try again
        </button>
        <Link
          href="/dashboard"
          className={buttonClasses({ variant: "outline", size: "sm" })}
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
