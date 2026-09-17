import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { allNotetags, notepages, notesOf } from "@/data/inktella";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore notebooks and Notetags | Inktella" },
      {
        name: "description",
        content:
          "Wander through public notebooks and follow Notetags across the Tellaverse.",
      },
      { property: "og:title", content: "Explore notebooks and Notetags on Inktella" },
      {
        property: "og:description",
        content: "Wander through people's public notebooks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Explore,
});

function Explore() {
  const tags = allNotetags();

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-2xl px-5 py-14">
        <h1 className="text-xs tracking-[0.24em] uppercase opacity-50">Explore</h1>
        <p className="hand mt-2 text-2xl opacity-70">wander around</p>

        <div className="mt-10">
          <label className="sr-only" htmlFor="search">
            Search people, Notepages, Notes and Notetags
          </label>
          <input
            id="search"
            type="search"
            placeholder="people, notepages, notes, notetags"
            className="w-full border-b border-border bg-transparent py-2 text-sm outline-none placeholder:opacity-50 focus:border-foreground"
          />
        </div>

        <section className="mt-12">
          <h2 className="text-xs tracking-[0.2em] uppercase opacity-50">Notepages</h2>
          <ul className="mt-5 divide-y divide-border/70">
            {notepages.map((np) => (
              <li key={np.slug} className="py-5">
                <Link
                  to="/$notepage"
                  params={{ notepage: np.slug }}
                  className="text-lg hover:underline"
                >
                  {np.name}
                </Link>
                <p className="mt-1 text-sm opacity-70">{np.description}</p>
                <p className="mt-1 text-xs opacity-50">
                  {np.owner} · {notesOf(np.slug).length} notes
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-xs tracking-[0.2em] uppercase opacity-50">Notetags</h2>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm">
            {tags.map(([tag, count]) => (
              <Link
                key={tag}
                to="/notetags/$tag"
                params={{ tag }}
                className="opacity-75 hover:underline hover:opacity-100"
              >
                #{tag} <span className="opacity-50">{count}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
