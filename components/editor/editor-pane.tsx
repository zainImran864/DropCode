"use client";

import { useEffect } from "react";
import { Room } from "./room";
import { FileExplorer } from "./file-explorer";
import { EditorToolbar } from "./editor-toolbar";
import { CollaborativeEditor } from "./collaborative-editor";
import { EmptyEditorState } from "./empty-editor-state";
import { useFileStore } from "@/store/file-store";
import type { FileMeta } from "@/types/database";

interface Props {
  workspaceId: string;
  workspaceName: string;
  files: FileMeta[];
  fallbackLanguage: string;
  canEdit: boolean;
  readOnly: boolean;
}

/** File explorer + toolbar + collaborative editor, inside the Liveblocks room. */
export function EditorPane({
  workspaceId,
  workspaceName,
  files,
  fallbackLanguage,
  canEdit,
  readOnly,
}: Props) {
  const activeFileId = useFileStore((s) => s.activeFileId);
  const setActiveFile = useFileStore((s) => s.setActiveFile);

  // Keep the selection valid: default to the first file, reset if it's gone.
  useEffect(() => {
    if (files.length === 0) {
      if (activeFileId) setActiveFile(null);
      return;
    }
    if (!activeFileId || !files.some((f) => f.id === activeFileId)) {
      setActiveFile(files[0]!.id);
    }
  }, [files, activeFileId, setActiveFile]);

  const activeFile = files.find((f) => f.id === activeFileId) ?? null;

  return (
    <Room workspaceId={workspaceId}>
      <div className="flex min-h-0 flex-1">
        <FileExplorer
          workspaceId={workspaceId}
          files={files}
          fallbackLanguage={fallbackLanguage}
          canEdit={canEdit}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <EditorToolbar
            workspaceId={workspaceId}
            workspaceName={workspaceName}
            activeFileName={activeFile?.name}
            canEdit={canEdit}
            readOnly={readOnly}
          />
          <div className="min-h-0 flex-1">
            {activeFile ? (
              <CollaborativeEditor
                key={activeFile.id}
                fileId={activeFile.id}
                language={activeFile.language}
                readOnly={readOnly}
              />
            ) : (
              <EmptyEditorState canEdit={canEdit} />
            )}
          </div>
        </div>
      </div>
    </Room>
  );
}
