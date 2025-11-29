-- ==============================================================================
-- FIX GROUP ACCESS & RLS (COMPREHENSIVE)
-- ==============================================================================

-- 1. Drop ALL existing policies for groups and group_members to avoid conflicts
drop policy if exists "Users can view groups they belong to" on groups;
drop policy if exists "Users can view members of their groups" on group_members;
drop policy if exists "Enable read access for all users" on groups;
drop policy if exists "Enable read access for all users" on group_members;
drop policy if exists "Users can create groups" on groups;
drop policy if exists "Owners can update groups" on groups;
drop policy if exists "Owners can delete groups" on groups;
drop policy if exists "Owners can add members" on group_members;
drop policy if exists "Owners can remove members" on group_members;

-- 2. Recreate the helper function to ensure it exists and is correct
create or replace function public.is_member_of(_group_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from group_members
    where group_id = _group_id
    and user_id = auth.uid()
  );
end;
$$;

-- Grant permission to use the function
grant execute on function public.is_member_of to authenticated, anon;

-- 3. Create SELECT Policies (Visibility)

-- Groups: Visible if Owner OR Member
create policy "Users can view groups they belong to"
  on groups for select
  using (
    owner_id = auth.uid() 
    or 
    public.is_member_of(id)
  );

-- Group Members: Visible if you are in the group OR you are the owner of the group
create policy "Users can view members of their groups"
  on group_members for select
  using (
    public.is_member_of(group_id)
    or
    exists (
      select 1 from groups
      where id = group_members.group_id
      and owner_id = auth.uid()
    )
  );

-- 4. Create INSERT/UPDATE/DELETE Policies (Management)

-- Groups: Create
create policy "Users can create groups"
  on groups for insert
  with check (auth.uid() = owner_id);

-- Groups: Update (Owner only)
create policy "Owners can update groups"
  on groups for update
  using (auth.uid() = owner_id);

-- Groups: Delete (Owner only)
create policy "Owners can delete groups"
  on groups for delete
  using (auth.uid() = owner_id);

-- Group Members: Insert (Owner can add members, User can join if we had open invites)
-- For now, allowing Owner to add anyone, and User to add themselves (if logic permits)
create policy "Owners can add members"
  on group_members for insert
  with check (
    exists (
      select 1 from groups
      where id = group_members.group_id
      and owner_id = auth.uid()
    )
    or
    user_id = auth.uid()
  );

-- Group Members: Delete (Owner can remove anyone, User can remove themselves)
create policy "Owners and members can remove members"
  on group_members for delete
  using (
    exists (
      select 1 from groups
      where id = group_members.group_id
      and owner_id = auth.uid()
    )
    or
    user_id = auth.uid()
  );

-- Group Members: Update (Owner only - e.g. for admin status)
create policy "Owners can update members"
  on group_members for update
  using (
    exists (
      select 1 from groups
      where id = group_members.group_id
      and owner_id = auth.uid()
    )
  );

-- 5. Ensure RLS is enabled
alter table groups enable row level security;
alter table group_members enable row level security;
