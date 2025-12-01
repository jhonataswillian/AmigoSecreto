-- ==============================================================================
-- 🚑 EMERGENCY FIX FOR REGISTRATION
-- ==============================================================================

-- 1. Relax constraints: Allow 'email_encrypted' to be NULL
-- This prevents the "Database error" if encryption fails.
alter table public.profiles alter column email_encrypted drop not null;

-- 2. Ensure pgcrypto is enabled
create extension if not exists "pgcrypto";

-- 3. Recreate the trigger with Error Handling (Try/Catch)
create or replace function public.handle_new_user()
returns trigger 
security definer
set search_path = public, extensions
as $$
declare
  encrypted_email bytea;
begin
  -- 🛡️ Try to encrypt
  begin
    encrypted_email := public.pgp_sym_encrypt(new.email, 'YOUR_SUPER_SECRET_KEY_HERE');
  exception when others then
    -- ⚠️ If encryption fails, Log it and continue with NULL
    raise warning 'Encryption failed for user %: %', new.id, SQLERRM;
    encrypted_email := null;
  end;

  -- Insert into profiles
  insert into public.profiles (id, name, handle, avatar, email_encrypted)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'handle',
    new.raw_user_meta_data->>'avatar',
    encrypted_email
  );

  return new;
end;
$$ language plpgsql;

-- 4. Re-attach trigger (just to be safe)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Verify Permissions
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on table public.profiles to postgres, service_role;
grant select, update on table public.profiles to authenticated;
