import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

export const getClerkPublishableKey = createServerFn({ method: "GET" }).handler(async () => {
  const { CLERK_PUBLISHABLE_KEY_FALLBACK } = await import("./clerk-config");
  const fromEnv = process.env["CLERK_PUBLISHABLE_KEY"] ?? (globalThis as { __env__?: Record<string, unknown> }).__env__?.["CLERK_PUBLISHABLE_KEY"];
  return typeof fromEnv === "string" && fromEnv ? fromEnv : CLERK_PUBLISHABLE_KEY_FALLBACK;
});

export type RawData = {
  notepages: Array<Record<string, string | null>>;
  notes: Array<Record<string, string | null>>;
  profiles: Array<Record<string, string | null>>;
  tags: Array<{ note_id: string; name: string }>;
  likes: Array<{ note_id: string; user_id: string }>;
  guestnotes: Array<Record<string, string | null>>;
  me: string | null;
};

export const loadInktella = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({
      name: z.string().max(120).optional(),
      imageUrl: z.string().url().startsWith("https://img.clerk.com/").max(2000).optional(),
    }).parse(d ?? {}),
  )
  .handler(async ({ data }): Promise<RawData> => {
  const { d1, currentUserId, ensureProfile } = await import("./d1.server");
  const me = await currentUserId(getRequest());
  // Verified Clerk user ID → find or create their D1 profile before loading data.
  if (me) await ensureProfile(me, data).catch((e) => console.error("ensureProfile failed", e));
  const [notepages, notes, profiles, tags, likes, guestnotes] = await Promise.all([
    d1<Record<string, string | null>>("SELECT * FROM notepages ORDER BY created_at"),
    d1<Record<string, string | null>>(
      "SELECT * FROM notes WHERE status = 'published' OR author_id = ? ORDER BY COALESCE(published_at, created_at) DESC",
      [me ?? ""],
    ),
    d1<Record<string, string | null>>("SELECT * FROM profiles"),
    d1<{ note_id: string; name: string }>("SELECT nn.note_id, t.name FROM note_notetags nn JOIN notetags t ON t.id = nn.notetag_id"),
    d1<{ note_id: string; user_id: string }>("SELECT note_id, user_id FROM likes"),
    d1<Record<string, string | null>>("SELECT * FROM guestnotes ORDER BY created_at"),
  ]);
  return { notepages, notes, profiles, tags, likes, guestnotes, me };
});

const fonts = ["Space Grotesk", "Instrument Serif", "Lora"] as const;

export const createNotepage = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({
      name: z.string().trim().min(2).max(80),
      description: z.string().trim().min(6).max(400),
      slug: z.string().regex(/^[a-z0-9-]{2,40}$/),
      bg: z.string().max(60),
      ink: z.string().max(60),
      headingFont: z.enum(fonts),
      coverUrl: z.string().max(2_000_000).startsWith("data:image/").optional(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const { d1, requireUserId, ensureProfile } = await import("./d1.server");
    const userId = await requireUserId(getRequest());
    await ensureProfile(userId);
    const reserved = ["notella", "notepages", "notetags", "write", "sign-in", "about", "pricing", "privacy", "terms", "guidelines", "explore", "profile", "topics", "api"];
    let slug = data.slug;
    if (reserved.includes(slug) || (await d1("SELECT 1 FROM notepages WHERE slug = ?", [slug])).length) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    }
    const id = crypto.randomUUID();
    await d1(
      "INSERT INTO notepages (id, owner_id, slug, name, description, cover_url, bg, ink, heading_font) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, userId, slug, data.name, data.description, data.coverUrl ?? null, data.bg, data.ink, data.headingFont],
    );
    return { id, slug };
  });

export const saveNote = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({
      notepageSlug: z.string(),
      title: z.string().max(200),
      html: z.string().max(2_000_000),
      preview: z.string().max(400),
      notetags: z.array(z.string().regex(/^[a-z0-9-]{1,40}$/)).max(12),
      publish: z.boolean(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const { d1, requireUserId } = await import("./d1.server");
    const userId = await requireUserId(getRequest());
    const [page] = await d1<{ id: string; owner_id: string }>("SELECT id, owner_id FROM notepages WHERE slug = ?", [data.notepageSlug]);
    if (!page || page.owner_id !== userId) throw new Error("That Notepage isn't yours.");
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await d1(
      "INSERT INTO notes (id, notepage_id, author_id, title, html, preview, status, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, page.id, userId, data.title, data.html, data.preview, data.publish ? "published" : "draft", data.publish ? now : null],
    );
    for (const name of [...new Set(data.notetags)]) {
      await d1("INSERT OR IGNORE INTO notetags (id, name) VALUES (?, ?)", [crypto.randomUUID(), name]);
      await d1("INSERT OR IGNORE INTO note_notetags (note_id, notetag_id) SELECT ?, id FROM notetags WHERE name = ?", [id, name]);
    }
    return { id };
  });

export const toggleLike = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ noteId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { d1, requireUserId } = await import("./d1.server");
    const userId = await requireUserId(getRequest());
    const existing = await d1("SELECT 1 FROM likes WHERE user_id = ? AND note_id = ?", [userId, data.noteId]);
    if (existing.length) await d1("DELETE FROM likes WHERE user_id = ? AND note_id = ?", [userId, data.noteId]);
    else await d1("INSERT INTO likes (user_id, note_id) SELECT ?, id FROM notes WHERE id = ? AND status = 'published'", [userId, data.noteId]);
    return { liked: !existing.length };
  });

export const addGuestnote = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ notepageId: z.string().uuid(), body: z.string().trim().min(1).max(1000) }).parse(d))
  .handler(async ({ data }) => {
    const { d1, requireUserId, ensureProfile, clerkUserInfo } = await import("./d1.server");
    const userId = await requireUserId(getRequest());
    await ensureProfile(userId);
    const info = await clerkUserInfo(userId);
    const id = crypto.randomUUID();
    await d1("INSERT INTO guestnotes (id, notepage_id, author_id, author_name, body) SELECT ?, id, ?, ?, ? FROM notepages WHERE id = ?", [
      id, userId, info.name, data.body, data.notepageId,
    ]);
    return { id };
  });
