"use client";

import Link from "next/link";
import { FiCode } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import { SidebarNav } from "./sidebar-nav";

export function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-r border-zinc-200 bg-white transition-[width] dark:border-zinc-800 dark:bg-zinc-950 md:flex",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <Link
        href="/dashboard"
        className={cn(
          "flex h-14 items-center gap-2 border-b border-zinc-200 px-5 dark:border-zinc-800",
          collapsed && "justify-center px-0",
        )}
      >
        <FiCode className="text-indigo-500" size={22} />
        {!collapsed && (
          <span className="text-lg font-semibold tracking-tight">DropCode</span>
        )}
      </Link>
      <SidebarNav />
    </aside>
  );
}
