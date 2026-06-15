
-- Content table
create table if not exists public.content (
  id text primary key default 'live',
  data jsonb not null,
  updated_at timestamptz not null default now()
);
grant select on public.content to anon;
grant select, insert, update, delete on public.content to authenticated;
grant all on public.content to service_role;
alter table public.content enable row level security;
drop policy if exists "content is publicly readable" on public.content;
create policy "content is publicly readable" on public.content for select using (true);
drop policy if exists "only authenticated can write content" on public.content;
create policy "only authenticated can write content" on public.content for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Interactions
create table if not exists public.likes (
  visitor_id text not null, target_id text not null,
  created_at timestamptz not null default now(),
  primary key (visitor_id, target_id)
);
create table if not exists public.saves (
  visitor_id text not null, target_id text not null,
  created_at timestamptz not null default now(),
  primary key (visitor_id, target_id)
);
create table if not exists public.reel_likes (
  visitor_id text not null, reel_id text not null,
  created_at timestamptz not null default now(),
  primary key (visitor_id, reel_id)
);
create table if not exists public.follows (
  visitor_id text not null, username text not null,
  created_at timestamptz not null default now(),
  primary key (visitor_id, username)
);
create table if not exists public.following (
  visitor_id text primary key,
  value boolean not null default false,
  updated_at timestamptz not null default now()
);
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  target_id text not null,
  username text not null default 'you',
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists comments_target_idx on public.comments (target_id, created_at);
create table if not exists public.dms (
  id uuid primary key default gen_random_uuid(),
  thread_id text not null,
  sender text not null check (sender in ('me','them')),
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists dms_thread_idx on public.dms (thread_id, created_at);

-- Grants for interaction tables (public anonymous portfolio — anon can read+write)
do $$
declare t text;
begin
  foreach t in array array['likes','saves','reel_likes','follows','following','comments','dms']
  loop
    execute format('grant select, insert, update, delete on public.%I to anon;', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated;', t);
    execute format('grant all on public.%I to service_role;', t);
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "anon read %1$s" on public.%1$s;', t);
    execute format('create policy "anon read %1$s" on public.%1$s for select using (true);', t);
    execute format('drop policy if exists "anon write %1$s" on public.%1$s;', t);
    execute format('create policy "anon write %1$s" on public.%1$s for all using (true) with check (true);', t);
  end loop;
end $$;

-- Views
create or replace view public.v_post_like_counts as
  select target_id, count(*) as likes from public.likes group by target_id;
create or replace view public.v_dm_threads as
  select thread_id, count(*) as messages, max(created_at) as last_at,
         (array_agg(body order by created_at desc))[1] as last_message
  from public.dms group by thread_id;
grant select on public.v_post_like_counts to anon, authenticated;
grant select on public.v_dm_threads to anon, authenticated;
