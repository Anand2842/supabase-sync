import { createFileRoute } from "@tanstack/react-router";
import { createMcpServer, defineTool, withMcpAuth } from "mcp-tanstack-start";
import { z } from "zod";
import {
  ENTITIES,
  schemaForEntity,
  type Entity,
} from "@/lib/mcp/schemas";

// All tool handlers are server-only and use supabaseAdmin loaded lazily.

const readToolNoArgs = (
  name: string,
  description: string,
  load: () => Promise<unknown>,
) =>
  defineTool({
    name,
    description,
    parameters: z.object({}),
    execute: async () => JSON.stringify(await load(), null, 2),
  });

const getProfile = readToolNoArgs(
  "get_profile",
  "Read the live portfolio profile (name, bio, email, resume url, etc).",
  async () => {
    const { snapshotReadable } = await import("@/lib/mcp/apply.server");
    const c = await snapshotReadable();
    return c.profile ?? {};
  },
);

const listPosts = readToolNoArgs(
  "list_posts",
  "List all live posts (id, caption, time, likes, comments).",
  async () => {
    const { snapshotReadable } = await import("@/lib/mcp/apply.server");
    return (await snapshotReadable()).posts ?? [];
  },
);

const listReels = readToolNoArgs(
  "list_reels",
  "List all live reels.",
  async () => {
    const { snapshotReadable } = await import("@/lib/mcp/apply.server");
    return (await snapshotReadable()).reels ?? [];
  },
);

const listStories = readToolNoArgs(
  "list_story_groups",
  "List all live story / highlight groups.",
  async () => {
    const { snapshotReadable } = await import("@/lib/mcp/apply.server");
    return (await snapshotReadable()).stories ?? [];
  },
);

const listAbout = readToolNoArgs(
  "list_about",
  "List live about-panel items (timeline, now, skills, links).",
  async () => {
    const { snapshotReadable } = await import("@/lib/mcp/apply.server");
    return (await snapshotReadable()).about ?? [];
  },
);

const listPending = defineTool({
  name: "list_pending_changes",
  description: "List proposed changes waiting for admin approval.",
  parameters: z.object({
    status: z
      .enum(["pending", "approved", "rejected", "applied", "failed"])
      .optional(),
    limit: z.number().int().min(1).max(100).default(50),
  }),
  execute: async ({ status, limit }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const q = supabaseAdmin
      .from("pending_changes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    const { data, error } = status ? await q.eq("status", status) : await q;
    if (error) throw new Error(error.message);
    return JSON.stringify(data, null, 2);
  },
});

const getSchema = defineTool({
  name: "get_schema",
  description:
    "Return the JSON schema and field list for an entity. Call this before propose_create / propose_update so you know what fields are valid.",
  parameters: z.object({ entity: z.enum(ENTITIES) }),
  execute: async ({ entity }) => {
    // zod v4 toJSONSchema; fall back to shape introspection if unavailable.
    const s = schemaForEntity[entity as Entity];
    try {
      const toJsonSchema = (z as unknown as { toJSONSchema?: (x: unknown) => unknown })
        .toJSONSchema;
      if (typeof toJsonSchema === "function") {
        return JSON.stringify({ entity, schema: toJsonSchema(s) }, null, 2);
      }
    } catch {}
    return JSON.stringify(
      { entity, note: "Pass a JSON object matching the documented fields." },
      null,
      2,
    );
  },
});

async function insertPending(args: {
  action: "create" | "update" | "delete" | "reorder";
  entity: Entity;
  entity_id?: string | null;
  payload: unknown;
  client_label?: string;
}) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("pending_changes")
    .insert({
      source: "mcp",
      client_label: args.client_label ?? null,
      action: args.action,
      entity: args.entity,
      entity_id: args.entity_id ?? null,
      payload: args.payload as never,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return {
    pending_id: data.id,
    status: "pending_approval",
    message:
      "Change queued. An admin must approve it in the dashboard before it goes live.",
    review_url: "/anandbuild/index.html#admin-pending",
  };
}

const proposeCreate = defineTool({
  name: "propose_create",
  description:
    "Propose creating a new item. Goes to the admin approval queue — not live until approved.",
  parameters: z.object({
    entity: z.enum(ENTITIES),
    payload: z.record(z.string(), z.unknown()),
    client_label: z.string().optional(),
  }),
  execute: async ({ entity, payload, client_label }) => {
    schemaForEntity[entity as Entity].parse(payload);
    const r = await insertPending({
      action: "create",
      entity: entity as Entity,
      payload,
      client_label,
    });
    return JSON.stringify(r, null, 2);
  },
});

const proposeUpdate = defineTool({
  name: "propose_update",
  description:
    "Propose updating an existing item by id. Goes to the admin approval queue.",
  parameters: z.object({
    entity: z.enum(ENTITIES),
    id: z.string(),
    patch: z.record(z.string(), z.unknown()),
    client_label: z.string().optional(),
  }),
  execute: async ({ entity, id, patch, client_label }) => {
    schemaForEntity[entity as Entity].parse(patch);
    const r = await insertPending({
      action: "update",
      entity: entity as Entity,
      entity_id: id,
      payload: patch,
      client_label,
    });
    return JSON.stringify(r, null, 2);
  },
});

const proposeDelete = defineTool({
  name: "propose_delete",
  description: "Propose deleting an item by id. Requires admin approval.",
  parameters: z.object({
    entity: z.enum(ENTITIES),
    id: z.string(),
    client_label: z.string().optional(),
  }),
  execute: async ({ entity, id, client_label }) => {
    const r = await insertPending({
      action: "delete",
      entity: entity as Entity,
      entity_id: id,
      payload: { id },
      client_label,
    });
    return JSON.stringify(r, null, 2);
  },
});

const proposeReorder = defineTool({
  name: "propose_reorder",
  description: "Propose reordering a collection. Requires admin approval.",
  parameters: z.object({
    entity: z.enum(["post", "reel", "story_group", "about_item"]),
    ordered_ids: z.array(z.string()).min(1),
    client_label: z.string().optional(),
  }),
  execute: async ({ entity, ordered_ids, client_label }) => {
    const r = await insertPending({
      action: "reorder",
      entity: entity as Entity,
      payload: { ordered_ids },
      client_label,
    });
    return JSON.stringify(r, null, 2);
  },
});

const mcp = createMcpServer({
  name: "anandbuild-portfolio",
  version: "1.0.0",
  instructions: [
    "Read tools (get_profile, list_posts, list_reels, list_story_groups, list_about, list_pending_changes) return live data immediately.",
    "ALL writes require admin approval. Use get_schema first to learn an entity's fields, then call propose_create / propose_update / propose_delete / propose_reorder.",
    "Write tools return a pending_id and review_url. The change is NOT live until the admin approves it in the dashboard.",
    "Supported entities: profile, post, reel, story_group, about_item, feed_ratio.",
  ].join(" "),
  tools: [
    getProfile,
    listPosts,
    listReels,
    listStories,
    listAbout,
    listPending,
    getSchema,
    proposeCreate,
    proposeUpdate,
    proposeDelete,
    proposeReorder,
  ],
});

const methodNotAllowed = () =>
  new Response(
    JSON.stringify({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed." },
      id: null,
    }),
    {
      status: 405,
      headers: { "Content-Type": "application/json", Allow: "POST, OPTIONS" },
    },
  );

const infoResponse = () =>
  new Response(
    JSON.stringify(
      {
        ok: true,
        name: "anandbuild-portfolio",
        transport: "Streamable HTTP (MCP)",
        usage: "POST JSON-RPC 2.0 to this URL with header 'Authorization: Bearer <MCP_TOKEN>'.",
        note: "GET is not part of the MCP protocol — this is just a friendly status page. Configure your MCP client (Claude / Codex / ChatGPT) to POST here.",
      },
      null,
      2,
    ),
    {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    },
  );


const authenticatedHandler = withMcpAuth(
  async (request, auth) => mcp.handleRequest(request, { auth }),
  async (request) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const expected = process.env.MCP_TOKEN;
    if (!token || !expected || token !== expected) return null;
    return { token };
  },
);

export const Route = createFileRoute("/api/mcp")({
  server: {
    handlers: {
      POST: async ({ request }) => authenticatedHandler(request),
      GET: async () => infoResponse(),
      DELETE: async () => methodNotAllowed(),
    },
  },
});
