-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. CREATE TABLES (Structure First)
-- ==========================================

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  name text not null,
  handle text unique not null,
  avatar text,
  frame jsonb,
  name_changed_at timestamptz,
  handle_changed_at timestamptz,
  created_at timestamptz default now() not null
);

-- GROUPS
create table public.groups (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  event_date timestamptz,
  max_price numeric(10,2),
  owner_id uuid references public.profiles(id) not null,
  status text default 'created' check (status in ('created', 'drawn')),
  created_at timestamptz default now() not null
);

-- GROUP MEMBERS
create table public.group_members (
  id uuid default uuid_generate_v4() primary key,
  group_id uuid references public.groups(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  is_admin boolean default false,
  joined_at timestamptz default now() not null,
  unique(group_id, user_id)
);

-- DRAWS
create table public.draws (
  id uuid default uuid_generate_v4() primary key,
  group_id uuid references public.groups(id) on delete cascade not null,
  giver_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(group_id, giver_id)
);

-- WISHLIST ITEMS
create table public.wishlist_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric(10,2),
  link text,
  created_at timestamptz default now() not null
);

-- ==========================================
-- 2. ENABLE RLS
-- ==========================================

alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.draws enable row level security;
alter table public.wishlist_items enable row level security;

-- ==========================================
-- 3. CREATE POLICIES (Now safe as tables exist)
-- ==========================================

-- PROFILES POLICIES
create policy "Public profiles are viewable by everyone."
  on profiles for select using ( true );

create policy "Users can insert their own profile."
  on profiles for insert with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update using ( auth.uid() = id );

-- GROUPS POLICIES
create policy "Groups are viewable by members and owner."
  on groups for select
  using ( 
    auth.uid() = owner_id 
    or 
    exists (
      select 1 from public.group_members 
      where group_id = groups.id and user_id = auth.uid()
    )
  );

create policy "Users can create groups."
  on groups for insert with check ( auth.uid() = owner_id );

create policy "Owners can update their groups."
  on groups for update using ( auth.uid() = owner_id );

create policy "Owners can delete their groups."
  on groups for delete using ( auth.uid() = owner_id );

-- GROUP MEMBERS POLICIES
create policy "Members can view other members in the same group."
  on group_members for select
  using (
    exists (
      select 1 from public.group_members gm
      where gm.group_id = group_members.group_id
      and gm.user_id = auth.uid()
    )
    or
    exists (
      select 1 from public.groups g
      where g.id = group_members.group_id
      and g.owner_id = auth.uid()
    )
  );

create policy "Admins can add members."
  on group_members for insert
  with check (
    exists (
      select 1 from public.groups g
      where g.id = group_members.group_id
      and g.owner_id = auth.uid()
    )
  );

create policy "Admins can remove members."
  on group_members for delete
  using (
    exists (
      select 1 from public.groups g
      where g.id = group_members.group_id
      and g.owner_id = auth.uid()
    )
    or 
    user_id = auth.uid() -- Users can leave
  );

-- DRAWS POLICIES
create policy "User can see who they drew."
  on draws for select using ( auth.uid() = giver_id );

create policy "Group owner can create draws."
  on draws for insert
  with check (
    exists (
      select 1 from public.groups g
      where g.id = draws.group_id
      and g.owner_id = auth.uid()
    )
  );
  
create policy "Group owner can delete draws."
  on draws for delete
  using (
    exists (
      select 1 from public.groups g
      where g.id = draws.group_id
      and g.owner_id = auth.uid()
    )
  );

-- WISHLIST ITEMS POLICIES
create policy "Wishlists are viewable by everyone."
  on wishlist_items for select using ( true );

create policy "Users can manage their own wishlist."
  on wishlist_items for all using ( auth.uid() = user_id );

-- ==========================================
-- 4. FUNCTIONS & TRIGGERS
-- ==========================================

create or replace function public.handle_new_user()
returns trigger as $$
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
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
