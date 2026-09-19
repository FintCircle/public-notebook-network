import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { notes } from "@/data/inktella";

export const Route = createFileRoute("/notetags/")({
  head: () => ({
    meta: [
      { title: "Topics | Inktella" },
      {
        name: "description",
        content: "Follow shared Notetags across public notebooks on Inktella.",
      },
      { property: "og:title", content: "Topics | Inktella" },
      {
        property: "og:description",
        content: "Follow shared Notetags across public notebooks on Inktella.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Notetags,
});

const starterTopics = [
  "Life",
  "Writing",
  "Technology",
  "Programming",
  "Artificial Intelligence",
  "Business",
  "Startups",
  "Money",
  "Work & Careers",
  "Self-Improvement",
  "Productivity",
  "Relationships",
  "Family & Parenting",
  "Health & Wellness",
  "Psychology",
  "Education",
  "Science",
  "Culture",
  "Society",
  "Politics",
  "History",
  "Philosophy",
  "Books",
  "Poetry",
  "Fiction",
  "Art",
  "Design",
  "Photography",
  "Music",
  "Film & TV",
  "Fashion",
  "Food",
  "Travel",
  "Sports",
  "Gaming",
  "Nature & Environment",
  "Spirituality & Religion",
  "Humor",
  "Creativity",
  "Personal Stories",
];

function Notetags() {
  const [following, setFollowing] = useState<string[]>([]);
  const topics = useMemo(() => {
    const stats = new Map(
      starterTopics.map((topic) => [topic, { notes: 0, people: new Set<string>() }]),
    );
    for (const note of notes) {
      for (const tag of note.notetags) {
        const key = starterTopics.find((topic) => topic.toLowerCase() === tag.toLowerCase()) ?? tag;
        const current = stats.get(key) ?? { notes: 0, people: new Set<string>() };
        current.notes += 1;
        current.people.add(note.notepage);
        stats.set(key, current);
      }
    }
    return [...stats.entries()].sort((a, b) => b[1].notes - a[1].notes || a[0].localeCompare(b[0]));
  }, []);

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-5 py-12">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
            Explore together
          </p>
          <h1 className="mt-3 text-4xl tracking-tight">Topics</h1>
          <p className="hand mt-2 text-xl opacity-65">
            Find the conversations people are writing into.
          </p>
        </div>
        <div className="mt-10 divide-y divide-border/70 border-y border-border/70">
          {topics.map(([topic, stats]) => {
            const isFollowing = following.includes(topic);
            return (
              <div key={topic} className="flex items-center justify-between gap-4 py-4">
                <Link
                  to="/notetags/$tag"
                  params={{ tag: topic }}
                  className="min-w-0 flex-1 hover:underline"
                >
                  <span className="block truncate text-base font-medium">{topic}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {stats.notes} {stats.notes === 1 ? "note" : "notes"} · {stats.people.size}{" "}
                    {stats.people.size === 1 ? "person" : "people"}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    setFollowing((current) =>
                      isFollowing ? current.filter((item) => item !== topic) : [...current, topic],
                    )
                  }
                  className="shrink-0 rounded-full border border-border px-4 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
