-- DROP STRESS TEST FUNCTIONS (Fix Security Warnings)
-- These functions are causing security warnings and are no longer needed.
-- We use a dynamic DO block to drop them regardless of their arguments (signature).

do $$
declare
    r record;
begin
    -- Loop through all functions named 'setup_stress_test' or 'cleanup_stress_test' in public schema
    for r in select oid::regprocedure as func_signature
             from pg_proc
             where proname in ('setup_stress_test', 'cleanup_stress_test')
             and pronamespace = 'public'::regnamespace
    loop
        -- Drop the function dynamically
        execute 'drop function ' || r.func_signature;
    end loop;
end $$;
