"use client";

import Link from "next/link";
import { FiUsers, FiTrash2 } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { languageLabel } from "@/lib/languages";
import { useWorkspaceActions } from "@/hooks/use-workspace-actions";
import { MAX_WORKSPACE_MEMBERS, type WorkspaceListItem } from "@/types/database";

interface Props {
  workspace: WorkspaceListItem;
  isOwner: boolean;
}

export function WorkspaceCard({ workspace, isOwner }: Props) {
  const { remove, isPending } = useWorkspaceActions();

  return (
    <Card className="group relative flex flex-col p-5 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700">
      <Link href={`/workspace/${workspace.id}`} className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-semibold">{workspace.name}</h3>
          <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            {languageLabel(workspace.language)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-zinc-500">
          <FiUsers size={14} />
          <span>
            {workspace.member_count}/{MAX_WORKSPACE_MEMBERS} members
          </span>
        </div>
      </Link>

      {isOwner && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Delete workspace"
          disabled={isPending}
          onClick={() => remove(workspace.id)}
          className="absolute right-3 top-3 text-zinc-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
        >
          <FiTrash2 size={16} />
        </Button>
      )}
    </Card>
  );
}
