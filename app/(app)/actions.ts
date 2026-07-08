"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import * as workspacesApi from "@/api/workspaces";
import { createWorkspaceSchema } from "@/lib/validations/workspace";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function createWorkspaceAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();

  const parsed = createWorkspaceSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }

  const created = await workspacesApi.createWorkspace(parsed.data, user.id);
  if (!created) {
    return { ok: false, error: "Could not create workspace." };
  }

  revalidatePath("/dashboard");
  return { ok: true, data: created };
}

export async function deleteWorkspaceAction(
  id: string,
): Promise<ActionResult> {
  await requireUser();

  const success = await workspacesApi.deleteWorkspace(id);
  if (!success) {
    return { ok: false, error: "Could not delete workspace." };
  }

  revalidatePath("/dashboard");
  return { ok: true, data: undefined };
}
