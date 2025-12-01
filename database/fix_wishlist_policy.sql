-- ==============================================================================
-- FIX WISHLIST POLICIES (RLS)
-- ==============================================================================

-- 1. Drop ALL existing policies for wishlist_items to avoid conflicts
drop policy if exists "Wishlists are viewable by everyone." on wishlist_items;
drop policy if exists "Users can manage their own wishlist." on wishlist_items;
drop policy if exists "Users can view their own wishlist items" on wishlist_items;
drop policy if exists "Users can update their own wishlist items" on wishlist_items;
drop policy if exists "Users can delete their own wishlist items" on wishlist_items;
drop policy if exists "Users can insert their own wishlist items" on wishlist_items;
drop policy if exists "Public read access for wishlist" on wishlist_items;
drop policy if exists "Users can insert own wishlist items" on wishlist_items;
drop policy if exists "Users can update own wishlist items" on wishlist_items;
drop policy if exists "Users can delete own wishlist items" on wishlist_items;

-- 2. Enable RLS (Ensure it's on)
alter table wishlist_items enable row level security;

-- 3. Create Granular Policies

-- SELECT: Everyone can see (needed for Secret Santa to work)
create policy "Public read access for wishlist"
  on wishlist_items for select
  using ( true );

-- INSERT: Users can insert their own items
create policy "Users can insert own wishlist items"
  on wishlist_items for insert
  with check ( auth.uid() = user_id );

-- UPDATE: Users can update their own items
create policy "Users can update own wishlist items"
  on wishlist_items for update
  using ( auth.uid() = user_id );

-- DELETE: Users can delete their own items
create policy "Users can delete own wishlist items"
  on wishlist_items for delete
  using ( auth.uid() = user_id );
