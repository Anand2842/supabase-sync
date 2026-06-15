# Portfolio v2 — Major UX Overhaul

A focused plan covering every item you raised. All work lives in `public/portfolio/*` plus one new migration + a few storage/admin additions. No new top-level routes.

---

## 1. Remove "Edit Profile" from public site
- Strip the Edit Profile entry point from the user-facing header/profile tab. Editing only happens inside `/admin` (already gated by Lovable Cloud auth).

## 2. Profile header redesign (image 1)
Replace the empty "Photos of me" placeholder tab (the person icon) with a meaningful **"About"** panel:
- Short bio block (already in content)
- Timeline strip: Stackline '23 → Orbitly '25 → Now
- "What I'm building right now" line (editable from admin)
- Skills chips
- Press/links row
- All copy editable from admin Content Studio.

## 3. Action row: Follow / Message / Email → **Subscribe / Message / Resume**
- **Follow** is meaningless on a 1-person portfolio → replace with **Subscribe** (email capture, stored in a new `subscribers` table, drives a "new post" notify list).
- **Message** stays as-is (DMs).
- **Email** → **Resume**: opens/downloads a PDF. Admin can upload the resume file to Storage (`portfolio-images` bucket, `resume/` prefix) and the button links to the public URL. Fallback to mailto if no resume uploaded.
- Update every reference of `hi@anand.dev` → **aanand.ak15@gmail.com** (bio link, mailto, contact, admin defaults, seed content).

## 4. Posts + Reels grid (image 2)
- Default Grid tab already renders posts; keep that.
- Add Reels carousel strip above the grid on the Grid tab (Instagram-style: horizontal scroll of reel covers).
- Reels tab: full reel feed.

## 5. Stories / Highlights grouping (admin)
- Admin gets a **Stories** section to create highlight groups (title + cover + ordered list of slides: image or short video).
- Public site shows the existing circle row (About / Stackline / Orbitly / Wins / Stack) but the items are now admin-managed highlight groups. Tapping opens a full-screen story viewer with tap-to-advance, like Instagram.

## 6. Identity / anonymous commenting system
- **Likes**: stay fully anonymous (visitor_id only). No prompt.
- **First comment**: modal asks for a display name.
  - User can type a name (duplicates allowed for typed names).
  - OR tap "Give me a random name" → server-side generated, **guaranteed unique** (checked against `visitor_identities.random_name` unique index; retry until free). Pool: adjective + animal + number (e.g. `SleepyOtter42`).
  - Optional email field (not required) — stored for "notify on reply".
- Choice persisted in `visitor_identities` table keyed by `visitor_id`. Subsequent comments + DMs reuse it silently.
- **Avatar picker**: at identity creation, user picks from ~12 cartoon/game-style avatars (pre-generated, stored in `portfolio-images/avatars/`). Avatar shown next to their comments/DMs.

## 7. Admin: editable "posted X ago"
- Each post/reel gets a `display_age` field (free-text, e.g. "3 weeks ago", "Last Tuesday", "Just now"). Overrides computed time when set. Blank = compute from `created_at`.

## 8. Reels autoplay
- Opening the Reels tab autoplays the first reel (muted, with unmute toggle). IntersectionObserver pauses off-screen reels and plays the active one. Tap toggles play/pause + unmute.

## 9. Home feed mixing (Instagram-style 2:1)
- Home grid interleaves: 2 posts → 1 reel cover → 2 posts → 1 reel, etc.
- Admin Layout panel: dropdown to set the mix ratio (`posts:reels` — `2:1`, `3:1`, `1:1`, `posts only`) and manual ordering override.

## 10. Bottom-of-feed CTA
- After the last item on the Home feed, render a card: **"Want to know more about Anand? Start a chat →"** that opens the DM composer pre-filled with "Hey Anand, I'd love to know more about…".

## 11. Stability: stop the auto-reload crash
Investigate the loop. Most likely causes given current code:
- `onAuthStateChange` firing on `TOKEN_REFRESHED` triggering a full re-hydrate of `content` → re-renders that re-subscribe → loop.
- Realtime subscription on `content` table re-firing on its own writes from the admin tab.
Fix: filter auth events to SIGNED_IN/OUT only, debounce realtime hydrate, guard against re-render storms with a render-key check. Add a global error boundary that recovers without full-page reload.

---

## Data model (one migration)

```sql
-- Persistent identity per visitor
create table public.visitor_identities (
  visitor_id text primary key,
  display_name text not null,
  random_name text unique,        -- only set when name was auto-generated
  avatar_key text not null,        -- e.g. 'fox-01'
  email text,
  created_at timestamptz default now()
);

-- Email subscribers (Subscribe button)
create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz default now()
);

-- Story / highlight groups
create table public.story_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cover_url text,
  slides jsonb not null default '[]'::jsonb,  -- [{type:'image'|'video', url, duration}]
  sort_order int not null default 0,
  updated_at timestamptz default now()
);
```
Plus GRANTs + RLS (public read for `story_groups`; anon insert-only on `subscribers` and `visitor_identities`; no public read of `subscribers`/`visitor_identities` emails).

Posts/reels `display_age` and feed mix ratio are stored inside the existing `content.data` JSON — no schema change.

---

## Admin additions (`/admin`)
- **Profile tab**: edit bio, timeline, "building now", skills, email (defaults to aanand.ak15@gmail.com), resume upload.
- **Stories tab**: CRUD highlight groups, drag-reorder slides.
- **Posts/Reels tab**: existing + `display_age` field.
- **Layout tab**: feed mix ratio dropdown, manual reorder.
- **Inbox tab**: existing.
- **Subscribers tab**: read-only list + CSV export.

---

## Files touched
- `public/portfolio/index.html` — header redesign, action row labels, story viewer, home feed mixing, bottom CTA, identity modal, avatar picker, reel autoplay logic.
- `public/portfolio/content.js` — new defaults, mix-ratio renderer, identity helper, story groups loader, stability fixes (debounced hydrate, filtered auth events).
- `public/portfolio/portfolio-storage.js` — resume upload helper, story media upload, avatar bucket helper.
- New: `public/portfolio/identity.js` — visitor identity + random-name generator + avatar picker.
- Admin section inside `index.html` — Stories, Layout, Profile (resume), Subscribers tabs; `display_age` field on each post/reel editor.
- One new migration for the three tables above.
- Generate 12 cartoon avatar PNGs into `portfolio-images/avatars/`.

---

## Out of scope (confirm if you want any of these too)
- Real push notifications to subscribers (just collecting emails for now).
- Server-side resume PDF generation (you upload your own PDF).
- Native video reels recorded in-browser (reels are uploaded MP4s, same as today).

Reply "go" to implement, or tell me what to drop/add.