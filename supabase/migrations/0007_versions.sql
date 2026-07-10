-- DropCode — Phase 9: version history for files.
-- A version is an immutable snapshot of a file's content saved by a member.

create table if not exists public.versions (
  id           uuid primary key default gen_random_uuid(),
  file_id      uuid not null references public.files (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  author_id    uuid references auth.users (id) on delete set null,
  content      text not null,
  message      text,
  created_at   timestamptz not null default now()
);

create index if not exists versions_file_idx
  on public.versions (file_id, created_at desc);

alter table public.versions enable row level security;

-- Members can read history.
drop policy if exists "members read versions" on public.versions;
create policy "members read versions"
  on public.versions for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

-- Editors and up can save versions.
drop policy if exists "editors create versions" on public.versions;
create policy "editors create versions"
  on public.versions for insert
  to authenticated
  with check (public.workspace_role(workspace_id) in ('owner', 'admin', 'editor'));

-- Owners/admins can prune history.
drop policy if exists "admins delete versions" on public.versions;
create policy "admins delete versions"
  on public.versions for delete
  to authenticated
  using (public.workspace_role(workspace_id) in ('owner', 'admin'));
