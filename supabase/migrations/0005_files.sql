-- DropCode — Phase 5: files table + RLS.
-- Content is authored live via Yjs (Liveblocks); this table stores the
-- file list and snapshots saved from the editor (for export/backup/history).

create table if not exists public.files (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name         text not null,
  language     text not null default 'javascript',
  content      text not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists files_workspace_idx on public.files (workspace_id);

alter table public.files enable row level security;

-- Any member can read files.
drop policy if exists "members read files" on public.files;
create policy "members read files"
  on public.files for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

-- Editors and up (not viewers) can create/update/delete files.
drop policy if exists "editors insert files" on public.files;
create policy "editors insert files"
  on public.files for insert
  to authenticated
  with check (public.workspace_role(workspace_id) in ('owner', 'admin', 'editor'));

drop policy if exists "editors update files" on public.files;
create policy "editors update files"
  on public.files for update
  to authenticated
  using (public.workspace_role(workspace_id) in ('owner', 'admin', 'editor'));

drop policy if exists "editors delete files" on public.files;
create policy "editors delete files"
  on public.files for delete
  to authenticated
  using (public.workspace_role(workspace_id) in ('owner', 'admin', 'editor'));
