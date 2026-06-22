// Server-only: apply an approved pending change to live content.
import {
  entityCollectionKey,
  schemaForEntity,
  type Entity,
} from "./schemas";
import {
  readLiveContent,
  writeLiveContent,
  genId,
  type LiveContent,
} from "./content-store.server";

export type PendingRow = {
  id: string;
  action: "create" | "update" | "delete" | "reorder";
  entity: Entity;
  entity_id: string | null;
  payload: Record<string, unknown>;
};

export async function applyChange(row: PendingRow): Promise<void> {
  const { entity, action, entity_id, payload } = row;
  const content = await readLiveContent();

  if (entity === "profile") {
    if (action !== "update") throw new Error("profile only supports update");
    const parsed = schemaForEntity.profile.parse(payload);
    content.profile = { ...(content.profile ?? {}), ...(parsed as object) };
    await writeLiveContent(content);
    return;
  }

  if (entity === "feed_ratio") {
    if (action !== "update") throw new Error("feed_ratio only supports update");
    const parsed = schemaForEntity.feed_ratio.parse(payload);
    content.feedRatio = parsed as { posts: number; reels: number };
    await writeLiveContent(content);
    return;
  }

  const key = entityCollectionKey[entity as keyof typeof entityCollectionKey];
  if (!key) throw new Error(`Unknown entity: ${entity}`);
  const list = Array.isArray((content as Record<string, unknown>)[key])
    ? ([...((content as Record<string, unknown>)[key] as Array<Record<string, unknown>>)])
    : [];

  if (action === "reorder") {
    const ids = (payload.ordered_ids as string[]) ?? [];
    const byId = new Map(list.map((it) => [String(it.id ?? it.label ?? ""), it]));
    const reordered = ids
      .map((id) => byId.get(String(id)))
      .filter((x): x is Record<string, unknown> => !!x);
    // Append any items not referenced so nothing is lost.
    for (const it of list) {
      const id = String(it.id ?? it.label ?? "");
      if (!ids.includes(id)) reordered.push(it);
    }
    (content as Record<string, unknown>)[key] = reordered;
    await writeLiveContent(content);
    return;
  }

  if (action === "create") {
    const parsed = schemaForEntity[entity].parse(payload) as Record<string, unknown>;
    if (!parsed.id) parsed.id = genId(entity.slice(0, 2));
    list.push(parsed);
    (content as Record<string, unknown>)[key] = list;
    await writeLiveContent(content);
    return;
  }

  if (action === "update") {
    if (!entity_id) throw new Error("update requires entity_id");
    const parsed = schemaForEntity[entity].parse(payload) as Record<string, unknown>;
    const idx = list.findIndex(
      (it) => String(it.id ?? it.label ?? "") === String(entity_id),
    );
    if (idx === -1) throw new Error(`${entity} ${entity_id} not found`);
    list[idx] = { ...list[idx], ...parsed };
    (content as Record<string, unknown>)[key] = list;
    await writeLiveContent(content);
    return;
  }

  if (action === "delete") {
    if (!entity_id) throw new Error("delete requires entity_id");
    const filtered = list.filter(
      (it) => String(it.id ?? it.label ?? "") !== String(entity_id),
    );
    (content as Record<string, unknown>)[key] = filtered;
    await writeLiveContent(content);
    return;
  }

  throw new Error(`Unsupported action: ${action}`);
}

export async function snapshotReadable(): Promise<LiveContent> {
  return await readLiveContent();
}
