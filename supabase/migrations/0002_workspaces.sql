-- DropCode — Phase 2: workspaces, members, RLS, helpers, max-4 enforcement.
-- Run in the Supabase SQL editor (after 0001_init.sql).

-- 1. Workspaces.
create table if not exists public.workspaces (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  owner_id     uuid not null references auth.users (id) on delete cascade,
  language     text not null default 'javascript',
  invite_token text not null unique default encode(gen_random_bytes(12), 'hex'),
  settings     jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

-- 2. Members (composite PK = one row per user per workspace).
create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id      uuid not null references auth.users (id) on delete cascade,
  role         text not null default 'editor'
                 check (role in ('owner', 'admin', 'editor', 'viewer')),
  joined_at    timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create index if not exists workspace_members_user_idx
  on public.workspace_members (user_id);

-- 3. Helper functions (security definer => avoid RLS recursion).
create or replace function public.is_workspace_member(p_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = p_workspace_id and user_id = auth.uid()
  );
$$;

create or replace function public.workspace_role(p_workspace_id uuid)
returns text
language sql
security definer
set search_path = ''
stable
as $$
  select role from public.workspace_members
  where workspace_id = p_workspace_id and user_id = auth.uid();
$$;

-- 4. Auto-add the creator as the owner-member.
create or replace function public.handle_new_workspace()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.workspace_members (workspace_id, user_id, role)
  values (new.id, new.owner_id, 'owner');
  return new;
end;
$$;

drop trigger if exists on_workspace_created on public.workspaces;
create trigger on_workspace_created
  after insert on public.workspaces
  for each row execute function public.handle_new_workspace();

-- 5. Enforce max 4 members per workspace.
create or replace function public.enforce_member_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.workspace_members
      where workspace_id = new.workspace_id) >= 4 then
    raise exception 'Workspace is full (maximum 4 members)';
  end if;
  return new;
end;
$$;

drop trigger if exists before_member_insert on public.workspace_members;
create trigger before_member_insert
  before insert on public.workspace_members
  for each row execute function public.enforce_member_limit();

-- 6. Row-Level Security.
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

-- workspaces --------------------------------------------------------------
drop policy if exists "members can view workspace" on public.workspaces;
create policy "members can view workspace"
  on public.workspaces for select
  to authenticated
  using (public.is_workspace_member(id));

drop policy if exists "users can create workspaces" on public.workspaces;
create policy "users can create workspaces"
  on public.workspaces for insert
  to authenticated
  with check (auth.uid() = owner_id);

drop policy if exists "owners/admins can update workspace" on public.workspaces;
create policy "owners/admins can update workspace"
  on public.workspaces for update
  to authenticated
  using (public.workspace_role(id) in ('owner', 'admin'));

drop policy if exists "owner can delete workspace" on public.workspaces;
create policy "owner can delete workspace"
  on public.workspaces for delete
  to authenticated
  using (auth.uid() = owner_id);

-- workspace_members -------------------------------------------------------
drop policy if exists "members can view co-members" on public.workspace_members;
create policy "members can view co-members"
  on public.workspace_members for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

drop policy if exists "owners/admins can add members" on public.workspace_members;
create policy "owners/admins can add members"
  on public.workspace_members for insert
  to authenticated
  with check (public.workspace_role(workspace_id) in ('owner', 'admin'));

drop policy if exists "owners/admins can update roles" on public.workspace_members;
create policy "owners/admins can update roles"
  on public.workspace_members for update
  to authenticated
  using (public.workspace_role(workspace_id) in ('owner', 'admin'));

drop policy if exists "remove member or leave" on public.workspace_members;
create policy "remove member or leave"
  on public.workspace_members for delete
  to authenticated
  using (
    public.workspace_role(workspace_id) in ('owner', 'admin')
    or user_id = auth.uid()
  );
