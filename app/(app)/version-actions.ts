"use server";

import { requireUser } from "@/lib/auth";
import * as versionsApi from "@/api/versions";
import type { VersionMeta } from "@/types/database";
import type { ActionResult } from "./actions";

export async function saveVersionAction(
  workspaceId: string,
  fileId: string,
  content: string,
  message: string,
): Promise<ActionResult> {
  const user = await requireUser();
  if (!content.trim()) return { ok: false, error: "Nothing to snapshot." };

  const err = await versionsApi.createVersion(
    workspaceId,
    fileId,
    user.id,
    content,
    message.trim() || null,
  );
  if (err) return { ok: false, error: err.error };
  return { ok: true, data: undefined };
}

export async function listVersionsAction(
  fileId: string,
): Promise<ActionResult<VersionMeta[]>> {
  await requireUser();
  const versions = await versionsApi.listVersions(fileId);
  return { ok: true, data: versions };
}

export async function getVersionContentAction(
  versionId: string,
): Promise<ActionResult<string>> {
  await requireUser();
  const content = await versionsApi.getVersionContent(versionId);
  if (content === null) return { ok: false, error: "Version not found." };
  return { ok: true, data: content };
}
