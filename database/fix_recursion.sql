-- ==============================================================================
-- FIX INFINITE RECURSION IN RLS
-- ==============================================================================

-- 1. Create a Helper Function (Security Definer)
-- This function runs with the privileges of the creator (postgres/admin),
-- bypassing RLS on the tables it queries. This breaks the recursive loop.
create or replace function public.is_member_of(_group_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public -- Secure search path
as $$
begin
  return exists (
    select 1 from group_members
    where group_id = _group_id
    and user_id = auth.uid()
  );
end;
$$;

-- 2. Update Groups Policy
-- Use the function instead of direct table query
drop policy if exists "Users can view groups they belong to" on groups;
create policy "Users can view groups they belong to"
  on groups for select
  using (
    auth.uid() = owner_id 
    or 
    public.is_member_of(id)
  );

-- 3. Update Group Members Policy
-- Use the function instead of direct table query
drop policy if exists "Users can view members of their groups" on group_members;
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
