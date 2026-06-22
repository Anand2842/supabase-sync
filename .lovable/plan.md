
# Portfolio MCP Server + Admin Approval Queue

Expose the portfolio over MCP so Claude Desktop / Codex / ChatGPT (or any MCP-compatible client) can read current content and propose edits. Writes never go live directly — they land in a `pending_changes` queue that you approve from the existing `/admin` dashboard. On approve, the change is applied to the live `content` row.

---

## 1. MCP transport

- New TanStack server route: `src/routes/api/mcp.ts` using `mcp-tanstack-start` + `@modelcontextprotocol/sdk` (Streamable HTTP, POST only, GET/DELETE → 405).
- Auth via bearer token: `MCP_TOKEN` secret (generated). Client config sends `Authorization: Bearer <token>`. Without it → 401. This is the single shared admin token — give it only to your own AI clients.
- Public URL: `https://anandbuild.dev/api/mcp` (and the lovable.app domains).

## 2. Tools exposed over MCP

Read tools (return live data, no approval needed):
- `get_profile` — name, bio, avatar, action row labels, resume URL, social links.
- `list_posts` / `get_post(id)` — full post records incl. `display_age`, media, captions.
- `list_reels` / `get_reel(id)`.
- `list_story_groups` / `get_story_group(id)`.
- `list_about` — timeline, "right now", skills.
- `list_pending_changes` — what's already queued.
- `get_schema(entity)` — returns the JSON schema + required fields for `post`, `reel`, `story_group`, `profile`, `about`, so the AI client knows exactly what to fill.

Write tools (always go through approval queue):
- `propose_create(entity, payload)` — entity ∈ post|reel|story_group|about_item|profile_field.
- `propose_update(entity, id, patch)`.
- `propose_delete(entity, id)`.
- `propose_reorder(entity, ordered_ids)`.

Each write tool:
1. Validates payload against the entity's Zod schema.
2. Inserts a row into `pending_changes` with `status='pending'`.
3. Returns `{ pending_id, preview_url: '/admin#pending/<id>', status: 'pending_approval' }`.

The MCP server's `instructions` field tells the client: "All writes require admin approval. Call `get_schema` first, then `propose_*`. You'll get a pending_id back — the change is not live until approved in the dashboard."

## 3. Data model — one migration

```sql
create table public.pending_changes (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'mcp',            -- 'mcp' | 'admin'
  client_label text,                              -- e.g. 'claude-desktop'
  action text not null,                           -- 'create'|'update'|'delete'|'reorder'
  entity text not null,                           -- 'post'|'reel'|'story_group'|'about_item'|'profile_field'
  entity_id text,                                 -- null for create
  payload jsonb not null,                         -- proposed values / patch
  status text not null default 'pending',         -- 'pending'|'approved'|'rejected'|'applied'|'failed'
  decided_by uuid references auth.users(id),
  decided_at timestamptz,
  apply_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```
Plus GRANTs (`service_role` all; `authenticated` select/update), RLS (only admin role can read/update), and updated_at trigger. `service_role` is used by the MCP route (insert) and the approval server fn (update + apply).

No schema change needed for posts/reels/etc — they already live in the `content.data` JSON blob, so apply = merge into that blob and write back.

## 4. Admin dashboard: Pending tab

Add a **Pending Changes** tab inside the existing `/admin` panel in `public/portfolio/index.html`:
- List of pending rows newest-first, each showing: entity, action, source/client, diff preview (proposed vs current), timestamp.
- Per-row actions: **Approve** / **Reject** / **Edit then approve** (opens the proposed payload in an editable JSON view or the matching entity editor before approving).
- Approve calls a protected server fn `applyPendingChange({ id })` which:
  - Re-validates payload, applies it to the live `content` row (or `story_groups` table for stories), sets `status='applied'`. On error → `status='failed'` + `apply_error`.
- Reject sets `status='rejected'`.
- Bulk approve/reject for selected rows.
- Badge with pending count next to the tab title; polls every 15s.

## 5. Server fns

In `src/lib/portfolio-admin.functions.ts` (client-safe path, protected with `requireSupabaseAuth` + admin role check):
- `listPendingChanges({ status? })`
- `applyPendingChange({ id })`
- `rejectPendingChange({ id })`
- `bulkDecide({ ids, decision })`

The MCP route uses `supabaseAdmin` (loaded inside the handler) for inserts/reads — token auth is its gate, not Supabase session.

## 6. Files touched / created

- New: `src/routes/api/mcp.ts` (Streamable HTTP route, 405 on GET/DELETE).
- New: `src/lib/mcp/tools/*.ts` — one file per tool, all using Zod input schemas. `defineTool` from `mcp-tanstack-start`.
- New: `src/lib/mcp/schemas.ts` — single source of truth for entity schemas (used by MCP `get_schema` and by `applyPendingChange` validation).
- New: `src/lib/portfolio-admin.functions.ts` — approval server fns.
- New: migration for `pending_changes`.
- Edited: `public/portfolio/index.html` — admin "Pending" tab UI + polling badge.
- Edited: `public/portfolio/content.js` — helpers to call the new server fns and render diffs.
- New secret: `MCP_TOKEN` (generated, 64 chars).
- Deps: `mcp-tanstack-start`, `@modelcontextprotocol/sdk`, `zod` (already present).

## 7. How you connect external clients

After implementation, the connection snippets you'd paste are:

**Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "anandbuild": {
      "transport": { "type": "http", "url": "https://anandbuild.dev/api/mcp" },
      "headers": { "Authorization": "Bearer <MCP_TOKEN>" }
    }
  }
}
```

**Codex / ChatGPT custom connector**: same URL + bearer header.

I'll surface the token value from secrets so you can paste it once.

## 8. Out of scope (say if you want any)

- Per-client tokens / scopes (one shared admin token for now).
- OAuth on the MCP endpoint (token is simpler and sufficient since you're the only consumer).
- Auto-apply rules (e.g. "auto-approve display_age edits").
- Notification webhook / email when a new pending change arrives.

Reply **go** to build it, or tell me what to change.
