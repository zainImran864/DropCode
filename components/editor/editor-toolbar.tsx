"use client";

import {
  FiCheck,
  FiSave,
  FiLock,
  FiUnlock,
  FiLoader,
  FiPlay,
  FiMessageSquare,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { PresenceAvatars } from "./presence-avatars";
import { ExportMenu } from "./export-menu";
import { VersionHistoryDialog } from "./version-history-dialog";
import { useEditorStore } from "@/store/editor-store";
import { useRun } from "@/hooks/use-run";
import { useChatStore } from "@/store/chat-store";

interface Props {
  workspaceId: string;
  workspaceName: string;
  activeFileId?: string;
  activeFileName?: string;
  activeFileLanguage?: string;
  canEdit: boolean;
  readOnly: boolean;
}

function SaveStatus() {
  const saveState = useEditorStore((s) => s.saveState);
  if (saveState === "saving") {
    return (
      <span className="flex items-center gap-1 text-xs text-zinc-400">
        <FiLoader size={12} className="animate-spin" /> Saving…
      </span>
    );
  }
  if (saveState === "unsaved") {
    return <span className="text-xs text-amber-600">Unsaved changes</span>;
  }
  return (
    <span className="flex items-center gap-1 text-xs text-zinc-400">
      <FiCheck size={12} /> Saved
    </span>
  );
}

export function EditorToolbar({
  workspaceId,
  workspaceName,
  activeFileId,
  activeFileName,
  activeFileLanguage,
  canEdit,
  readOnly,
}: Props) {
  const save = useEditorStore((s) => s.save);
  const saveState = useEditorStore((s) => s.saveState);
  const locked = useEditorStore((s) => s.locked);
  const toggleLock = useEditorStore((s) => s.toggleLock);
  const { run, isRunning } = useRun();
  const toggleChat = useChatStore((s) => s.toggle);
  const unread = useChatStore((s) => s.unread);

  return (
    <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-1.5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-3">
        <PresenceAvatars />
        {readOnly ? (
          <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
            <FiLock size={12} /> Read-only
          </span>
        ) : (
          <SaveStatus />
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle chat"
          onClick={toggleChat}
          className="relative"
        >
          <FiMessageSquare size={16} />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-medium text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
        {activeFileId && (
          <VersionHistoryDialog
            workspaceId={workspaceId}
            fileId={activeFileId}
            canEdit={canEdit}
          />
        )}
        {canEdit && (
          <Button
            variant="ghost"
            size="icon"
            aria-label={locked ? "Unlock editing" : "Lock (read-only)"}
            title={locked ? "Unlock editing" : "Lock (read-only)"}
            onClick={toggleLock}
            className={locked ? "text-amber-600" : undefined}
          >
            {locked ? <FiLock size={16} /> : <FiUnlock size={16} />}
          </Button>
        )}
        <ExportMenu
          workspaceId={workspaceId}
          workspaceName={workspaceName}
          activeFileName={activeFileName}
        />
        {activeFileLanguage && (
          <Button
            size="sm"
            variant="outline"
            disabled={isRunning}
            onClick={() => run(activeFileLanguage)}
            className="text-emerald-600"
          >
            <FiPlay size={14} className="mr-1.5" />
            {isRunning ? "Running…" : "Run"}
          </Button>
        )}
        {canEdit && !readOnly && (
          <Button
            size="sm"
            disabled={!save || saveState === "saving"}
            onClick={() => save?.()}
          >
            <FiSave size={15} className="mr-1.5" />
            Save
          </Button>
        )}
      </div>
    </div>
  );
}
