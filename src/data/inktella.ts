import amaraPortrait from "@/assets/amara-portrait.jpg";
import derrickPortrait from "@/assets/derrick-portrait.jpg";
import joelPortrait from "@/assets/joel-portrait.jpg";

export type Notepage = {
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
};

export const notepages: Notepage[] = [
  {
    slug: "derrick",
    name: "Derrick's Notes",
    description: "Thoughts, things I'm building, and whatever else ends up here.",
    owner: "Derrick Mbabazi",
    ownerBio:
      "I like building small things on the web and writing down what I discover along the way. Sometimes it’s something I learned. Other times it’s simply something I don’t want to forget.",
    avatarInitial: "D",
    portrait: derrickPortrait,
    country: "Uganda",
    countryCode: "UG",
    interests: ["building", "web", "writing", "domains"],
    links: [
      { label: "Website", href: "https://example.com" },
      { label: "GitHub", href: "https://github.com" },
    ],
    theme: {
      bg: "oklch(0.975 0.012 90)",
      ink: "oklch(0.21 0.015 60)",
      heading: '"Space Grotesk", sans-serif',
      body: '"DM Sans", sans-serif',
      hand: '"Caveat", cursive',
    },
    appearance: {
      backgroundType: "image",
      backgroundImage: derrickPortrait,
      backgroundColor: "#d8c9b6",
      backgroundPosition: "center",
      overlayOpacity: 0.2,
    },
    header: {
      navLabel: "Derrick's Notes",
      eyebrow: "the notebook entries",
      title: "Notes from Derrick Mbabazi",
      description: "Thoughts, things I'm building, and whatever else ends up here.",
    },
  },
  {
    slug: "amara",
    name: "Things I Notice",
    description: "Small observations, mostly about mornings.",
    owner: "Amara",
    ownerBio: "Walks a lot. Notices more than she needs to.",
    avatarInitial: "A",
    portrait: amaraPortrait,
    country: "Uganda",
    countryCode: "UG",
    interests: ["walking", "mornings", "games", "small observations"],
    links: [{ label: "Website", href: "https://example.com" }],
    theme: {
      bg: "oklch(0.96 0.018 220)",
      ink: "oklch(0.2 0.02 250)",
      heading: '"Instrument Serif", serif',
      body: '"DM Sans", sans-serif',
      hand: '"Gloria Hallelujah", cursive',
    },
    appearance: {
      backgroundType: "image",
      backgroundImage: amaraPortrait,
      backgroundColor: "#b7c7cb",
      backgroundPosition: "center",
      overlayOpacity: 0.3,
    },
    header: {
      navLabel: "Things I Notice",
      eyebrow: "the notebook entries",
      title: "Notes from Amara",
      description: "Small observations, mostly about mornings.",
    },
  },
  {
    slug: "joel",
    name: "Joel, rebuilding",
    description: "Notes from the second attempt.",
    owner: "Joel",
    ownerBio: "Rewrites authentication for fun. Not proud of it.",
    avatarInitial: "J",
    portrait: joelPortrait,
    country: "Uganda",
    countryCode: "UG",
    interests: ["software", "systems", "building", "second attempts"],
    links: [{ label: "GitHub", href: "https://github.com" }],
    theme: {
      bg: "oklch(0.94 0.008 120)",
      ink: "oklch(0.19 0.02 150)",
      heading: '"Space Grotesk", sans-serif',
      body: '"Lora", serif',
      hand: '"Caveat", cursive',
    },
    appearance: {
      backgroundType: "image",
      backgroundImage: joelPortrait,
      backgroundColor: "#b8c1af",
      backgroundPosition: "center",
      overlayOpacity: 0.24,
    },
    header: {
      navLabel: "Joel, rebuilding",
      eyebrow: "the notebook entries",
      title: "Notes from Joel",
      description: "Notes from the second attempt.",
    },
  },
];

export const notes: Note[] = [
  {
    id: "note-rebuilding",
    notepage: "derrick",
    title: "I keep rebuilding things",
    date: "17 September 2026",
    publishedAt: "2026-09-17",
    preview:
      "Maybe rebuilding isn't starting over. Sometimes the first version only exists to show you what you actually wanted.",
    html: `<p>Maybe rebuilding isn't starting over.</p><p>Sometimes the first version only exists to show you what you actually wanted.</p><p>I have done this with almost every project I've built. I get to the point where the thing works, and then I notice the shape of it is wrong — not broken, just not mine.</p><blockquote>The first version is the question. The second one is the answer.</blockquote><p>So I start again, and it takes a week instead of three months, because I already know what I'm doing.</p>`,
    notetags: ["building", "thoughts"],
    likes: 12,
  },
  {
    id: "note-too-serious",
    notepage: "derrick",
    title: "Something I noticed today",
    date: "15 September 2026",
    publishedAt: "2026-09-15",
    preview: "I think we've made personal websites far too serious.",
    html: `<p>I think we've made personal websites far too serious.</p><p>Everything has a hero section now. Everything has a value proposition. Somewhere along the way a page about yourself became a pitch.</p><p>I miss pages that were just… pages.</p>`,
    notetags: ["web", "thingsinotice"],
    likes: 4,
  },
  {
    id: "note-simplifying",
    notepage: "derrick",
    title: "Why I'm simplifying Pangisa",
    date: "12 September 2026",
    publishedAt: "2026-09-12",
    preview:
      "Half the features existed because I was scared people would think it was too small.",
    html: `<p>Half the features existed because I was scared people would think it was too small.</p><p>That is a bad reason to build anything. So this week I deleted a lot: three dashboards, a settings page nobody opened, and an onboarding flow that explained things the product should have explained itself.</p><ul><li>Fewer screens</li><li>Fewer decisions</li><li>Fewer things to maintain at 1am</li></ul><p>It feels lighter already.</p>`,
    notetags: ["building"],
    likes: 9,
  },
  {
    id: "note-nobody-asked",
    notepage: "derrick",
    title: "Building something nobody asked for",
    date: "3 September 2026",
    publishedAt: "2026-09-03",
    preview: "Nobody asked for this. I'm building it anyway, and that's allowed.",
    html: `<p>Nobody asked for this. I'm building it anyway, and that's allowed.</p><p>There's a version of making things where you only start after the demand is proven. I understand it. I just don't think it's the only way, and I don't think it's how most good things started.</p>`,
    notetags: ["building", "thoughts"],
    likes: 21,
  },
  {
    id: "note-mornings",
    notepage: "amara",
    title: "Maybe I don't hate mornings",
    date: "16 September 2026",
    publishedAt: "2026-09-16",
    preview:
      "I started walking before work this week. Something about watching the shops slowly open...",
    html: `<p>I started walking before work this week.</p><p>Something about watching the shops slowly open — the shutters, the chairs coming out, someone sweeping the same square of pavement they swept yesterday.</p><p>I think I hated waking up, not mornings.</p>`,
    notetags: ["life", "thoughts"],
    likes: 18,
  },
  {
    id: "note-tiny-game",
    notepage: "amara",
    title: "Building my first tiny game",
    date: "9 September 2026",
    publishedAt: "2026-09-09",
    preview: "It has one level and one enemy and I love it more than my job.",
    html: `<p>It has one level and one enemy and I love it more than my job.</p><p>The enemy is a square. The square follows you. That's the whole game. My nephew played it for eleven minutes.</p>`,
    notetags: ["building", "life"],
    likes: 6,
  },
  {
    id: "note-twice",
    notepage: "joel",
    title: "Building the same thing twice",
    date: "14 September 2026",
    publishedAt: "2026-09-14",
    preview: "The second version taught me something the first never could...",
    html: `<p>The second version taught me something the first never could.</p><p>Not because I was smarter. Because I was no longer guessing about the parts I had already lived with.</p>`,
    notetags: ["building"],
    likes: 7,
  },
  {
    id: "note-auth",
    notepage: "joel",
    title: "What I learned rebuilding authentication",
    date: "5 September 2026",
    publishedAt: "2026-09-05",
    preview: "Mostly that I should not have rebuilt authentication.",
    html: `<p>Mostly that I should not have rebuilt authentication.</p><p>But also: sessions are a state machine, and pretending otherwise is how you end up with users logged into accounts that no longer exist.</p>`,
    notetags: ["building", "web"],
    likes: 11,
  },
];

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
    ["--np-heading" as string]: np.theme.heading,
    ["--np-body" as string]: np.theme.body,
    ["--np-hand" as string]: np.theme.hand,
    ["--np-background-color" as string]: appearance.backgroundColor,
    ["--np-background-position" as string]: appearance.backgroundPosition,
    ["--np-overlay-opacity" as string]: appearance.overlayOpacity,
  };
}
