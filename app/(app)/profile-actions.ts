"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { updateProfile } from "@/api/profile";
import type { ActionResult } from "./actions";

export async function updateProfileAction(input: {
  displayName?: string;
  avatarUrl?: string;
}): Promise<ActionResult> {
  const user = await requireUser();

  const fields: { display_name?: string; avatar_url?: string } = {};
  if (typeof input.displayName === "string") {
    const name = input.displayName.trim();
    if (name.length < 2) return { ok: false, error: "Name is too short." };
    fields.display_name = name;
  }
  if (typeof input.avatarUrl === "string") {
    fields.avatar_url = input.avatarUrl;
  }

  if (Object.keys(fields).length === 0) {
    return { ok: false, error: "Nothing to update." };
  }

  const err = await updateProfile(user.id, fields);
  if (err) return { ok: false, error: err.error };

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { ok: true, data: undefined };
}
