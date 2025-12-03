-- FIX SECURITY WARNINGS (Function Search Path Mutable)
-- Explicitly set search_path to 'public' to prevent search path hijacking.

-- 1. check_terms_acceptance
alter function public.check_terms_acceptance() set search_path = public;

-- 2. clear_group_draws
alter function public.clear_group_draws(uuid) set search_path = public;

-- 3. setup_stress_test (If it exists in DB)
-- Note: If this function was deleted, this command might fail. 
-- We wrap it in a DO block to ignore errors if it doesn't exist.
do $$
begin
  if exists (select 1 from pg_proc where proname = 'setup_stress_test') then
    alter function public.setup_stress_test() set search_path = public;
  end if;
end $$;

-- 4. cleanup_stress_test (If it exists in DB)
do $$
begin
  if exists (select 1 from pg_proc where proname = 'cleanup_stress_test') then
    alter function public.cleanup_stress_test() set search_path = public;
  end if;
end $$;
