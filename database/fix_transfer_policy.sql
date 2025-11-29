-- ==============================================================================
-- FIX TRANSFER OWNERSHIP RLS
-- ==============================================================================

-- The previous policy "Owners can update groups" implicitly enforced that
-- the user must REMAIN the owner after the update (USING clause applied as WITH CHECK).
-- We need to explicitly allow the owner to change the owner_id to someone else.

drop policy if exists "Owners can update groups" on groups;

create policy "Owners can update groups"
  on groups for update
  using (auth.uid() = owner_id)
  with check (true); -- Allow owner to update to ANY new state (including changing owner_id)
