"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createWorkspaceAction,
  deleteWorkspaceAction,
} from "@/app/(app)/actions";
import type { CreateWorkspaceInput } from "@/lib/validations/workspace";

/**
 * Hook layer — wraps workspace Server Actions with pending state, toasts,
 * and navigation for client components.
 */
export function useWorkspaceActions() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function create(input: CreateWorkspaceInput, onDone?: () => void) {
    startTransition(async () => {
      const res = await createWorkspaceAction(input);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Workspace created");
      onDone?.();
      router.push(`/workspace/${res.data.id}`);
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      const res = await deleteWorkspaceAction(id);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Workspace deleted");
      router.refresh();
    });
  }

  return { create, remove, isPending };
}
