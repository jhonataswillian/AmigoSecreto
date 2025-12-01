-- ==============================================================================
-- 🚨 FINAL FIX FOR REGISTRATION ERROR
-- ==============================================================================

-- 1. Force enable pgcrypto in public schema (or verify it exists)
create extension if not exists "pgcrypto" schema public;

-- 2. Drop existing trigger and function to ensure clean slate
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 3. Create the function with explicit search path and robust logic
create or replace function public.handle_new_user()
returns trigger 
security definer
set search_path = public, extensions -- Ensure we can find pgcrypto functions
as $$
declare
  encrypted_email bytea;
begin
  -- Try to encrypt the email if pgcrypto is available
  begin
    encrypted_email := public.pgp_sym_encrypt(new.email, 'YOUR_SUPER_SECRET_KEY_HERE');
  exception when others then
    -- Fallback if encryption fails (should not happen if extension is enabled)
    encrypted_email := null; 
  end;

  -- Check if we should insert into 'email_encrypted' or 'email'
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'profiles' and column_name = 'email_encrypted') then
    
    insert into public.profiles (id, name, handle, avatar, email_encrypted)
    values (
      new.id,
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'handle',
      new.raw_user_meta_data->>'avatar',
      encrypted_email
    );

  else
    -- Fallback for legacy schema (plain text email)
    insert into public.profiles (id, email, name, handle, avatar)
    values (
      new.id,
      new.email,
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'handle',
      new.raw_user_meta_data->>'avatar'
    );
  end if;

  return new;
end;
$$ language plpgsql;

-- 4. Re-attach the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Grant permissions (Crucial!)
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on table public.profiles to postgres, service_role;
-- Allow authenticated users to read/update their own profile (handled by RLS, but basic grant needed)
grant select, update on table public.profiles to authenticated;
