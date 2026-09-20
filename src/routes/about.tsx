import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteNav } from "@/components/site-nav";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Inktella — why public notebooks" },
      {
        name: "description",
        content:
          "Inktella is a public notebook network for personal writing: notes, Notetags, Notella and your own little corner of the internet.",
      },
      { property: "og:title", content: "About Inktella — why public notebooks" },
      {
        property: "og:description",
        content: "A quiet place for personal writing. No metrics, no followers, no algorithms.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const words = [
  { term: "Notepage", meaning: "Your personal public notebook. Your background, your type, your notes." },
  { term: "Note", meaning: "One piece of writing. Short, long, finished or not — there is no minimum." },
  { term: "Notetag", meaning: "A word shared across the whole network, so a note can be found by subject." },
  { term: "Tellaverse", meaning: "Everything written under one Notetag, across every notebook." },
  { term: "Notella", meaning: "A quiet feed built around interests instead of popularity." },
];

const notFor = [
  "Follower counts and growth charts",
  "Newsletters and audience funnels",
  "SEO checklists and publishing chores",
  "Writing done for you by a machine",
];

function About() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main>
        <section className="mx-auto max-w-2xl px-5 pt-14 pb-16 sm:pt-20">
          <Link to="/" className="text-sm opacity-55 hover:opacity-100">
            ← Inktella
          </Link>
          <h1 className="mt-10 text-4xl sm:text-5xl">About</h1>
          <p className="hand mt-3 text-2xl opacity-70">the public notebook network</p>

          <div className="mt-10 space-y-5 text-lg leading-relaxed opacity-80">
            <p>
              People have always kept notebooks. Bits of thinking, half-finished pages,
              things they didn't want to forget. Almost none of it was written to perform.
            </p>
            <p>
              Inktella is that, in public. You keep a notebook, anyone can read it, and
              nothing pushes you to make it bigger than it is.
            </p>
          </div>

          <p className="hand tilt-left mt-10 inline-block text-xl opacity-70">
            write like nobody's counting.
          </p>
        </section>

        <hr className="rule-irregular mx-auto max-w-2xl" />

        <section className="mx-auto max-w-2xl px-5 py-16">
          <h2 className="text-xs tracking-[0.24em] uppercase opacity-50">The words we use</h2>
          <dl className="mt-8 divide-y divide-border/70">
            {words.map((w) => (
              <div key={w.term} className="py-5">
                <dt className="font-heading text-xl">{w.term}</dt>
                <dd className="mt-1.5 leading-relaxed opacity-75">{w.meaning}</dd>
              </div>
            ))}
          </dl>
        </section>

        <hr className="rule-irregular mx-auto max-w-2xl" />

        <section className="mx-auto max-w-2xl px-5 py-16">
          <h2 className="text-xs tracking-[0.24em] uppercase opacity-50">What this isn't</h2>
          <ul className="mt-8 space-y-3 text-lg opacity-75">
            {notFor.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden className="opacity-40">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-10 leading-relaxed opacity-75">
            One price, paid per notebook, keeps it that way. Nobody is the product here.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              to="/pricing"
              className="rounded-md bg-primary px-5 py-3 text-sm text-primary-foreground transition-opacity hover:opacity-90"
            >
              See pricing
            </Link>
            <Link to="/explore" className="text-sm underline underline-offset-4">
              Wander around →
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
