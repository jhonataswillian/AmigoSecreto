-- FIX SECURITY WARNINGS (Function Search Path Mutable)
-- Explicitly set search_path to 'public' to prevent search path hijacking.

-- 1. check_terms_acceptance
alter function public.check_terms_acceptance() set search_path = public;

-- 2. clear_group_draws
alter function public.clear_group_draws(uuid) set search_path = public;
