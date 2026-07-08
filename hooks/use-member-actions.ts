"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  leaveWorkspaceAction,
  removeMemberAction,
  resetInviteTokenAction,
  updateMemberRoleAction,
} from "@/app/(app)/member-actions";
import type { Role } from "@/types/database";

/** Hook layer — member management actions with pending state + toasts. */
export function useMemberActions(workspaceId: string) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function updateRole(userId: string, role: Role) {
    startTransition(async () => {
      const res = await updateMemberRoleAction(workspaceId, userId, role);
      if (!res.ok) return toast.error(res.error);
      toast.success("Role updated");
      router.refresh();
    });
  }

  function removeMember(userId: string) {
    startTransition(async () => {
      const res = await removeMemberAction(workspaceId, userId);
      if (!res.ok) return toast.error(res.error);
      toast.success("Member removed");
      router.refresh();
    });
  }

  function leave() {
    startTransition(async () => {
      const res = await leaveWorkspaceAction(workspaceId);
      if (!res.ok) return toast.error(res.error);
      toast.success("You left the workspace");
      router.push("/dashboard");
      router.refresh();
    });
  }

  function resetToken(onDone?: (token: string) => void) {
    startTransition(async () => {
      const res = await resetInviteTokenAction(workspaceId);
      if (!res.ok) return toast.error(res.error);
      toast.success("Invite link reset");
      onDone?.(res.data.token);
      router.refresh();
    });
  }

  return { updateRole, removeMember, leave, resetToken, isPending };
}
