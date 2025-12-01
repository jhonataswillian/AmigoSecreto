-- FIX REDRAW BUG (Duplicate Key Error)
-- The RLS policy prevents the owner from deleting draws they can't see (because we removed God Mode).
-- This RPC function runs with elevated privileges (SECURITY DEFINER) to allow the deletion,
-- but explicitly checks if the user is the group owner first.

create or replace function public.clear_group_draws(p_group_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  -- 1. Security Check: Ensure the caller is the Group Owner
  if not exists (
    select 1 from public.groups
    where id = p_group_id
    and owner_id = auth.uid()
  ) then
    raise exception 'Acesso negado. Apenas o dono do grupo pode reiniciar o sorteio.';
  end if;

  -- 2. Delete all draws for this group
  delete from public.draws where group_id = p_group_id;
end;
$$;
