import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  MemberWithProfile,
  Role,
  WorkspacePreview,
} from "@/types/database";

/** API layer — server-side workspace membership data access. */

/** Members of a workspace with their profile info (RLS: members only). */
export async function getWorkspaceMembers(
  workspaceId: string,
): Promise<MemberWithProfile[]> {
  const supabase = await createClient();

  const { data: members } = await supabase
    .from("workspace_members")
    .select("user_id, role, joined_at")
    .eq("workspace_id", workspaceId)
    .order("joined_at", { ascending: true });

  if (!members || members.length === 0) return [];

  const ids = members.map((m) => m.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .in("id", ids);

  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));

  return members.map((m) => ({
    user_id: m.user_id,
    role: m.role as Role,
    joined_at: m.joined_at,
    display_name: byId.get(m.user_id)?.display_name ?? null,
    avatar_url: byId.get(m.user_id)?.avatar_url ?? null,
  }));
}

/** Preview a workspace from an invite token (works pre-membership). */
export async function getWorkspacePreview(
  token: string,
): Promise<WorkspacePreview | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_workspace_preview", {
    p_token: token,
  });

  if (error || !data || data.length === 0) return null;
  const row = data[0];
  return {
    id: row.id,
    name: row.name,
    language: row.language,
    member_count: Number(row.member_count),
  };
}
