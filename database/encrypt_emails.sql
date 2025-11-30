-- ==============================================================================
-- 🛡️ DATABASE ENCRYPTION MIGRATION
-- ==============================================================================
-- This script encrypts the 'email' column in 'public.profiles' using AES-256.
--
-- ⚠️ INSTRUCTIONS:
-- 1. Replace 'YOUR_SUPER_SECRET_KEY_HERE' with a long, random password.
--    Use a password manager to generate it (e.g., 32+ characters).
-- 2. Run this entire script in the Supabase SQL Editor.
-- 3. SAVE YOUR KEY! You will need it if you ever want to decrypt the data.
-- ==============================================================================

-- 1. Enable pgcrypto extension (if not already enabled)
create extension if not exists "pgcrypto";

-- 2. Add the new encrypted column (bytea type for binary data)
alter table public.profiles add column email_encrypted bytea;

-- 3. Migrate existing data: Encrypt plain text emails
-- ⚠️ REPLACE THE KEY BELOW!
update public.profiles
set email_encrypted = pgp_sym_encrypt(email, 'YOUR_SUPER_SECRET_KEY_HERE');

-- 4. Enforce NOT NULL on the new column (after migration)
alter table public.profiles alter column email_encrypted set not null;

-- 5. Drop the plain text email column (The Point of No Return!)
alter table public.profiles drop column email;

-- 6. Update the Trigger to automatically encrypt new user emails
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, handle, avatar, email_encrypted)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'handle',
    new.raw_user_meta_data->>'avatar',
    -- ⚠️ REPLACE THE KEY BELOW WITH THE SAME KEY AS ABOVE!
    pgp_sym_encrypt(new.email, 'YOUR_SUPER_SECRET_KEY_HERE')
  );
  return new;
end;
$$ language plpgsql security definer;

-- ==============================================================================
-- ✅ MIGRATION COMPLETE
-- The 'email' column is gone from public view.
-- Only 'email_encrypted' remains, readable only with the key.
-- ==============================================================================
