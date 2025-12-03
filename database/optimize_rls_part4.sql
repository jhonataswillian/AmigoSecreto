-- OPTIMIZE RLS POLICIES PART 4 (The Missing Piece)
-- This script adds the last missing index identified by the Performance Advisor.

-- 1. Create Index for group_invites(created_by)
-- This was flagged as "Unindexed foreign keys".
create index if not exists idx_group_invites_created_by on public.group_invites(created_by);
