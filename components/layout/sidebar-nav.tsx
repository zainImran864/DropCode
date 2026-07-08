"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiFolder, FiSettings } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: FiGrid },
  { href: "/workspaces", label: "Workspaces", icon: FiFolder },
  { href: "/settings", label: "Settings", icon: FiSettings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);

  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            title={collapsed ? label : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white",
              collapsed && "justify-center px-0",
            )}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
