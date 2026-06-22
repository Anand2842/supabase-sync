import { z } from "zod";

// Entity schemas used by MCP `get_schema` and write-tool validation.
// Payloads merge into the `content.data` JSON blob on apply.

export const ENTITIES = [
  "profile",
  "post",
  "reel",
  "story_group",
  "about_item",
  "feed_ratio",
] as const;
export type Entity = (typeof ENTITIES)[number];

export const profileSchema = z
  .object({
    name: z.string().optional(),
    username: z.string().optional(),
    role: z.string().optional(),
    bio: z.string().optional(),
    email: z.string().email().optional(),
    resumeUrl: z.string().url().or(z.literal("")).optional(),
  })
  .strict();

const commentSchema = z.object({
  u: z.string(),
  t: z.string(),
  when: z.string().optional(),
  avatar: z.string().optional(),
});

export const postSchema = z
  .object({
    id: z.string().optional(),
    time: z.string().optional(),
    display_age: z.string().optional(),
    label: z.string().optional(),
    slot: z.string().optional(),
    aspect: z.string().optional(),
    grad: z.string().optional(),
    big: z.string().optional(),
    placeholder: z.string().optional(),
    caption: z.string().optional(),
    likes: z.number().int().nonnegative().optional(),
    images: z
      .array(z.object({ slot: z.string(), placeholder: z.string().optional() }))
      .optional(),
    comments: z.array(commentSchema).optional(),
  })
  .passthrough();

export const reelSchema = z
  .object({
    id: z.string().optional(),
    slot: z.string().optional(),
    tag: z.string().optional(),
    title: z.string().optional(),
    sub: z.string().optional(),
    likesN: z.number().int().nonnegative().optional(),
    commentCount: z.string().optional(),
    placeholder: z.string().optional(),
    audio: z.string().optional(),
    time: z.string().optional(),
    display_age: z.string().optional(),
    videoUrl: z.string().url().optional(),
    comments: z.array(commentSchema).optional(),
  })
  .passthrough();

const slideSchema = z.object({
  kicker: z.string().optional(),
  title: z.string().optional(),
  body: z.string().optional(),
  slot: z.string().optional(),
  placeholder: z.string().optional(),
  url: z.string().url().optional(),
  type: z.enum(["image", "video"]).optional(),
});

export const storyGroupSchema = z
  .object({
    label: z.string().optional(),
    glyph: z.string().optional(),
    grad: z.string().optional(),
    time: z.string().optional(),
    slides: z.array(slideSchema).optional(),
  })
  .passthrough();

export const aboutItemSchema = z
  .object({
    kind: z.enum(["timeline", "now", "skill", "link"]),
    text: z.string().min(1),
    url: z.string().url().optional(),
  })
  .strict();

export const feedRatioSchema = z
  .object({ posts: z.number().int().min(0), reels: z.number().int().min(0) })
  .strict();

export const schemaForEntity: Record<Entity, z.ZodTypeAny> = {
  profile: profileSchema,
  post: postSchema,
  reel: reelSchema,
  story_group: storyGroupSchema,
  about_item: aboutItemSchema,
  feed_ratio: feedRatioSchema,
};

export const entityCollectionKey: Record<
  Exclude<Entity, "profile" | "feed_ratio">,
  string
> = {
  post: "posts",
  reel: "reels",
  story_group: "stories",
  about_item: "about",
};
