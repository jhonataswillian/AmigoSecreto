-- ==============================================================================
-- FIX GROUP VISIBILITY & MEMBER COUNT
-- ==============================================================================

-- 1. Fix Groups Visibility
-- Allow users to view groups if they are the owner OR a member.
drop policy if exists "Users can view groups they belong to" on groups;
create policy "Users can view groups they belong to"
  on groups for select
  using (
    auth.uid() = owner_id 
    or 
    exists (
      select 1 from group_members 
      where group_id = groups.id 
      and user_id = auth.uid()
    )
  );

-- 2. Fix Member Visibility (for counting)
-- Allow users to view ALL members of a group if they are a member of that group.
drop policy if exists "Users can view members of their groups" on group_members;
create policy "Users can view members of their groups"
  on group_members for select
  using (
    exists (
      select 1 from group_members as my_membership
      where my_membership.group_id = group_members.group_id
      and my_membership.user_id = auth.uid()
    )
    or
    exists (
      select 1 from groups
      where id = group_members.group_id
      and owner_id = auth.uid()
    )
  );

-- 3. Ensure Realtime for notifications (just in case)
-- alter publication supabase_realtime add table notifications;
