-- ==============================================================================
-- FIX INVITE ACCEPTANCE POLICY (Clean Version)
-- ==============================================================================

-- 1. Drop the policy if it exists to avoid errors
drop policy if exists "Users can join groups (insert self)" on group_members;

-- 2. Create the policy to allow users to add themselves to groups
-- This fixes the "Erro ao aceitar convite"
create policy "Users can join groups (insert self)"
  on group_members for insert
  with check ( auth.uid() = user_id );

-- 3. Enable Realtime for other tables (ignoring notifications which is already there)
-- If any of these fail, it means it's already added. You can ignore the error.
alter publication supabase_realtime add table groups;
alter publication supabase_realtime add table group_members;
alter publication supabase_realtime add table draws;
alter publication supabase_realtime add table wishlist_items;
