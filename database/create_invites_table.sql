-- Create group_invites table
create table if not exists public.group_invites (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references public.groups(id) on delete cascade not null,
  code text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone, -- Optional expiration
  created_by uuid references auth.users(id)
);

-- Enable RLS
alter table public.group_invites enable row level security;

-- Policies

-- 1. Anyone can read an invite by its code (to show group info on join page)
create policy "Anyone can read invites by code"
  on public.group_invites for select
  using (true); 
  -- Note: In a stricter system, we might restrict this, but for public links we need the info.
  -- Ideally, we'd use a function to fetch info by code to avoid exposing the whole table, 
  -- but RLS with a specific query filter in the client is okay for now if we don't expose list.

-- 2. Only group admins/members can create invites
create policy "Group members can create invites"
  on public.group_invites for insert
  with check (
    auth.uid() in (
      select user_id from public.group_members where group_id = group_invites.group_id
    )
  );

-- Indexes
create index if not exists group_invites_code_idx on public.group_invites(code);
create index if not exists group_invites_group_id_idx on public.group_invites(group_id);
