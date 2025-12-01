-- Function to check if terms are accepted in user metadata
create or replace function public.check_terms_acceptance()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Check if raw_user_meta_data contains terms_accepted: true
  if (new.raw_user_meta_data->>'terms_accepted')::boolean is not true then
    raise exception 'Você deve aceitar os Termos de Uso para criar uma conta.';
  end if;
  return new;
end;
$$;

-- Drop trigger if exists to allow idempotency
drop trigger if exists on_auth_user_created_check_terms on auth.users;

-- Create trigger to run BEFORE insert
-- We use BEFORE to prevent the user from being created at all if terms are not accepted
create trigger on_auth_user_created_check_terms
before insert on auth.users
for each row
execute function public.check_terms_acceptance();
