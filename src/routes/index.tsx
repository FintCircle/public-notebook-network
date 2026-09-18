import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { NoteEntry } from "@/components/note-entry";
import { notes, notepages } from "@/data/inktella";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inktella — the public notebook network" },
      {
        name: "description",
        content:
          "Not everything needs to be an article. Start a public notebook and write what happened, what you're thinking, or something unfinished.",
      },
      { property: "og:title", content: "Inktella — the public notebook network" },
      {
        property: "og:description",
        content:
          "Not everything needs to be an article. Start a public notebook for $10 a year.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const recent = notes.slice(0, 3);

  return (
    <div className="min-h-screen">
      <SiteNav />

      <main>
        <section className="mx-auto max-w-3xl px-5 pt-16 pb-20 sm:pt-24">
          <h1 className="text-4xl leading-none tracking-tight sm:text-5xl">Inktella</h1>
          <p className="hand mt-3 text-2xl opacity-70">the public notebook network</p>

          <p className="mt-12 font-heading text-3xl leading-tight sm:text-4xl">
            Not everything needs
            <br />
            to be <span className="scribble-underline">an article</span>.
          </p>

          <div className="mt-10 space-y-2 text-lg opacity-80">
            <p>Write what happened.</p>
            <p>Something you're thinking about.</p>
            <p>Something you learned.</p>
            <p>A story you don't want to lose.</p>
            <p>Something unfinished.</p>
          </div>

          <div className="mt-10 sm:pl-16">
            <span className="hand tilt-left inline-block text-xl opacity-70">
              it doesn't have to be impressive. <span aria-hidden>↖</span>
            </span>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              to="/notepages/new"
              className="rounded-md bg-primary px-5 py-3 text-sm text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start a Notepage — $10/year
            </Link>
            <Link to="/explore" className="text-sm underline underline-offset-4">
              Wander around →
            </Link>
          </div>
        </section>

        <hr className="rule-irregular mx-auto max-w-3xl" />

        <section className="mx-auto max-w-3xl px-5 py-20">
          <p className="font-heading text-2xl leading-snug sm:text-3xl">
            People have always
            <br />
            kept notebooks.
          </p>
          <p className="mt-6 font-heading text-2xl leading-snug opacity-60 sm:text-3xl">
            We just made these
            <br />
            ones public.
          </p>

          <div className="mt-10 divide-y divide-border/70">
            {recent.map((note) => (
              <NoteEntry key={note.id} note={note} />
            ))}
          </div>
        </section>

        <hr className="rule-irregular mx-auto max-w-3xl" />

        <section className="mx-auto max-w-3xl px-5 py-20">
          <h2 className="text-xs tracking-[0.24em] uppercase opacity-50">
            Your little corner.
          </h2>
          <div className="mt-6 space-y-1 text-2xl">
            <p>Your background.</p>
            <p>Your type.</p>
            <p>Your notes.</p>
          </div>
          <p className="hand tilt-right mt-8 inline-block text-xl opacity-70">
            make a mess if you want.
          </p>
          <p className="mt-10 text-sm opacity-60">$10 / year / Notepage</p>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {notepages.map((np) => (
              <Link
                key={np.slug}
                to="/$notepage"
                params={{ notepage: np.slug }}
                className="underline underline-offset-4 opacity-70 hover:opacity-100"
              >
                {np.name}
              </Link>
            ))}
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
