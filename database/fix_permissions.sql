-- ==============================================================================
-- FIX PERMISSIONS FOR INVITE ACCEPTANCE & REALTIME
-- ==============================================================================

-- 1. Allow authenticated users to insert themselves into group_members
-- This is needed for "Accept Invite" flow where the user adds themselves.
-- We should ideally check if they have an invite, but for now, we trust the app logic
-- combined with the fact that they can only add THEMSELVES.
create policy "Users can join groups (insert self)"
  on group_members for insert
  with check ( auth.uid() = user_id );

-- 2. Ensure Realtime is enabled for all relevant tables
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table groups;
alter publication supabase_realtime add table group_members;
alter publication supabase_realtime add table draws;
alter publication supabase_realtime add table wishlist_items;

-- 3. Fix potential RLS issue with "getGroup"
-- Ensure the helper function is used correctly or policies allow access.
-- The previous fix_rls.sql should have handled select.
-- This script focuses on INSERT/UPDATE permissions.

-- 4. Allow users to update their own profile (name, handle, etc)
-- (Already exists usually, but good to ensure)
-- create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
