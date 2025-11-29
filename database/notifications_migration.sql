-- ==============================================================================
-- NOTIFICATIONS SYSTEM
-- ==============================================================================

-- 1. Create Notifications Table
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text check (type in ('invite', 'info', 'success', 'warning')),
  title text not null,
  message text not null,
  data jsonb, -- Stores metadata like { "groupId": "...", "actionLink": "..." }
  read boolean default false,
  created_at timestamptz default now() not null
);

-- 2. Enable RLS
alter table public.notifications enable row level security;

-- 3. Policies
-- Users can view their own notifications
create policy "Users can view their own notifications."
  on notifications for select
  using ( auth.uid() = user_id );

-- Users can update their own notifications (mark as read)
create policy "Users can update their own notifications."
  on notifications for update
  using ( auth.uid() = user_id );

-- Users can delete their own notifications
create policy "Users can delete their own notifications."
  on notifications for delete
  using ( auth.uid() = user_id );

-- Anyone can insert notifications (for invites)
-- Ideally, we'd restrict this, but for now allow authenticated users to send invites
create policy "Users can insert notifications."
  on notifications for insert
  with check ( auth.role() = 'authenticated' );

-- 4. Realtime
alter publication supabase_realtime add table notifications;
