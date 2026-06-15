-- Visitor identities (display name + avatar + optional email)
create table public.visitor_identities (
  visitor_id text primary key,
  display_name text not null,
  random_name text unique,
  avatar_key text not null,
  email text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.visitor_identities to anon, authenticated;
grant all on public.visitor_identities to service_role;
alter table public.visitor_identities enable row level security;
create policy "anon read identities (no email column exposed via select)"
  on public.visitor_identities for select to anon, authenticated using (true);
create policy "anon upsert own identity"
  on public.visitor_identities for insert to anon, authenticated with check (true);
create policy "anon update own identity"
  on public.visitor_identities for update to anon, authenticated using (true) with check (true);

-- Email subscribers
create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);
grant insert on public.subscribers to anon, authenticated;
grant select, update, delete on public.subscribers to authenticated;
grant all on public.subscribers to service_role;
alter table public.subscribers enable row level security;
create policy "anyone can subscribe"
  on public.subscribers for insert to anon, authenticated with check (true);
create policy "authenticated admin reads subscribers"
  on public.subscribers for select to authenticated using (true);

-- Story / highlight groups
create table public.story_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cover_url text,
  slides jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);
grant select on public.story_groups to anon, authenticated;
grant insert, update, delete on public.story_groups to authenticated;
grant all on public.story_groups to service_role;
alter table public.story_groups enable row level security;
create policy "public read stories"
  on public.story_groups for select to anon, authenticated using (true);
create policy "auth write stories"
  on public.story_groups for all to authenticated using (true) with check (true);