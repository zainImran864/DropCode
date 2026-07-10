"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  getVersionContentAction,
  saveVersionAction,
} from "@/app/(app)/version-actions";
import { useEditorStore } from "@/store/editor-store";

/** Hook layer — save + restore file versions using the active editor content. */
export function useVersions(workspaceId: string, fileId: string) {
  const getContent = useEditorStore((s) => s.getContent);
  const applyContent = useEditorStore((s) => s.applyContent);
  const [isPending, startTransition] = useTransition();

  function save(message: string, onDone?: () => void) {
    const content = getContent?.() ?? "";
    if (!content.trim()) {
      toast.error("Nothing to snapshot.");
      return;
    }
    startTransition(async () => {
      const res = await saveVersionAction(workspaceId, fileId, content, message);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Version saved");
      onDone?.();
    });
  }

  function restore(versionId: string, onDone?: () => void) {
    startTransition(async () => {
      const res = await getVersionContentAction(versionId);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      applyContent?.(res.data);
      toast.success("Restored this version");
      onDone?.();
    });
  }

  return { save, restore, isPending };
}
