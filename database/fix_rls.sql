-- ==============================================================================
-- FIX RLS INFINITE RECURSION
-- ==============================================================================
-- This script fixes the "infinite recursion detected" error by using a 
-- SECURITY DEFINER function to break the dependency cycle between 
-- 'groups' and 'group_members' policies.
-- ==============================================================================

-- 1. Create a helper function to get user's groups (Bypasses RLS)
create or replace function public.get_my_member_group_ids()
returns setof uuid
language sql
security definer
set search_path = public
stable
as $$
  select group_id from group_members where user_id = auth.uid();
$$;

-- 2. Drop existing problematic policies
drop policy if exists "Groups are viewable by members and owner." on groups;
drop policy if exists "Members can view other members in the same group." on group_members;

-- 3. Re-create 'groups' policy using the helper function
create policy "Groups are viewable by members and owner."
  on groups for select
  using ( 
    auth.uid() = owner_id 
    or 
    id in (select get_my_member_group_ids())
  );

-- 4. Re-create 'group_members' policy
create policy "Members can view other members in the same group."
  on group_members for select
  using (
    -- I can see members if I am a member of the group (using helper to be safe)
    group_id in (select get_my_member_group_ids())
    or
    -- I can see members if I own the group
    exists (
      select 1 from public.groups g
      where g.id = group_members.group_id
      and g.owner_id = auth.uid()
    )
  );

-- 5. Ensure other policies don't cause issues (Optional, but good practice)
-- "Admins can add members" checks groups.owner_id. 
-- Since groups policy now uses the function (which doesn't query groups), it's safe.
