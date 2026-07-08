-- DropCode — Phase 3: invite preview, join-by-token, and token reset.
-- Security-definer so a user who is NOT yet a member can preview/join a
-- workspace by its invite token (RLS would otherwise hide it).

-- Preview a workspace from an invite token (used by the /join page).
create or replace function public.get_workspace_preview(p_token text)
returns table (id uuid, name text, language text, member_count bigint)
language sql
security definer
set search_path = ''
stable
as $$
  select w.id, w.name, w.language,
         (select count(*) from public.workspace_members m where m.workspace_id = w.id)
  from public.workspaces w
  where w.invite_token = p_token;
$$;

-- Join a workspace by token as the current user (default role: editor).
create or replace function public.join_workspace(p_token text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_workspace_id uuid;
  v_count int;
begin
  select id into v_workspace_id
  from public.workspaces where invite_token = p_token;

  if v_workspace_id is null then
    raise exception 'This invite link is invalid.';
  end if;

  -- Already a member => idempotent success.
  if exists (
    select 1 from public.workspace_members
    where workspace_id = v_workspace_id and user_id = auth.uid()
  ) then
    return v_workspace_id;
  end if;

  select count(*) into v_count
  from public.workspace_members where workspace_id = v_workspace_id;
  if v_count >= 4 then
    raise exception 'This workspace is full (maximum 4 members).';
  end if;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (v_workspace_id, auth.uid(), 'editor');

  return v_workspace_id;
end;
$$;

-- Rotate the invite token (owners/admins only) to revoke old links.
create or replace function public.reset_invite_token(p_workspace_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_token text;
begin
  if public.workspace_role(p_workspace_id) not in ('owner', 'admin') then
    raise exception 'Not authorized.';
  end if;

  -- gen_random_uuid() is core (resolvable under empty search_path); avoid
  -- gen_random_bytes() which lives in the extensions schema.
  v_token := replace(gen_random_uuid()::text, '-', '')
             || replace(gen_random_uuid()::text, '-', '');
  update public.workspaces set invite_token = v_token where id = p_workspace_id;
  return v_token;
end;
$$;
