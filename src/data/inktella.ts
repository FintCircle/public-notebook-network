export const platformBackgroundColors = [
  { name: "Paper", value: "#f5f1e8" },
  { name: "Sky", value: "#dbeafe" },
  { name: "Sage", value: "#dce8d5" },
  { name: "Lavender", value: "#e8e0f2" },
  { name: "Peach", value: "#f8dfcf" },
  { name: "Ink", value: "#1f2933" },
] as const;

export type Notepage = {
  id: string;
  ownerId: string;
  slug: string;
  name: string;
  description: string;
  owner: string;
  ownerBio: string;
  avatarInitial: string;
  portrait: string;
  country: string;
  countryCode: string;
  interests: string[];
  links: Array<{ label: string; href: string }>;
  theme: {
    bg: string;
    ink: string;
    accent?: string;
    heading: string;
    body: string;
    hand: string;
  };
  appearance: {
    backgroundType: "image" | "color";
    backgroundImage?: string;
    backgroundColor: string;
    backgroundPosition: string;
    overlayOpacity: number;
  };
  header: {
    navLabel: string;
    eyebrow: string;
    title: string;
    description: string;
  };
};

export type Note = {
  id: string;
  notepage: string;
  title: string;
  date: string;
  publishedAt: string;
  preview: string;
  html: string;
  notetags: string[];
  likes: number;
  likedBy: string[];
  status: "draft" | "published";
};

// Live data: filled from Lovable Cloud by hydrateInktella() (src/lib/inktella-store.ts).
export const notepages: Notepage[] = [];
export const notes: Note[] = [];

export const interests = [
  "Technology",
  "Building",
  "Design",
  "Books",
  "Life",
  "Travel",
  "Photography",
  "Startups",
  "Writing",
  "Music",
  "Uganda",
  "Culture",
  "Personal stories",
];

export function getNotepage(slug: string) {
  return notepages.find((n) => n.slug === slug);
}

export function notesOf(slug: string) {
  return notes
    .filter((n) => n.notepage === slug)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getNote(notepage: string, id: string) {
  return notes.find((n) => n.notepage === notepage && n.id === id);
}

export function notesByTag(tag: string, notepage?: string) {
  return notes
    .filter((n) => n.notetags.includes(tag) && (!notepage || n.notepage === notepage))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function allNotetags() {
  const counts = new Map<string, number>();
  for (const note of notes) {
    for (const tag of note.notetags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

export function getPopularDecayedNotes(limit = 6) {
  const now = Date.now();
  const scored = notes.map((note) => {
    const pubStr = note.publishedAt;
    const pub = new Date(
      pubStr?.includes("T") ? pubStr : `${pubStr?.replace(" ", "T") || ""}Z`,
    ).getTime();
    const ageInHours = isNaN(pub) ? 0 : Math.max(0, (now - pub) / (1000 * 60 * 60));
    const score = (note.likes + 1) / Math.pow(ageInHours + 2, 1.5);
    return { note, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.note);
}

export function notepageAppearance(np: Notepage): Notepage["appearance"] {
  return {
    backgroundType: np.appearance?.backgroundType ?? "color",
    backgroundImage: np.appearance?.backgroundImage ?? np.portrait,
    backgroundColor: np.appearance?.backgroundColor ?? np.theme.bg,
    backgroundPosition: np.appearance?.backgroundPosition ?? "center",
    overlayOpacity: np.appearance?.overlayOpacity ?? 0.28,
  };
}

export function themeStyle(np: Notepage): React.CSSProperties {
  const appearance = notepageAppearance(np);
  return {
    ["--np-bg" as string]: np.theme.bg,
    ["--np-ink" as string]: np.theme.ink,
    ["--np-accent" as string]: np.theme.accent ?? "#c2410c",
    ["--np-heading" as string]: np.theme.heading,
    ["--np-body" as string]: np.theme.body,
    ["--np-hand" as string]: np.theme.hand,
    ["--np-background-color" as string]: appearance.backgroundColor,
    ["--np-background-position" as string]: appearance.backgroundPosition,
    ["--np-overlay-opacity" as string]: appearance.overlayOpacity,
  };
}
