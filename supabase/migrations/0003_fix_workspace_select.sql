-- DropCode — Phase 2 fix: allow owners to SELECT their workspace directly.
-- Without this, `insert(...).select()` can return zero rows because the
-- owner's membership row is only added by the AFTER INSERT trigger, so the
-- RETURNING projection gets filtered out by RLS.

drop policy if exists "members can view workspace" on public.workspaces;
create policy "members can view workspace"
  on public.workspaces for select
  to authenticated
  using (
    owner_id = auth.uid()
    or public.is_workspace_member(id)
  );
