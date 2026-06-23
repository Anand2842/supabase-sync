// Returns the MCP_TOKEN secret to authenticated admin users.
// "Admin" in this app = any signed-in Supabase user (same model used by
// pending_changes RLS). Caller passes the Supabase access token as a bearer.
import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
  });

export const Route = createFileRoute("/api/public/admin-mcp-token")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "authorization, content-type",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
          },
        }),
      POST: async ({ request }) => {
        const auth = request.headers.get("Authorization") || "";
        const accessToken = auth.replace(/^Bearer\s+/i, "").trim();
        if (!accessToken) return json(401, { error: "Missing bearer token" });

        const url = process.env.SUPABASE_URL;
        const anon = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!url || !anon) return json(500, { error: "Server not configured" });

        const sb = createClient(url, anon, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: { headers: { Authorization: `Bearer ${accessToken}` } },
        });
        const { data, error } = await sb.auth.getUser();
        if (error || !data?.user) return json(401, { error: "Not signed in" });

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data: configData } = await supabaseAdmin
            .from("content")
            .select("data")
            .eq("id", "mcp_config")
            .maybeSingle();

          let mcpToken = (configData?.data as any)?.token;

          if (!mcpToken) {
            mcpToken = "mcp_" + crypto.randomUUID().replace(/-/g, "");
            await supabaseAdmin.from("content").upsert({
              id: "mcp_config",
              data: { token: mcpToken },
              updated_at: new Date().toISOString()
            });
          }

          return json(200, { token: mcpToken });
        } catch (err: any) {
          return json(500, { error: err.message || "Failed to initialize supabaseAdmin" });
        }
      },
    },
  },
});
