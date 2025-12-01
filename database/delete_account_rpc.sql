-- ==============================================================================
-- 🗑️ DELETE ACCOUNT RPC
-- ==============================================================================
-- Allows a logged-in user to delete their own account from auth.users.
-- This is required because the Client SDK cannot delete users directly.

create or replace function public.delete_own_user()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
begin
  -- Get the ID of the currently logged-in user
  current_user_id := auth.uid();

  -- Safety check: Ensure there is a user logged in
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Delete the user from auth.users
  -- ⚠️ This will CASCADE to public.profiles, public.groups, etc.
  -- IF the Foreign Keys were created with ON DELETE CASCADE.
  delete from auth.users
  where id = current_user_id;
end;
$$;

-- Grant permission to authenticated users to call this function
grant execute on function public.delete_own_user() to authenticated;
