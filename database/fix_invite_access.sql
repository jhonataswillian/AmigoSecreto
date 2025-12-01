-- ==============================================================================
-- FIX INVITE INFO ACCESS (RPC Function)
-- ==============================================================================
-- Problem: RLS on 'groups' table prevents non-members (including unauthenticated users)
-- from reading the group name when opening an invite link.
--
-- Solution: A SECURITY DEFINER function that fetches ONLY the necessary info
-- (Group Name, Owner Name, Owner Handle) given a valid invite code.

create or replace function public.get_invite_details(invite_code text)
returns table (
  group_id uuid,
  group_name text,
  owner_name text,
  owner_handle text
)
language plpgsql
security definer -- Runs with privileges of the creator (postgres/admin)
set search_path = public
as $$
begin
  return query
  select 
    g.id as group_id,
    g.name as group_name,
    p.name as owner_name,
    p.handle as owner_handle
  from group_invites gi
  join groups g on g.id = gi.group_id
  join profiles p on p.id = g.owner_id
  where gi.code = invite_code;
end;
$$;

-- Grant execute permission to everyone (anon and authenticated)
grant execute on function public.get_invite_details(text) to anon, authenticated;
