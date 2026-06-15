# Portfolio Audit & Stabilization Plan

Goal: verify every wired feature end-to-end (frontend → Supabase), fix anything broken, and replace placeholder media with real uploaded assets.

## 1. Backend wiring audit (read-only)
- Re-read `public/portfolio/content.js`, `portfolio-storage.js`, `index.html` admin/inbox blocks.
- Verify each Supabase call against current schema (`content`, `likes`, `saves`, `reel_likes`, `follows`, `following`, `comments`, `dms`) and RLS policies.
- Check `portfolio-images` bucket policies + signed-URL hydration path.
- Confirm `supabaseUrl` / `anonKey` are populated and the script loads before `support.js`/`image-slot.js`.

## 2. Live preview testing (browser tool)
Run each as a real user at `/portfolio/index.html`:

| Area | Test |
|---|---|
| Public load | Page renders, content loads from `content` table, no console errors |
| Likes | Tap heart on a post → row in `likes`, count updates, toggle off removes row |
| Saves | Bookmark → row in `saves`, persists on reload |
| Reel likes | Like reel → row in `reel_likes` |
| Follow | Follow toggle → row in `following`/`follows`, persists |
| Comments | Add comment → row in `comments`, visible to new visitor (incognito-style reload) |
| DMs | Send DM → row in `dms`, visible in admin inbox |
| Admin login | `/admin` → email/password → session established |
| Admin edit | Change bio/post caption → `content` row updates, public reload shows it |
| Image drop (admin) | Drop an image onto a slot → uploaded to `portfolio-images`, visible after reload AND in a second browser/incognito |
| Inbox tab | Lists DM threads + comments; reply posts back to `dms` |
| Logout | Session cleared, admin UI gated again |

For each failure: capture console/network, fix in `content.js` / `portfolio-storage.js` / `index.html` only, re-test.

## 3. Real media replacement
- Log in as admin in preview, drop real images into each `<image-slot>` (profile, posts, reel covers) so they upload to Storage rather than living as base64 in `content.data`.
- If videos are referenced, confirm the slot mechanism supports them; if not, note as a follow-up (out of scope unless you want video upload too).
- Note: I need **you to provide the real images** (drag them into chat) — I can't invent your photos. Alternatively I can generate placeholder-but-on-brand images via AI. Confirm which.

## 4. Stability sweep
- Check Supabase logs / linter for errors after the test pass.
- Verify no `service_role` leakage, no admin endpoints exposed to anon.
- Confirm reloads, second-browser visits, and signed-out state all behave.

## 5. Report
Deliver a checklist showing pass/fail per item, list of fixes applied, and any remaining issues.

## Questions before I start
1. **Media source for step 3**: upload your real photos here, or want me to generate on-brand AI images?
2. **Admin credentials**: is the auth user already created and email-confirmed? If not, want me to disable email confirmation so I can sign up and test end-to-end?
3. **Destructive testing OK?** I'll create test comments/DMs/likes under a visitor id; I'll delete them after. Confirm OK.
