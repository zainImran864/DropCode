"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/types/database";
import type { ActionResult } from "./actions";

export async function joinWorkspaceAction(
  token: string,
): Promise<ActionResult<{ workspaceId: string }>> {
  await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("join_workspace", {
    p_token: token,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: { workspaceId: data as string } };
}

export async function updateMemberRoleAction(
  workspaceId: string,
  userId: string,
  role: Role,
): Promise<ActionResult> {
  await requireUser();
  if (!["admin", "editor", "viewer"].includes(role)) {
    return { ok: false, error: "Invalid role." };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("workspace_members")
    .update({ role })
    .eq("workspace_id", workspaceId)
    .eq("user_id", userId);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/workspace/${workspaceId}`);
  return { ok: true, data: undefined };
}

export async function removeMemberAction(
  workspaceId: string,
  userId: string,
): Promise<ActionResult> {
  await requireUser();
  const supabase = await createClient();

  // Guard: never remove the owner.
  const { data: target } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", userId)
    .maybeSingle();
  if (target?.role === "owner") {
    return { ok: false, error: "The owner can't be removed." };
  }

  const { error } = await supabase
    .from("workspace_members")
    .delete()
    .eq("workspace_id", workspaceId)
    .eq("user_id", userId);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/workspace/${workspaceId}`);
  return { ok: true, data: undefined };
}

export async function leaveWorkspaceAction(
  workspaceId: string,
): Promise<ActionResult> {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: me } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (me?.role === "owner") {
    return {
      ok: false,
      error: "Owners can't leave — delete the workspace instead.",
    };
  }

  const { error } = await supabase
    .from("workspace_members")
    .delete()
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard");
  return { ok: true, data: undefined };
}

export async function resetInviteTokenAction(
  workspaceId: string,
): Promise<ActionResult<{ token: string }>> {
  await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("reset_invite_token", {
    p_workspace_id: workspaceId,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/workspace/${workspaceId}`);
  return { ok: true, data: { token: data as string } };
}
