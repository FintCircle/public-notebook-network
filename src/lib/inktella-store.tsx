import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { notepages, notes, type Note, type Notepage } from "@/data/inktella";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export async function coverUrl(path: string | null) {
  if (!path) return undefined;
  const { data } = await supabase.storage.from("covers").createSignedUrl(path, 60 * 60 * 24 * 7);
  return data?.signedUrl;
}

/** Loads all public Notepages + notes (and the signed-in user's drafts) into the shared arrays. */
export async function hydrateInktella() {
  const [{ data: pages }, { data: rows }, { data: profiles }, { data: tags }, { data: likes }] =
    await Promise.all([
      supabase.from("notepages").select("*").order("created_at"),
      supabase.from("notes").select("*").order("published_at", { ascending: false }),
      supabase.from("profiles").select("*"),
      supabase.from("note_notetags").select("note_id, notetags(name)"),
      supabase.from("likes").select("note_id, user_id"),
    ]);
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
  const slugById = new Map<string, string>();

  const mappedPages: Notepage[] = await Promise.all(
    (pages ?? []).map(async (p) => {
      slugById.set(p.id, p.slug);
      const owner = profileById.get(p.owner_id);
      const cover = await coverUrl(p.cover_path);
      const ownerName = owner?.display_name || "Someone";
      return {
        id: p.id,
        ownerId: p.owner_id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        owner: ownerName,
        ownerBio: owner?.bio ?? "",
        avatarInitial: ownerName.charAt(0).toUpperCase(),
        portrait: owner?.portrait_url ?? "",
        country: owner?.country ?? "",
        countryCode: owner?.country_code ?? "",
        interests: owner?.interests ?? [],
        links: (owner?.links as Array<{ label: string; href: string }> | null) ?? [],
        theme: { bg: p.bg, ink: p.ink, accent: p.accent, heading: p.heading_font, body: p.body_font, hand: p.hand_font },
        appearance: {
          backgroundType: cover ? "image" : "color",
          ...(cover ? { backgroundImage: cover } : {}),
          backgroundColor: p.bg,
          backgroundPosition: "center",
          overlayOpacity: 0.28,
        },
        header: { navLabel: p.name, eyebrow: ownerName, title: p.name, description: p.description },
      };
    }),
  );

  const tagsByNote = new Map<string, string[]>();
  for (const t of tags ?? []) {
    const name = (t.notetags as { name: string } | null)?.name;
    if (name) tagsByNote.set(t.note_id, [...(tagsByNote.get(t.note_id) ?? []), name]);
  }
  const likesByNote = new Map<string, string[]>();
  for (const l of likes ?? []) likesByNote.set(l.note_id, [...(likesByNote.get(l.note_id) ?? []), l.user_id]);

  const mappedNotes: Note[] = (rows ?? []).map((n) => {
    const when = n.published_at ?? n.created_at;
    const likedBy = likesByNote.get(n.id) ?? [];
    return {
      id: n.id,
      notepage: slugById.get(n.notepage_id) ?? "",
      title: n.title,
      date: formatDate(when),
      publishedAt: when,
      preview: n.preview,
      html: n.html,
      notetags: tagsByNote.get(n.id) ?? [],
      likes: likedBy.length,
      likedBy,
      status: n.status === "published" ? "published" : "draft",
    };
  });

  notepages.splice(0, notepages.length, ...mappedPages);
  // Public lists only show published notes; drafts stay reachable through myDrafts().
  notes.splice(0, notes.length, ...mappedNotes);
}

type StoreValue = { ready: boolean; version: number; refresh: () => Promise<void> };
const StoreContext = createContext<StoreValue>({ ready: false, version: 0, refresh: async () => {} });

export function InktellaStoreProvider({ children, userId }: { children: ReactNode; userId: string | null }) {
  const [ready, setReady] = useState(false);
  const [version, setVersion] = useState(0);

  const refresh = useCallback(async () => {
    try {
      await hydrateInktella();
    } finally {
      setVersion((v) => v + 1);
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh, userId]);

  return (
    <StoreContext.Provider value={{ ready, version, refresh }}>
      {ready ? (
        <div key={version} className="contents">{children}</div>
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
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}
