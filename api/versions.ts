import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { VersionMeta } from "@/types/database";

/** API layer — server-side version-history data access (RLS-guarded). */

export async function listVersions(fileId: string): Promise<VersionMeta[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("versions")
    .select("id, file_id, author_id, message, created_at")
    .eq("file_id", fileId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (!data || data.length === 0) return [];

  const authorIds = [...new Set(data.map((v) => v.author_id).filter(Boolean))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name")
    .in("id", authorIds as string[]);
  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));

  return data.map((v) => ({
    id: v.id,
    file_id: v.file_id,
    author_id: v.author_id,
    message: v.message,
    created_at: v.created_at,
    author_name: v.author_id ? (nameById.get(v.author_id) ?? null) : null,
  }));
}

export async function getVersionContent(id: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("versions")
    .select("content")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data.content as string;
}

export async function createVersion(
  workspaceId: string,
  fileId: string,
  authorId: string,
  content: string,
  message: string | null,
): Promise<{ error: string } | null> {
  const supabase = await createClient();
  const { error } = await supabase.from("versions").insert({
    workspace_id: workspaceId,
    file_id: fileId,
    author_id: authorId,
    content,
    message,
  });
  return error ? { error: error.message } : null;
}
