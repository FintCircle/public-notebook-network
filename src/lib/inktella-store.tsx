import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { notepages, notes, type Note, type Notepage } from "@/data/inktella";
import { loadInktella } from "@/lib/inktella.functions";

export type Guestnote = {
  id: string;
  notepageId: string;
  authorId: string;
  name: string;
  portrait?: string;
  body: string;
  createdAt: string;
};
export const guestnotes: Guestnote[] = [];
export let currentUserId: string | null = null;

function formatDate(iso: string) {
  return new Date(iso.includes("T") ? iso : `${iso.replace(" ", "T")}Z`).toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "long", year: "numeric" },
  );
}
const s = (v: string | null | undefined) => v ?? "";
function parseJson<T>(v: string | null | undefined, fallback: T): T {
  try {
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function hydrateInktella() {
  // The signed-in person's own name/photo, used to create their profile on first visit.
  const clerkUser = (
    globalThis as {
      Clerk?: {
        user?: {
          fullName?: string | null;
          username?: string | null;
          imageUrl?: string;
          hasImage?: boolean;
        } | null;
      };
    }
  ).Clerk?.user;
  const hint = clerkUser
    ? {
        ...(clerkUser.fullName || clerkUser.username
          ? { name: (clerkUser.fullName || clerkUser.username) as string }
          : {}),
        ...(clerkUser.hasImage && clerkUser.imageUrl?.startsWith("https://img.clerk.com/")
          ? { imageUrl: clerkUser.imageUrl }
          : {}),
      }
    : {};
  const raw = await loadInktella({ data: hint });
  currentUserId = raw.me;
  const profileById = new Map(raw.profiles.map((p) => [s(p["id"]), p]));
  const slugById = new Map<string, string>();

  const mappedPages: Notepage[] = raw.notepages.map((p) => {
    const id = s(p["id"]);
    slugById.set(id, s(p["slug"]));
    const owner = profileById.get(s(p["owner_id"]));
    const ownerName = s(owner?.["display_name"]) || "Someone";
    const cover = p["cover_path"] ?? p["cover_url"] ?? undefined;
    return {
      id,
      ownerId: s(p["owner_id"]),
      slug: s(p["slug"]),
      name: s(p["name"]),
      description: s(p["description"]),
      owner: ownerName,
      ownerBio: s(owner?.["bio"]),
      avatarInitial: ownerName.charAt(0).toUpperCase(),
      portrait: s(owner?.["portrait_url"]),
      country: s(owner?.["country"]),
      countryCode: s(owner?.["country_code"]),
      interests: parseJson<string[]>(owner?.["interests"], []),
      links: parseJson<Array<{ label: string; href: string }>>(owner?.["links"], []),
      theme: {
        bg: s(p["bg"]),
        ink: s(p["ink"]),
        accent: s(p["accent"]),
        heading: s(p["heading_font"]),
        body: s(p["body_font"]),
        hand: s(p["hand_font"]),
      },
      appearance: {
        backgroundType: cover ? "image" : "color",
        ...(cover ? { backgroundImage: cover } : {}),
        backgroundColor: s(p["bg"]),
        backgroundPosition: "center",
        overlayOpacity: 0.28,
      },
      header: {
        navLabel: s(p["name"]),
        eyebrow: ownerName,
        title: s(p["name"]),
        description: s(p["description"]),
      },
    };
  });

  const tagsByNote = new Map<string, string[]>();
  for (const t of raw.tags)
    tagsByNote.set(t.note_id, [...(tagsByNote.get(t.note_id) ?? []), t.name]);
  const likesByNote = new Map<string, string[]>();
  for (const l of raw.likes)
    likesByNote.set(l.note_id, [...(likesByNote.get(l.note_id) ?? []), l.user_id]);

  const mappedNotes: Note[] = raw.notes.map((n) => {
    const when = s(n["published_at"]) || s(n["created_at"]);
    const likedBy = likesByNote.get(s(n["id"])) ?? [];
    return {
      id: s(n["id"]),
      notepage: slugById.get(s(n["notepage_id"])) ?? "",
      title: s(n["title"]),
      date: formatDate(when),
      publishedAt: when,
      preview: s(n["preview"]),
      html: s(n["html"]),
      notetags: tagsByNote.get(s(n["id"])) ?? [],
      likes: likedBy.length,
      likedBy,
      status: n["status"] === "published" ? "published" : "draft",
    };
  });

  const mappedGuestnotes: Guestnote[] = raw.guestnotes.map((g) => {
    const author = profileById.get(s(g["author_id"]));
    return {
      id: s(g["id"]),
      notepageId: s(g["notepage_id"]),
      authorId: s(g["author_id"]),
      name: s(g["author_name"]) || s(author?.["display_name"]) || "A reader",
      ...(author?.["portrait_url"] ? { portrait: s(author["portrait_url"]) } : {}),
      body: s(g["body"]),
      createdAt: s(g["created_at"]),
    };
  });

  notepages.splice(0, notepages.length, ...mappedPages);
  // Public lists read `notes`; drafts are only included for their author and filtered out of public views.
  notes.splice(0, notes.length, ...mappedNotes.filter((n) => n.status === "published"));
  drafts.splice(0, drafts.length, ...mappedNotes.filter((n) => n.status === "draft"));
  guestnotes.splice(0, guestnotes.length, ...mappedGuestnotes);
}

export const drafts: Note[] = [];

export function myNotepages() {
  return currentUserId ? notepages.filter((p) => p.ownerId === currentUserId) : [];
}

type StoreValue = { ready: boolean; version: number; refresh: () => Promise<void> };
const StoreContext = createContext<StoreValue>({
  ready: false,
  version: 0,
  refresh: async () => {},
});

export function InktellaStoreProvider({
  children,
  userKey,
}: {
  children: ReactNode;
  userKey: string | null;
}) {
  const [ready, setReady] = useState(false);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      await hydrateInktella();
      setError("");
    } catch (e) {
      console.error(e);
      setError("The notebooks couldn't be opened right now.");
    } finally {
      setVersion((v) => v + 1);
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh, userKey]);

  return (
    <StoreContext.Provider value={{ ready, version, refresh }}>
      {ready ? (
        <div key={version} className="contents">
          {error && (
            <p
              role="alert"
              className="bg-destructive px-4 py-2 text-center text-sm text-destructive-foreground"
            >
              {error}
            </p>
          )}
          {children}
        </div>
      ) : (
        <div className="flex min-h-screen items-center justify-center">
          <p className="hand text-2xl opacity-50">opening the notebooks…</p>
        </div>
      )}
    </StoreContext.Provider>
  );
}

export function useInktellaStore() {
  return useContext(StoreContext);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}
