"use client";

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export const DropdownMenu = DropdownPrimitive.Root;
export const DropdownMenuTrigger = DropdownPrimitive.Trigger;

export function DropdownMenuContent({
  className,
  align = "end",
  ...props
}: React.ComponentProps<typeof DropdownPrimitive.Content>) {
  return (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.Content
        align={align}
        sideOffset={4}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border border-zinc-200 bg-white p-1 shadow-md dark:border-zinc-800 dark:bg-zinc-950",
          className,
        )}
        {...props}
      />
    </DropdownPrimitive.Portal>
  );
}

export function DropdownMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownPrimitive.Item>) {
  return (
    <DropdownPrimitive.Item
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-zinc-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-800",
        className,
      )}
      {...props}
    />
  );
}
