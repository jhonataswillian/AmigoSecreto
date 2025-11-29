-- ==============================================================================
-- FIX GROUP VISIBILITY (FINAL)
-- ==============================================================================

-- 1. Drop existing policies to be clean
drop policy if exists "Users can view groups they belong to" on groups;
drop policy if exists "Users can view members of their groups" on group_members;

-- 2. Create simplified policies that avoid recursion but allow visibility
-- For groups: You can see if you are owner OR if you are in the members list.
-- We use a direct subquery to avoid using the recursive function if it was problematic,
-- BUT the function is actually the best way if it is security definer.
-- Let's stick to the function `public.is_member_of` but ensure it works.
-- If the function doesn't exist or is broken, we recreate it.

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

create policy "Users can view groups they belong to"
  on groups for select
  using (
    owner_id = auth.uid() 
    or 
    public.is_member_of(id)
  );

-- For members: You can see members if you are in the group.
-- We use the same function.
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

-- 3. Ensure Realtime is enabled for notifications
-- If this fails, it's already enabled.
do $$
begin
  if not exists (select 1 from pg_publication_tables where tablename = 'notifications' and pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table notifications;
  end if;
end
$$;
