import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// Any signed-in admin (authenticated via the admin dashboard) can approve.
// The dashboard is already auth-gated; sign-in is the admin gate.

export const listPendingChanges = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        status: z
          .enum(["pending", "approved", "rejected", "applied", "failed"])
          .optional(),
        limit: z.number().int().min(1).max(200).optional(),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("pending_changes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit ?? 100);
    if (data.status) q = q.eq("status", data.status);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const applyPendingChange = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { applyChange } = await import("@/lib/mcp/apply.server");
    const { data: row, error } = await supabaseAdmin
      .from("pending_changes")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error || !row) throw new Error(error?.message ?? "Not found");
    if (row.status !== "pending")
      throw new Error(`Cannot apply: status is ${row.status}`);
    try {
      await applyChange({
        id: row.id,
        action: row.action as "create" | "update" | "delete" | "reorder",
        entity: row.entity as never,
        entity_id: row.entity_id,
        payload: (row.payload as Record<string, unknown>) ?? {},
      });
      await supabaseAdmin
        .from("pending_changes")
        .update({
          status: "applied",
          decided_by: context.userId,
          decided_at: new Date().toISOString(),
          apply_error: null,
        })
        .eq("id", row.id);
      return { ok: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await supabaseAdmin
        .from("pending_changes")
        .update({
          status: "failed",
          decided_by: context.userId,
          decided_at: new Date().toISOString(),
          apply_error: msg,
        })
        .eq("id", row.id);
      throw new Error(msg);
    }
  });

export const rejectPendingChange = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("pending_changes")
      .update({
        status: "rejected",
        decided_by: context.userId,
        decided_at: new Date().toISOString(),
      })
      .eq("id", data.id)
      .eq("status", "pending");
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const editPendingPayload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        payload: z.record(z.string(), z.unknown()),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("pending_changes")
      .update({ payload: data.payload as never })
      .eq("id", data.id)
      .eq("status", "pending");
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getMcpInfo = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    return {
      url: "/api/mcp",
      // Token never returned to browser; admin reads it from Lovable Cloud secrets.
      tokenConfigured: !!process.env.MCP_TOKEN,
    };
  });
