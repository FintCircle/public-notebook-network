import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { seedGuestnotes, seedNotes, seedNotepages, seedProfiles } from "@/data/seedData";

export const getClerkPublishableKey = createServerFn({ method: "GET" }).handler(async () => {
  const { CLERK_PUBLISHABLE_KEY_FALLBACK } = await import("./clerk-config");
  const fromEnv =
    process.env["CLERK_PUBLISHABLE_KEY"] ??
    (globalThis as { __env__?: Record<string, unknown> }).__env__?.["CLERK_PUBLISHABLE_KEY"];
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

function getRawSeedData(me: string | null): RawData {
  const profiles = seedProfiles.map((p) => ({
    id: p.id,
    display_name: p.display_name,
    bio: p.bio,
    country: p.country,
    country_code: p.country_code,
    portrait_url: p.portrait_url,
    interests_json: p.interests_json,
    links_json: p.links_json,
    created_at: p.created_at,
  }));

  const notepages = seedNotepages.map((np) => ({
    id: np.id,
    owner_id: np.ownerId,
    slug: np.slug,
    name: np.name,
    description: np.description,
    cover_path: np.appearance.backgroundImage ?? null,
    bg: np.theme.bg,
    ink: np.theme.ink,
    accent: np.theme.accent ?? "#c2410c",
    heading_font: np.theme.heading,
    body_font: np.theme.body,
    hand_font: np.theme.hand,
    paid_until: "2030-01-01 00:00:00",
  }));

  const notes = seedNotes.map((n) => {
    const np = seedNotepages.find((p) => p.slug === n.notepage);
    return {
      id: n.id,
      notepage_id: np?.id ?? "",
      author_id: np?.ownerId ?? "",
      title: n.title,
      html: n.html,
      preview: n.preview,
      status: n.status,
      published_at: n.publishedAt,
      created_at: n.publishedAt,
      updated_at: n.publishedAt,
    };
  });

  const tags: Array<{ note_id: string; name: string }> = [];
  for (const n of seedNotes) {
    for (const tag of n.notetags) {
      tags.push({ note_id: n.id, name: tag });
    }
  }

  const likes: Array<{ note_id: string; user_id: string }> = [];
  for (const n of seedNotes) {
    for (const uid of n.likedBy) {
      likes.push({ note_id: n.id, user_id: uid });
    }
  }

  const guestnotes = seedGuestnotes.map((g) => ({
    id: g.id,
    notepage_id: g.notepageId,
    author_id: g.authorId,
    author_name: g.name,
    body: g.body,
    created_at: g.createdAt,
  }));

  return { notepages, notes, profiles, tags, likes, guestnotes, me };
}

async function autoSeedD1() {
  const { d1 } = await import("./d1.server");
  const existing = await d1<{ id: string }>("SELECT id FROM notepages LIMIT 1").catch(() => []);
  if (existing.length > 0) return;

  try {
    for (const p of seedProfiles) {
      await d1(
        "INSERT OR IGNORE INTO profiles (id, display_name, bio, country, country_code, portrait_url, interests_json, links_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          p.id,
          p.display_name,
          p.bio,
          p.country,
          p.country_code,
          p.portrait_url,
          p.interests_json,
          p.links_json,
          p.created_at,
        ],
      );
    }
    for (const np of seedNotepages) {
      await d1(
        "INSERT OR IGNORE INTO notepages (id, owner_id, slug, name, description, cover_path, bg, ink, accent, heading_font, body_font, hand_font, paid_until) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          np.id,
          np.ownerId,
          np.slug,
          np.name,
          np.description,
          np.appearance.backgroundImage ?? null,
          np.theme.bg,
          np.theme.ink,
          np.theme.accent ?? "#c2410c",
          np.theme.heading,
          np.theme.body,
          np.theme.hand,
          "2030-01-01 00:00:00",
        ],
      );
    }
    for (const note of seedNotes) {
      const np = seedNotepages.find((p) => p.slug === note.notepage);
      if (!np) continue;
      await d1(
        "INSERT OR IGNORE INTO notes (id, notepage_id, author_id, title, html, preview, status, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          note.id,
          np.id,
          np.ownerId,
          note.title,
          note.html,
          note.preview,
          note.status,
          note.publishedAt,
          note.publishedAt,
          note.publishedAt,
        ],
      );
      for (const tag of note.notetags) {
        const tagId = `tag_${tag}`;
        await d1("INSERT OR IGNORE INTO notetags (id, name) VALUES (?, ?)", [tagId, tag]);
        await d1(
          "INSERT OR IGNORE INTO note_notetags (note_id, notetag_id) SELECT ?, id FROM notetags WHERE name = ?",
          [note.id, tag],
        );
      }
      for (const uid of note.likedBy) {
        await d1("INSERT OR IGNORE INTO likes (user_id, note_id) VALUES (?, ?)", [uid, note.id]);
      }
    }
    for (const gn of seedGuestnotes) {
      await d1(
        "INSERT OR IGNORE INTO guestnotes (id, notepage_id, author_id, author_name, body, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        [gn.id, gn.notepageId, gn.authorId, gn.name, gn.body, gn.createdAt],
      );
    }
  } catch (e) {
    console.error("autoSeedD1 error:", e);
  }
}

export const loadInktella = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        name: z.string().max(120).optional(),
        imageUrl: z.string().url().startsWith("https://img.clerk.com/").max(2000).optional(),
      })
      .parse(d ?? {}),
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
      d1<{ note_id: string; name: string }>(
        "SELECT nn.note_id, t.name FROM note_notetags nn JOIN notetags t ON t.id = nn.notetag_id",
      ),
      d1<{ note_id: string; user_id: string }>("SELECT note_id, user_id FROM likes"),
      d1<Record<string, string | null>>("SELECT * FROM guestnotes ORDER BY created_at"),
    ]);
    return { notepages, notes, profiles, tags, likes, guestnotes, me };
  });

const fonts = ["Space Grotesk", "Instrument Serif", "Lora"] as const;

export const createNotepage = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        name: z.string().trim().min(2).max(80),
        description: z.string().trim().min(6).max(400),
        slug: z.string().regex(/^[a-z0-9-]{2,40}$/),
        bg: z.string().max(60),
        ink: z.string().max(60),
        headingFont: z.enum(fonts),
        coverUrl: z.string().max(2_000_000).startsWith("data:image/").optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { d1, requireUserId, ensureProfile } = await import("./d1.server");
    const userId = await requireUserId(getRequest());
    await ensureProfile(userId);
    const reserved = [
      "notella",
      "notepages",
      "notetags",
      "write",
      "sign-in",
      "about",
      "pricing",
      "privacy",
      "terms",
      "guidelines",
      "explore",
      "profile",
      "topics",
      "api",
    ];
    let slug = data.slug;
    if (
      reserved.includes(slug) ||
      (await d1("SELECT 1 FROM notepages WHERE slug = ?", [slug])).length
    ) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    }
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await d1(
      "INSERT INTO notepages (id, owner_id, slug, name, description, cover_path, bg, ink, heading_font, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        userId,
        slug,
        data.name,
        data.description,
        data.coverUrl ?? null,
        data.bg,
        data.ink,
        data.headingFont,
        now,
      ],
    );
    return { id, slug };
  });

export const saveNote = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        notepageSlug: z.string(),
        title: z.string().max(200),
        html: z.string().max(2_000_000),
        preview: z.string().max(400),
        notetags: z.array(z.string().regex(/^[a-z0-9-]{1,40}$/)).max(12),
        publish: z.boolean(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { d1, requireUserId } = await import("./d1.server");
    const userId = await requireUserId(getRequest());
    const [page] = await d1<{ id: string; owner_id: string }>(
      "SELECT id, owner_id FROM notepages WHERE slug = ?",
      [data.notepageSlug],
    );
    if (!page || page.owner_id !== userId) throw new Error("That Notepage isn't yours.");
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await d1(
      "INSERT INTO notes (id, notepage_id, author_id, title, html, preview, status, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        page.id,
        userId,
        data.title,
        data.html,
        data.preview,
        data.publish ? "published" : "draft",
        data.publish ? now : null,
        now,
        now,
      ],
    );
    for (const name of [...new Set(data.notetags)]) {
      await d1("INSERT OR IGNORE INTO notetags (id, name, created_at) VALUES (?, ?, ?)", [
        crypto.randomUUID(),
        name,
        now,
      ]);
      await d1(
        "INSERT OR IGNORE INTO note_notetags (note_id, notetag_id) SELECT ?, id FROM notetags WHERE name = ?",
        [id, name],
      );
    }
    return { id };
  });

export const toggleLike = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ noteId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { d1, requireUserId } = await import("./d1.server");
    const userId = await requireUserId(getRequest());
    const existing = await d1("SELECT 1 FROM likes WHERE user_id = ? AND note_id = ?", [
      userId,
      data.noteId,
    ]);
    if (existing.length)
      await d1("DELETE FROM likes WHERE user_id = ? AND note_id = ?", [userId, data.noteId]);
    else
      await d1(
        "INSERT INTO likes (user_id, note_id, created_at) SELECT ?, id, ? FROM notes WHERE id = ? AND status = 'published'",
        [userId, new Date().toISOString(), data.noteId],
      );
    return { liked: !existing.length };
  });

export const addGuestnote = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ notepageId: z.string().uuid(), body: z.string().trim().min(1).max(1000) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { d1, requireUserId, ensureProfile, clerkUserInfo } = await import("./d1.server");
    const userId = await requireUserId(getRequest());
    await ensureProfile(userId);
    const info = await clerkUserInfo(userId);
    const id = crypto.randomUUID();
    await d1(
      "INSERT INTO guestnotes (id, notepage_id, author_id, author_name, body, created_at) SELECT ?, id, ?, ?, ?, ? FROM notepages WHERE id = ?",
      [id, userId, info.name, data.body, new Date().toISOString(), data.notepageId],
    );
    return { id };
  });
