"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createFileAction,
  deleteFileAction,
  renameFileAction,
} from "@/app/(app)/file-actions";
import { useFileStore } from "@/store/file-store";

/** Hook layer — file explorer mutations with pending state + toasts. */
export function useFileActions(workspaceId: string, fallbackLanguage: string) {
  const router = useRouter();
  const setActiveFile = useFileStore((s) => s.setActiveFile);
  const [isPending, startTransition] = useTransition();

  function createFile(name: string, onDone?: () => void) {
    startTransition(async () => {
      const res = await createFileAction(workspaceId, name, fallbackLanguage);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setActiveFile(res.data.id);
      onDone?.();
      router.refresh();
    });
  }

  function renameFile(fileId: string, name: string, onDone?: () => void) {
    startTransition(async () => {
      const res = await renameFileAction(
        workspaceId,
        fileId,
        name,
        fallbackLanguage,
      );
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      onDone?.();
      router.refresh();
    });
  }

  function deleteFile(fileId: string) {
    startTransition(async () => {
      const res = await deleteFileAction(workspaceId, fileId);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      router.refresh();
    });
  }

  return { createFile, renameFile, deleteFile, isPending };
}
