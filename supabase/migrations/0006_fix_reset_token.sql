-- DropCode — fix: reset_invite_token used gen_random_bytes(), which lives in
-- the `extensions` schema and is NOT resolvable under the function's
-- `search_path = ''`. Use gen_random_uuid() (core, always resolvable) instead.

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

  v_token := replace(gen_random_uuid()::text, '-', '')
             || replace(gen_random_uuid()::text, '-', '');
  update public.workspaces set invite_token = v_token where id = p_workspace_id;
  return v_token;
end;
$$;
