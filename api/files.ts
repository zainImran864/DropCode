import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { FileMeta, FileRow } from "@/types/database";

/** API layer — server-side file data access (RLS-guarded). */

const META_COLUMNS = "id, workspace_id, name, language, created_at, updated_at";

export async function getFiles(workspaceId: string): Promise<FileMeta[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("files")
    .select(META_COLUMNS)
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true });
  return (data ?? []) as FileMeta[];
}

export async function getFilesWithContent(
  workspaceId: string,
): Promise<FileRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("files")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true });
  return (data ?? []) as FileRow[];
}

export async function createFile(
  workspaceId: string,
  name: string,
  language: string,
): Promise<FileMeta | { error: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("files")
    .insert({ workspace_id: workspaceId, name, language })
    .select(META_COLUMNS)
    .single();
  if (error) return { error: error.message };
  return data as FileMeta;
}

export async function renameFile(
  id: string,
  name: string,
  language: string,
): Promise<{ error: string } | null> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("files")
    .update({ name, language, updated_at: new Date().toISOString() })
    .eq("id", id);
  return error ? { error: error.message } : null;
}

export async function deleteFile(id: string): Promise<{ error: string } | null> {
  const supabase = await createClient();
  const { error } = await supabase.from("files").delete().eq("id", id);
  return error ? { error: error.message } : null;
}

export async function saveFileContent(
  id: string,
  content: string,
): Promise<{ error: string } | null> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("files")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", id);
  return error ? { error: error.message } : null;
}
