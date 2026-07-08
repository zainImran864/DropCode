import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  ChartPoint,
  DashboardStats,
  Workspace,
  WorkspaceListItem,
} from "@/types/database";
import type { CreateWorkspaceInput } from "@/lib/validations/workspace";
import { languageLabel } from "@/lib/languages";

/**
 * API layer — server-side workspace data access (guarded by RLS).
 * Consumed by Server Components and Server Actions.
 */

/** All workspaces the current user belongs to, with member counts. */
export async function getWorkspaces(): Promise<WorkspaceListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workspaces")
    .select("*, workspace_members(count)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((w) => {
    const { workspace_members, ...rest } = w as Workspace & {
      workspace_members: { count: number }[];
    };
    return { ...rest, member_count: workspace_members?.[0]?.count ?? 0 };
  });
}

/** A single workspace by id (RLS returns null if you're not a member). */
export async function getWorkspaceById(id: string): Promise<Workspace | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Workspace;
}

export async function createWorkspace(
  input: CreateWorkspaceInput,
  ownerId: string,
): Promise<{ id: string } | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workspaces")
    .insert({ name: input.name, language: input.language, owner_id: ownerId })
    .select("id")
    .single();

  if (error || !data) return null;
  return { id: data.id };
}

export async function deleteWorkspace(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from("workspaces").delete().eq("id", id);
  return !error;
}

/** Derive dashboard stat-card numbers + chart series from the workspace list. */
export function buildDashboardData(
  workspaces: WorkspaceListItem[],
  userId: string,
): { stats: DashboardStats; byLanguage: ChartPoint[]; trend: ChartPoint[] } {
  const stats: DashboardStats = {
    workspaceCount: workspaces.length,
    ownedCount: workspaces.filter((w) => w.owner_id === userId).length,
    memberSeats: workspaces.reduce((sum, w) => sum + w.member_count, 0),
    languageCount: new Set(workspaces.map((w) => w.language)).size,
  };

  const langCounts = new Map<string, number>();
  for (const w of workspaces) {
    langCounts.set(w.language, (langCounts.get(w.language) ?? 0) + 1);
  }
  const byLanguage: ChartPoint[] = [...langCounts.entries()].map(
    ([lang, value]) => ({ label: languageLabel(lang), value }),
  );

  // Workspaces created per day over the last 7 days.
  const trend = last7DaysTrend(workspaces);

  return { stats, byLanguage, trend };
}

function last7DaysTrend(workspaces: WorkspaceListItem[]): ChartPoint[] {
  const days: ChartPoint[] = [];
  const now = new Date();
  const counts = new Map<string, number>();
  for (const w of workspaces) {
    const key = w.created_at.slice(0, 10); // YYYY-MM-DD
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({
      label: d.toLocaleDateString(undefined, { weekday: "short" }),
      value: counts.get(key) ?? 0,
    });
  }
  return days;
}
