import type { Note, Notepage } from "./inktella";

export const seedProfiles = [
  {
    id: "usr_derrick_01",
    display_name: "Derrick Katungi",
    bio: "Founder of Inktella. Building Pangisa. Thinking out loud about software, typography, and living in Kampala, Uganda.",
    country: "Uganda",
    country_code: "UG",
    portrait_url:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
    interests_json: JSON.stringify(["Technology", "Building", "Design", "Uganda", "Startups"]),
    links_json: JSON.stringify([
      { label: "Website", href: "https://derrickkatungi.com" },
      { label: "Twitter", href: "https://x.com/derrickkatungi" },
    ]),
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "usr_amara_02",
    display_name: "Amara Chen",
    bio: "Game designer & indie photographer living in Nairobi. Exploring slow software, pixel art, and morning walks.",
    country: "Kenya",
    country_code: "KE",
    portrait_url:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80",
    interests_json: JSON.stringify(["Design", "Photography", "Books", "Life", "Music"]),
    links_json: JSON.stringify([
      { label: "Portfolio", href: "https://amarachen.design" },
      { label: "Photos", href: "https://unsplash.com/@amara" },
    ]),
    created_at: "2026-09-02T09:00:00Z",
  },
  {
    id: "usr_joel_03",
    display_name: "Joel M",
    bio: "Software developer exploring decentralized web and photography.",
    country: "Uganda",
    country_code: "UG",
    portrait_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
    interests_json: JSON.stringify(["Technology", "Building"]),
    links_json: "[]",
    created_at: "2026-09-03T10:00:00Z",
  },
  {
    id: "usr_sarah_04",
    display_name: "Sarah W",
    bio: "Illustrator and storyteller.",
    country: "Kenya",
    country_code: "KE",
    portrait_url:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
    interests_json: JSON.stringify(["Design", "Writing"]),
    links_json: "[]",
    created_at: "2026-09-04T11:00:00Z",
  },
];

export const seedNotepages: Notepage[] = [
  {
    id: "np_derrick_01",
    ownerId: "usr_derrick_01",
    slug: "derrick",
    name: "Derrick's Notes",
    description: "Thoughts, things I'm building, and whatever else ends up here.",
    owner: "Derrick Katungi",
    ownerBio:
      "Founder of Inktella. Building Pangisa. Thinking out loud about software, typography, and living in Kampala, Uganda.",
    avatarInitial: "D",
    portrait:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
    country: "Uganda",
    countryCode: "UG",
    interests: ["Technology", "Building", "Design", "Uganda", "Startups"],
    links: [
      { label: "Website", href: "https://derrickkatungi.com" },
      { label: "Twitter", href: "https://x.com/derrickkatungi" },
    ],
    theme: {
      bg: "#f5f1e8",
      ink: "#1f2933",
      accent: "#c2410c",
      heading: "Space Grotesk",
      body: "DM Sans",
      hand: "Caveat",
    },
    appearance: {
      backgroundType: "image",
      backgroundImage:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
      backgroundColor: "#f5f1e8",
      backgroundPosition: "center",
      overlayOpacity: 0.28,
    },
    header: {
      navLabel: "Derrick's Notes",
      eyebrow: "Derrick Katungi",
      title: "Derrick's Notes",
      description: "Thoughts, things I'm building, and whatever else ends up here.",
    },
  },
  {
    id: "np_amara_02",
    ownerId: "usr_amara_02",
    slug: "amara",
    name: "Amara's Notebook",
    description: "Wandering through games, morning walks, and quiet design observations.",
    owner: "Amara Chen",
    ownerBio:
      "Game designer & indie photographer living in Nairobi. Exploring slow software, pixel art, and morning walks.",
    avatarInitial: "A",
    portrait:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80",
    country: "Kenya",
    countryCode: "KE",
    interests: ["Design", "Photography", "Books", "Life", "Music"],
    links: [
      { label: "Portfolio", href: "https://amarachen.design" },
      { label: "Photos", href: "https://unsplash.com/@amara" },
    ],
    theme: {
      bg: "#dce8d5",
      ink: "#1f2933",
      accent: "#15803d",
      heading: "Lora",
      body: "DM Sans",
      hand: "Caveat",
    },
    appearance: {
      backgroundType: "image",
      backgroundImage:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      backgroundColor: "#dce8d5",
      backgroundPosition: "center",
      overlayOpacity: 0.28,
    },
    header: {
      navLabel: "Amara's Notebook",
      eyebrow: "Amara Chen",
      title: "Amara's Notebook",
      description: "Wandering through games, morning walks, and quiet design observations.",
    },
  },
];

export const seedNotes: Note[] = [
  {
    id: "note_derrick_1",
    notepage: "derrick",
    title: "I keep rebuilding things",
    date: "17 September 2026",
    publishedAt: "2026-09-17T10:00:00Z",
    preview:
      "Maybe rebuilding isn't starting over. Sometimes the first version only exists to show you what you actually wanted.",
    html: "<p>Maybe rebuilding isn't starting over. Sometimes the first version only exists to show you what you actually wanted.</p><p>I have done this with almost every project I've built. First comes the complex version with endless options, dashboards, and settings. Then comes the realization that nobody—including myself—actually wanted all that noise.</p><blockquote><p>Simplification is not the lack of features. It is the clarity of purpose.</p></blockquote><p>When we started working on Inktella, we almost made it another blogging tool. But then we remembered why people keep physical paper notebooks: because they're personal, quiet, and imperfect.</p>",
    notetags: ["building", "thoughts"],
    likes: 12,
    likedBy: ["usr_amara_02", "usr_joel_03"],
    status: "published",
  },
  {
    id: "note_derrick_2",
    notepage: "derrick",
    title: "Something I noticed today",
    date: "15 September 2026",
    publishedAt: "2026-09-15T14:30:00Z",
    preview: "I think we've made personal websites far too serious.",
    html: "<p>I think we've made personal websites far too serious.</p><p>Everyone's home page looks like an enterprise SaaS landing page now. Hero headings, feature grids, logos of companies they once talked to, and newsletter popups before you can read a single sentence.</p><p>What happened to just writing down something you saw on your walk?</p>",
    notetags: ["web", "thingsinotice"],
    likes: 8,
    likedBy: ["usr_amara_02"],
    status: "published",
  },
  {
    id: "note_derrick_3",
    notepage: "derrick",
    title: "Why small teams move faster",
    date: "10 September 2026",
    publishedAt: "2026-09-10T09:15:00Z",
    preview: "When communication bandwidth is tight, momentum stays high.",
    html: "<p>When communication bandwidth is tight, momentum stays high.</p><p>Two people who trust each other's taste don't need wireframes or product spec documents for every small UI tweak. They just build it, look at it, and fix what feels wrong.</p>",
    notetags: ["startups", "building"],
    likes: 15,
    likedBy: ["usr_joel_03", "usr_sarah_04"],
    status: "published",
  },
  {
    id: "note_amara_1",
    notepage: "amara",
    title: "Maybe I don't hate mornings",
    date: "18 September 2026",
    publishedAt: "2026-09-18T07:20:00Z",
    preview:
      "I started walking before work this week. Something about watching the coffee shops slowly open in Nairobi...",
    html: "<p>I started walking before work this week. Something about watching the coffee shops slowly open in Nairobi...</p><p>For years I convinced myself I was strictly a night owl. But early morning light through jacaranda trees has a kind of stillness you can't buy at 1:00 AM.</p><p>I brought a tiny paper pocketbook and wrote three sentences while waiting for my coffee.</p>",
    notetags: ["life", "thoughts"],
    likes: 18,
    likedBy: ["usr_derrick_01", "usr_sarah_04"],
    status: "published",
  },
  {
    id: "note_amara_2",
    notepage: "amara",
    title: "Designing small games",
    date: "12 September 2026",
    publishedAt: "2026-09-12T16:45:00Z",
    preview: "The second version taught me something the first never could.",
    html: '<p>When building tiny games, the temptation to add extra mechanics is overwhelming. You think: <em>"What if the player had a grappling hook? What if there were skill trees?"</em></p><p>Then you strip it all away and leave only one core movement. Suddenly the game has a soul.</p>',
    notetags: ["design", "building"],
    likes: 22,
    likedBy: ["usr_derrick_01", "usr_joel_03"],
    status: "published",
  },
  {
    id: "note_amara_3",
    notepage: "amara",
    title: "Books on my wooden table",
    date: "5 September 2026",
    publishedAt: "2026-09-05T11:00:00Z",
    preview: "Physical books don't send notifications. They just sit there patiently.",
    html: "<p>Physical books don't send notifications. They just sit there patiently waiting for you.</p><p>Currently re-reading <em>The Architecture of Happiness</em>. It's gentle and reminds me why spaces shape our minds.</p>",
    notetags: ["books", "life"],
    likes: 9,
    likedBy: ["usr_sarah_04"],
    status: "published",
  },
];

export const seedGuestnotes = [
  {
    id: "gn_derrick_1",
    notepageId: "np_derrick_01",
    authorId: "usr_amara_02",
    name: "Amara Chen",
    portrait:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80",
    body: "Love the quiet tone of this notebook, Derrick! Rebuilding really is just distilling down to what matters.",
    createdAt: "2026-09-17T12:00:00Z",
  },
  {
    id: "gn_derrick_2",
    notepageId: "np_derrick_01",
    authorId: "usr_joel_03",
    name: "Joel M",
    portrait:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
    body: "That note on personal websites hit home. We need more spaces like Inktella!",
    createdAt: "2026-09-16T08:45:00Z",
  },
  {
    id: "gn_amara_1",
    notepageId: "np_amara_02",
    authorId: "usr_derrick_01",
    name: "Derrick Katungi",
    portrait:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
    body: "The light in Nairobi early morning really is something special. Great to read your notes, Amara!",
    createdAt: "2026-09-18T09:30:00Z",
  },
  {
    id: "gn_amara_2",
    notepageId: "np_amara_02",
    authorId: "usr_sarah_04",
    name: "Sarah W",
    portrait:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
    body: "Your note on small game design resonated so much with my work in illustration!",
    createdAt: "2026-09-13T14:10:00Z",
  },
];
