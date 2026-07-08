"use client";

import { useEffect, useState } from "react";
import {
  FiPlus,
  FiFile,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFileStore } from "@/store/file-store";
import { useFileActions } from "@/hooks/use-file-actions";
import type { FileMeta } from "@/types/database";

interface Props {
  workspaceId: string;
  files: FileMeta[];
  fallbackLanguage: string;
  canEdit: boolean;
}

export function FileExplorer({
  workspaceId,
  files,
  fallbackLanguage,
  canEdit,
}: Props) {
  const activeFileId = useFileStore((s) => s.activeFileId);
  const setActiveFile = useFileStore((s) => s.setActiveFile);
  const { createFile, renameFile, deleteFile, isPending } = useFileActions(
    workspaceId,
    fallbackLanguage,
  );

  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  function submitCreate() {
    if (!newName.trim()) return setCreating(false);
    createFile(newName, () => {
      setNewName("");
      setCreating(false);
    });
  }

  function submitRename(id: string) {
    if (!renameValue.trim()) return setRenamingId(null);
    renameFile(id, renameValue, () => setRenamingId(null));
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Files
        </span>
        {canEdit && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="New file"
            className="h-6 w-6"
            disabled={isPending}
            onClick={() => setCreating(true)}
          >
            <FiPlus size={15} />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {files.length === 0 && !creating && (
          <p className="px-2 py-6 text-center text-xs text-zinc-400">
            No files yet
          </p>
        )}

        {files.map((file) => {
          const isActive = file.id === activeFileId;
          if (renamingId === file.id) {
            return (
              <Input
                key={file.id}
                autoFocus
                value={renameValue}
                disabled={isPending}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={() => submitRename(file.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitRename(file.id);
                  if (e.key === "Escape") setRenamingId(null);
                }}
                className="my-0.5 h-8 py-0 text-sm"
              />
            );
          }
          return (
            <div
              key={file.id}
              className={cn(
                "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                isActive
                  ? "bg-zinc-100 dark:bg-zinc-800"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-900",
              )}
            >
              <button
                type="button"
                onClick={() => setActiveFile(file.id)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <FiFile size={14} className="shrink-0 text-zinc-400" />
                <span className="truncate">{file.name}</span>
              </button>

              {canEdit && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label="File actions"
                      className="shrink-0 text-zinc-400 opacity-0 transition-opacity hover:text-zinc-700 group-hover:opacity-100 dark:hover:text-zinc-200"
                    >
                      <FiMoreVertical size={15} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onSelect={() => {
                        setRenameValue(file.name);
                        setRenamingId(file.id);
                      }}
                    >
                      <FiEdit2 size={14} />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:bg-red-50 dark:focus:bg-red-500/10"
                      onSelect={() => {
                        if (confirm(`Delete "${file.name}"?`)) {
                          if (activeFileId === file.id) setActiveFile(null);
                          deleteFile(file.id);
                        }
                      }}
                    >
                      <FiTrash2 size={14} />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        })}

        {creating && (
          <Input
            autoFocus
            placeholder="filename.js"
            value={newName}
            disabled={isPending}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={submitCreate}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitCreate();
              if (e.key === "Escape") setCreating(false);
            }}
            className="my-0.5 h-8 py-0 text-sm"
          />
        )}
      </div>
    </aside>
  );
}
