import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/** Styled native select — consistent with Input, no extra deps. */
export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-400",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});
