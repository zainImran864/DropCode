/**
 * Domain types mirroring the Supabase Postgres schema (see supabase/migrations).
 * Hand-written for now; can later be replaced by `supabase gen types typescript`.
 */

export type Role = "owner" | "admin" | "editor" | "viewer";

export interface Profile {
  id: string; // = auth.users.id
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  language: string;
  invite_token: string;
  settings: WorkspaceSettings;
  created_at: string;
}

export interface WorkspaceSettings {
  theme?: "light" | "dark" | "system";
  auto_save?: boolean;
}

export interface WorkspaceMember {
  workspace_id: string;
  user_id: string;
  role: Role;
  joined_at: string;
}

export interface FileRow {
  id: string;
  workspace_id: string;
  path: string;
  name: string;
  language: string;
  content: string;
  updated_at: string;
}

export interface Version {
  id: string;
  file_id: string;
  workspace_id: string;
  author_id: string;
  content: string;
  message: string | null;
  created_at: string;
}

/** Max members allowed per workspace — enforced in API + DB trigger. */
export const MAX_WORKSPACE_MEMBERS = 4;
