-- OPTIMIZE RLS POLICIES PART 2 (Fix Remaining Performance Warnings)
-- This script updates the remaining RLS policies to use (select auth.uid())
-- to prevent re-evaluation for every row (STABLE behavior).

-- 1. Optimize profiles: "Users can update own profile."
drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile."
on public.profiles for update
using ( id = (select auth.uid()) );

-- 2. Optimize draws: "Group owner can create draws."
drop policy if exists "Group owner can create draws." on public.draws;
create policy "Group owner can create draws."
on public.draws for insert
with check (
  exists (
    select 1 from public.groups
    where id = group_id
    and owner_id = (select auth.uid())
  )
);

-- 3. Optimize notifications: "Users can update their own notifications."
drop policy if exists "Users can update their own notifications." on public.notifications;
create policy "Users can update their own notifications."
on public.notifications for update
using ( user_id = (select auth.uid()) );

-- 4. Optimize notifications: "Users can delete their own notifications."
drop policy if exists "Users can delete their own notifications." on public.notifications;
create policy "Users can delete their own notifications."
on public.notifications for delete
using ( user_id = (select auth.uid()) );

-- 5. Optimize notifications: "Users can insert notifications."
drop policy if exists "Users can insert notifications." on public.notifications;
create policy "Users can insert notifications."
on public.notifications for insert
with check ( user_id = (select auth.uid()) );
