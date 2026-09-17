import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { interests, notepages, notesOf } from "@/data/inktella";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your account and Notepages | Inktella" },
      {
        name: "description",
        content:
          "Your Inktella account: interests, the Notepages you own, and the notes you liked.",
      },
      { property: "og:title", content: "Your account and Notepages on Inktella" },
      {
        property: "og:description",
        content: "One account, as many public notebooks as you like.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const [selected, setSelected] = useState<string[]>(["Building", "Life", "Uganda"]);
  const mine = notepages.slice(0, 2);

  const toggle = (name: string) =>
    setSelected((s) => (s.includes(name) ? s.filter((i) => i !== name) : [...s, name]));

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-2xl px-5 py-14">
        <div className="flex items-center gap-4">
          <span
            aria-hidden
            className="flex size-14 items-center justify-center rounded-full border border-border text-lg"
          >
            D
          </span>
          <div>
            <h1 className="text-2xl">Derrick</h1>
            <p className="text-sm opacity-60">@derrick</p>
          </div>
        </div>
        <p className="mt-5 max-w-[55ch] leading-relaxed opacity-80">
          Building Pangisa in Kampala. Writes things down before they disappear.
        </p>

        <section className="mt-14">
          <h2 className="text-xs tracking-[0.2em] uppercase opacity-50">
            Your Notepages
          </h2>
          <ul className="mt-5 divide-y divide-border/70">
            {mine.map((np) => (
              <li key={np.slug} className="flex flex-wrap items-baseline gap-x-4 py-4">
                <Link
                  to="/$notepage"
                  params={{ notepage: np.slug }}
                  className="hover:underline"
                >
                  {np.name}
                </Link>
                <span className="text-xs opacity-50">
                  {notesOf(np.slug).length} notes · renews Sep 2027
                </span>
              </li>
            ))}
          </ul>
          <Link
            to="/write"
            className="mt-6 inline-block text-sm underline underline-offset-4"
          >
            Start another Notepage — $10/year
          </Link>
        </section>

        <section className="mt-14">
          <h2 className="text-xs tracking-[0.2em] uppercase opacity-50">
            Your interests
          </h2>
          <p className="hand mt-2 text-lg opacity-60">these shape Notella</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {interests.map((name) => {
              const on = selected.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(name)}
                  className={
                    on
                      ? "rounded-full bg-primary px-3.5 py-1.5 text-sm text-primary-foreground"
                      : "rounded-full border border-border px-3.5 py-1.5 text-sm opacity-70 hover:opacity-100"
                  }
                >
                  {name}
                </button>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
