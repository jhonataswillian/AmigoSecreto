-- ==============================================================================
-- FINAL FIX FOR INVITE ACCEPTANCE
-- ==============================================================================
-- Since Realtime is already enabled, we ONLY need to fix the permission.

-- 1. Drop the policy if it exists to avoid duplication error
drop policy if exists "Users can join groups (insert self)" on group_members;

-- 2. Create the policy to allow users to add themselves to groups
create policy "Users can join groups (insert self)"
  on group_members for insert
  with check ( auth.uid() = user_id );

-- Done! No need to run 'alter publication' lines since they are already active.
