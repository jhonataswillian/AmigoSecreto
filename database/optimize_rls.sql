-- OPTIMIZE RLS POLICIES (Fix Performance Warnings)
-- This script updates RLS policies to use (select auth.uid()) instead of auth.uid()
-- to prevent re-evaluation for every row (STABLE behavior).
-- It also removes duplicate policies.

-- 1. Optimize profiles: "Users can insert their own profile."
drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile."
on public.profiles for insert
with check ( id = (select auth.uid()) );

-- 2. Optimize wishlist_items: "Users can delete own wishlist items"
drop policy if exists "Users can delete own wishlist items" on public.wishlist_items;
create policy "Users can delete own wishlist items"
on public.wishlist_items for delete
using ( user_id = (select auth.uid()) );

-- 3. Optimize draws: "User can see who they drew."
drop policy if exists "User can see who they drew." on public.draws;
create policy "User can see who they drew."
on public.draws for select
using ( giver_id = (select auth.uid()) );

-- 4. Optimize notifications: "Users can view their own notifications."
drop policy if exists "Users can view their own notifications." on public.notifications;
create policy "Users can view their own notifications."
on public.notifications for select
using ( user_id = (select auth.uid()) );

-- 5. Optimize groups: "Users can view groups they belong to"
drop policy if exists "Users can view groups they belong to" on public.groups;
create policy "Users can view groups they belong to"
on public.groups for select
using (
  exists (
    select 1 from public.group_members
    where group_id = groups.id
    and user_id = (select auth.uid())
  )
);

-- 6. Optimize group_members: "Users can view members of their groups"
drop policy if exists "Users can view members of their groups" on public.group_members;
create policy "Users can view members of their groups"
on public.group_members for select
using (
  exists (
    select 1 from public.group_members as gm
    where gm.group_id = group_members.group_id
    and gm.user_id = (select auth.uid())
  )
);

-- 7. Fix Duplicate Draws Delete Policy (Warning 8)
-- Remove the duplicate with the dot
drop policy if exists "Group owner can delete draws." on public.draws;

-- Optimize the correct one: "Group owner can delete draws"
drop policy if exists "Group owner can delete draws" on public.draws;
create policy "Group owner can delete draws"
on public.draws for delete
using (
  exists (
    select 1 from public.groups
    where id = draws.group_id
    and owner_id = (select auth.uid())
  )
);

-- 8. Optimize group_members INSERT policies (Warning 7)
-- "Owners can add members"
drop policy if exists "Owners can add members" on public.group_members;
create policy "Owners can add members"
on public.group_members for insert
with check (
  exists (
    select 1 from public.groups
    where id = group_id
    and owner_id = (select auth.uid())
  )
);

-- "Users can join groups (insert self)"
drop policy if exists "Users can join groups (insert self)" on public.group_members;
create policy "Users can join groups (insert self)"
on public.group_members for insert
with check ( user_id = (select auth.uid()) );

-- 9. Create Indexes for Foreign Keys (Info Suggestions)
-- Improves performance of joins and RLS checks
create index if not exists idx_draws_group_id on public.draws(group_id);
create index if not exists idx_draws_giver_id on public.draws(giver_id);
create index if not exists idx_draws_receiver_id on public.draws(receiver_id);

create index if not exists idx_group_invites_group_id on public.group_invites(group_id);

create index if not exists idx_group_members_group_id on public.group_members(group_id);
create index if not exists idx_group_members_user_id on public.group_members(user_id);

create index if not exists idx_groups_owner_id on public.groups(owner_id);

create index if not exists idx_notifications_user_id on public.notifications(user_id);

create index if not exists idx_wishlist_items_user_id on public.wishlist_items(user_id);
