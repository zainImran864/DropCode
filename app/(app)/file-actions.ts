"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import * as filesApi from "@/api/files";
import { languageFromFilename } from "@/lib/languages";
import type { FileMeta, FileRow } from "@/types/database";
import type { ActionResult } from "./actions";

function cleanName(name: string): string {
  return name.trim().replace(/[/\\]/g, "").slice(0, 80);
}

export async function createFileAction(
  workspaceId: string,
  name: string,
  fallbackLanguage: string,
): Promise<ActionResult<FileMeta>> {
  await requireUser();
  const clean = cleanName(name);
  if (clean.length < 1) return { ok: false, error: "File name is required." };

  const language = languageFromFilename(clean) ?? fallbackLanguage;
  const result = await filesApi.createFile(workspaceId, clean, language);
  if ("error" in result) return { ok: false, error: result.error };

  revalidatePath(`/workspace/${workspaceId}`);
  return { ok: true, data: result };
}

export async function renameFileAction(
  workspaceId: string,
  fileId: string,
  name: string,
  fallbackLanguage: string,
): Promise<ActionResult> {
  await requireUser();
  const clean = cleanName(name);
  if (clean.length < 1) return { ok: false, error: "File name is required." };

  const language = languageFromFilename(clean) ?? fallbackLanguage;
  const err = await filesApi.renameFile(fileId, clean, language);
  if (err) return { ok: false, error: err.error };

  revalidatePath(`/workspace/${workspaceId}`);
  return { ok: true, data: undefined };
}

export async function deleteFileAction(
  workspaceId: string,
  fileId: string,
): Promise<ActionResult> {
  await requireUser();
  const err = await filesApi.deleteFile(fileId);
  if (err) return { ok: false, error: err.error };

  revalidatePath(`/workspace/${workspaceId}`);
  return { ok: true, data: undefined };
}

/** Snapshot editor content to the DB (manual Save + Auto-Save). No revalidate. */
export async function saveFileAction(
  fileId: string,
  content: string,
): Promise<ActionResult> {
  await requireUser();
  const err = await filesApi.saveFileContent(fileId, content);
  if (err) return { ok: false, error: err.error };
  return { ok: true, data: undefined };
}

/** All files with content, for export. */
export async function getWorkspaceFilesForExport(
  workspaceId: string,
): Promise<ActionResult<FileRow[]>> {
  await requireUser();
  const files = await filesApi.getFilesWithContent(workspaceId);
  return { ok: true, data: files };
}
