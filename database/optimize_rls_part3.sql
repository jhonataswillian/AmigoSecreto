-- OPTIMIZE RLS POLICIES PART 3 (Final Sweep)
-- This script addresses the remaining 13 warnings:
-- 1. RLS Performance (wrapping auth.uid in subquery)
-- 2. Multiple Permissive Policies (Consolidating INSERT rules for group_members)
-- 3. Duplicate Index (Removing redundant index on group_invites)

-- === 1. RLS PERFORMANCE OPTIMIZATIONS ===

-- Groups: "Users can create groups"
drop policy if exists "Users can create groups" on public.groups;
create policy "Users can create groups"
on public.groups for insert
with check ( owner_id = (select auth.uid()) );

-- Groups: "Owners can delete groups"
drop policy if exists "Owners can delete groups" on public.groups;
create policy "Owners can delete groups"
on public.groups for delete
using ( owner_id = (select auth.uid()) );

-- Groups: "Owners can update groups"
drop policy if exists "Owners can update groups" on public.groups;
create policy "Owners can update groups"
on public.groups for update
using ( owner_id = (select auth.uid()) );

-- Group Members: "Owners and members can remove members"
drop policy if exists "Owners and members can remove members" on public.group_members;
create policy "Owners and members can remove members"
on public.group_members for delete
using (
  (user_id = (select auth.uid())) 
  OR 
  exists (
    select 1 from public.groups 
    where id = group_members.group_id 
    and owner_id = (select auth.uid())
  )
);

-- Group Members: "Owners can update members"
drop policy if exists "Owners can update members" on public.group_members;
create policy "Owners can update members"
on public.group_members for update
using (
  exists (
    select 1 from public.groups 
    where id = group_members.group_id 
    and owner_id = (select auth.uid())
  )
);

-- Group Invites: "Group members can create invites"
drop policy if exists "Group members can create invites" on public.group_invites;
create policy "Group members can create invites"
on public.group_invites for insert
with check (
  exists (
    select 1 from public.group_members 
    where group_id = group_invites.group_id 
    and user_id = (select auth.uid())
  )
);

-- Wishlist Items: "Users can insert own wishlist items"
drop policy if exists "Users can insert own wishlist items" on public.wishlist_items;
create policy "Users can insert own wishlist items"
on public.wishlist_items for insert
with check ( user_id = (select auth.uid()) );

-- Wishlist Items: "Users can update own wishlist items"
drop policy if exists "Users can update own wishlist items" on public.wishlist_items;
create policy "Users can update own wishlist items"
on public.wishlist_items for update
using ( user_id = (select auth.uid()) );


-- === 2. MULTIPLE PERMISSIVE POLICIES (Consolidation) ===

-- Problem: "Owners can add members" AND "Users can join groups (insert self)" are separate.
-- Solution: Combine them into one policy "Manage group members (join or add)".

drop policy if exists "Owners can add members" on public.group_members;
drop policy if exists "Users can join groups (insert self)" on public.group_members;

create policy "Manage group members (join or add)"
on public.group_members for insert
with check (
  -- Allow if user is adding themselves
  (user_id = (select auth.uid()))
  OR
  -- Allow if user is the owner of the group
  exists (
    select 1 from public.groups 
    where id = group_id 
    and owner_id = (select auth.uid())
  )
);


-- === 3. DUPLICATE INDEX ===

-- Problem: group_invites_group_id_idx and idx_group_invites_group_id are identical.
-- Solution: Keep our custom one (idx_...) and drop the auto-generated one.

drop index if exists group_invites_group_id_idx;
