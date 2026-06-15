
## Goal

Drop the uploaded `Anand Portfolio` static site into this Lovable project, serve it as the homepage, and wire `content.js` to Lovable Cloud so content edits, likes, saves, comments, and DMs persist server-side — without touching the portfolio UI.

## Approach

The portfolio is a self-contained HTML page (`Anand Portfolio.dc.html`) that runs entirely in the browser via `support.js` (dc-runtime). It does not need TanStack/React routing. The cleanest way to host it inside this project is to serve the static files from `public/` and redirect `/` to it.

## Steps

1. **Copy static files to `public/portfolio/`**
   - `Anand Portfolio.dc.html` → `public/portfolio/index.html`
   - `support.js`, `image-slot.js`, `content.js`, `BACKEND.md` (ref) → same folder
   - Rewrite the `<script src="./support.js">` and helmet script paths so they resolve from `/portfolio/`.

2. **Make `/` serve the portfolio**
   - Replace `src/routes/index.tsx` with a route that redirects to `/portfolio/index.html` (or renders it in an iframe-free full-page redirect).

3. **Enable Lovable Cloud** (Supabase under the hood).

4. **Run `supabase_schema.sql`** via a migration: `content`, `likes`, `saves`, `reel_likes`, `follows`, `following`, `comments`, `dms` tables + the existing RLS policies + `v_post_like_counts` and `v_dm_threads` views. Add the required `GRANT` statements for `anon`/`authenticated`/`service_role` that Supabase needs on top of the file's RLS (the schema file omits them).

5. **Wire `content.js` to Supabase** (the only file edited, per the golden rule):
   - Fill `CONFIG.supabaseUrl` and `CONFIG.supabaseAnonKey` from Lovable Cloud's published env (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`).
   - Add the `db()` helper that loads `@supabase/supabase-js` from `esm.sh`.
   - Add `visitorId()` helper.
   - Replace the bodies of `loadContent`, `saveContent`, `getInteractions`, `setFlag`, `getComments`, `addComment`, `getDms`, `saveDms` with the Supabase versions from BACKEND.md §2. Keep names, args, return shapes, and demo-mode fallback identical.

6. **Leave admin gate as the existing password (`letmein`)** for now — BACKEND.md prompt 6 (Supabase Auth swap) and prompt 7 (image storage) are explicitly marked optional/later and not in scope here.

## What I will NOT change

- The portfolio HTML, `support.js`, `image-slot.js` — untouched.
- Function names, arguments, or return shapes in `content.js` — only bodies.
- TanStack routing beyond making `/` redirect to the portfolio.

## Out of scope (can do later on request)

- Swapping the admin password for Supabase Auth.
- Uploading dropped images to Supabase Storage.
- Adding an Inbox tab inside `/admin`.

## Open question

The portfolio's `/admin` route is handled internally by the static page (type `/admin` or append `#admin`). Hosting under `/portfolio/index.html` means the URL bar will show `/portfolio/index.html`, not `/`. If you want the portfolio to live at the root URL (`yoursite.com/` instead of `yoursite.com/portfolio/index.html`), I can move the files to `public/` directly and serve `index.html` there — but TanStack Start's dev server may shadow it with the React `/` route. The redirect approach is the safest. Let me know if you'd rather I try root-level hosting.
