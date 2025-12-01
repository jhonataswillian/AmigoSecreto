-- ==============================================================================
-- FIX REGISTRATION TRIGGER (Dynamic Repair)
-- ==============================================================================

-- 1. Ensure pgcrypto is enabled (needed for encryption if used)
create extension if not exists "pgcrypto";

-- 2. Dynamic Block to detect schema and apply correct function
do $$
begin
  -- Check if 'email_encrypted' column exists
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'profiles' and column_name = 'email_encrypted') then
    
    -- CASE 1: ENCRYPTED SCHEMA DETECTED
    -- Recreate function to use email_encrypted
    create or replace function public.handle_new_user()
    returns trigger as $func$
    begin
      insert into public.profiles (id, name, handle, avatar, email_encrypted)
      values (
        new.id,
        new.raw_user_meta_data->>'name',
        new.raw_user_meta_data->>'handle',
        new.raw_user_meta_data->>'avatar',
        -- Using a default key. If you changed this in encrypt_emails.sql, please update it here too.
        -- Ideally, we should use a Vault or Env Var, but for this setup:
        pgp_sym_encrypt(new.email, 'YOUR_SUPER_SECRET_KEY_HERE')
      );
      return new;
    end;
    $func$ language plpgsql security definer;

  else
    
    -- CASE 2: PLAIN TEXT SCHEMA DETECTED (Fallback)
    -- Recreate function to use plain email
    create or replace function public.handle_new_user()
    returns trigger as $func$
    begin
      insert into public.profiles (id, email, name, handle, avatar)
      values (
        new.id,
        new.email,
        new.raw_user_meta_data->>'name',
        new.raw_user_meta_data->>'handle',
        new.raw_user_meta_data->>'avatar'
      );
      return new;
    end;
    $func$ language plpgsql security definer;

  end if;
end $$;

-- 3. Ensure Trigger is Linked
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
