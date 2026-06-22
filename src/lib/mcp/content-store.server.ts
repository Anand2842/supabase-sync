// Server-only helpers around the live `content` row used by MCP tools.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type LiveContent = Record<string, unknown> & {
  profile?: Record<string, unknown>;
  posts?: Array<Record<string, unknown>>;
  reels?: Array<Record<string, unknown>>;
  stories?: Array<Record<string, unknown>>;
  about?: Array<Record<string, unknown>>;
  feedRatio?: { posts: number; reels: number };
};

export async function readLiveContent(): Promise<LiveContent> {
  const { data, error } = await supabaseAdmin
    .from("content")
    .select("data")
    .eq("id", "live")
    .maybeSingle();
  if (error) throw new Error(`readLiveContent: ${error.message}`);
  return ((data?.data as LiveContent) ?? {}) as LiveContent;
}

export async function writeLiveContent(next: LiveContent): Promise<void> {
  const { error } = await supabaseAdmin
    .from("content")
    .upsert({ id: "live", data: next as never, updated_at: new Date().toISOString() });
  if (error) throw new Error(`writeLiveContent: ${error.message}`);
}

export function genId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}
