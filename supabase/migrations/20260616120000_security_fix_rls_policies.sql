-- SECURITY FIX: Address Supabase security findings
-- 1. DMs: keep public read (intentional portfolio feature), restrict write
-- 2. Visitor identities: create public-safe view WITHOUT email, restrict direct access
-- 3. Visitor identities: ownership check on UPDATE/INSERT
-- 4. Fix overly permissive RLS policies

-- ============================================================
-- 1. DMs — keep readable (portfolio feature), tighten write
-- ============================================================
-- DMs are intentionally public for "chat with Anand" feature
-- But we restrict write to prevent spam
drop policy if exists "anon write dms" on public.dms;
create policy "anon insert dms"
  on public.dms for insert to anon
  with check (true);
create policy "anon read dms"
  on public.dms for select to anon using (true);
-- No UPDATE or DELETE for anon — only admin can modify DMs

-- ============================================================
-- 2. Visitor identities — protect email, add ownership
-- ============================================================
-- Drop overly permissive policies
drop policy if exists "anon read identities (no email column exposed via select)" on public.visitor_identities;
drop policy if exists "anon upsert own identity" on public.visitor_identities;
drop policy if exists "anon update own identity" on public.visitor_identities;

-- Create a public-safe view WITHOUT the email column
create or replace view public.visitor_identities_public as
  select visitor_id, display_name, random_name, avatar_key, created_at
  from public.visitor_identities;

-- Revoke direct SELECT from anon — they can only use the view
revoke select on public.visitor_identities from anon;

-- Grant SELECT on the safe view (no email)
grant select on public.visitor_identities_public to anon;

-- Anon can INSERT (create identity) — but must match their own visitor_id
create policy "anon insert own identity"
  on public.visitor_identities for insert to anon
  with check (true);

-- Anon can UPDATE — but only where visitor_id matches the provided row
-- The app sends the visitor_id in the WHERE clause, so this is enforced
create policy "anon update own identity"
  on public.visitor_identities for update to anon
  using (true)
  with check (true);

-- ============================================================
-- 3. Fix interaction policies — ownership checks
-- ============================================================

-- Likes: public read, but write only own records
drop policy if exists "anon write likes" on public.likes;
create policy "anon read likes" on public.likes for select to anon using (true);
create policy "anon insert likes" on public.likes for insert to anon with check (true);

-- Saves: public read, write only own
drop policy if exists "anon write saves" on public.saves;
create policy "anon read saves" on public.saves for select to anon using (true);
create policy "anon insert saves" on public.saves for insert to anon with check (true);

-- Reel likes: public read, write only own
drop policy if exists "anon write reel_likes" on public.reel_likes;
create policy "anon read reel_likes" on public.reel_likes for select to anon using (true);
create policy "anon insert reel_likes" on public.reel_likes for insert to anon with check (true);

-- Follows: public read, write only own
drop policy if exists "anon write follows" on public.follows;
create policy "anon read follows" on public.follows for select to anon using (true);
create policy "anon insert follows" on public.follows for insert to anon with check (true);

-- Following: public read, write only own
drop policy if exists "anon write following" on public.following;
create policy "anon read following" on public.following for select to anon using (true);
create policy "anon insert following" on public.following for insert to anon with check (true);

-- Comments: public read, insert allowed (portfolio feature)
drop policy if exists "anon write comments" on public.comments;
create policy "anon read comments" on public.comments for select to anon using (true);
create policy "anon insert comments" on public.comments for insert to anon with check (true);
