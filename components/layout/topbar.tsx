"use client";

import { FiMenu } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/logout-button";
import { useUIStore } from "@/store/ui-store";

interface TopbarProps {
  userLabel: string;
}

export function Topbar({ userLabel }: TopbarProps) {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle sidebar"
        onClick={toggleSidebar}
        className="hidden md:inline-flex"
      >
        <FiMenu size={18} />
      </Button>

      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-zinc-500 sm:inline">
          {userLabel}
        </span>
        <ThemeToggle />
        <LogoutButton />
      </div>
    </header>
  );
}
