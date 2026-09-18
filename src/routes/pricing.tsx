import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteNav } from "@/components/site-nav";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — $10 a year per Notepage | Inktella" },
      {
        name: "description",
        content:
          "One price: $10 a year for a public notebook. Unlimited notes, your own background and type, Notetags, Notella and no ads.",
      },
      { property: "og:title", content: "Pricing — $10 a year per Notepage" },
      {
        property: "og:description",
        content: "$10 a year, per notebook. Unlimited notes, no ads, no metrics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pricing,
});

const features = [
  { title: "Unlimited notes", detail: "No monthly quota, no minimum length, no maximum." },
  { title: "Your own look", detail: "Pick your background and your type. The page should feel like you." },
  { title: "A WYSIWYG editor", detail: "Write and format as you go. No Markdown to remember." },
  { title: "Your own address", detail: "Your notebook lives at its own place and can be shared anywhere." },
  { title: "Notetags & Tellaverse", detail: "Tag a note and it joins everything else written on that subject." },
  { title: "Notella", detail: "Appear in a feed shaped by interests, not by follower counts." },
  { title: "An About page", detail: "Portrait, bio, where you're noting down from, interests and links." },
  { title: "Images in notes", detail: "Add pictures where they belong inside the writing." },
  { title: "Quiet likes", detail: "One per reader, per note. Encouragement without a scoreboard." },
  { title: "No ads, ever", detail: "You pay for the notebook, so nothing else has to be sold." },
];

const more = [
  { q: "Do readers pay?", a: "No. Reading Inktella is free for everyone." },
  { q: "Can I have more than one notebook?", a: "Yes. One account can keep several, each at $10 a year." },
  { q: "What if I stop paying?", a: "Your writing isn't deleted. The notebook goes quiet until you pick it up again." },
  { q: "Can I take my writing with me?", a: "Yes. Your notes are yours and can be exported." },
];

function Pricing() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main>
        <section className="mx-auto max-w-2xl px-5 pt-14 pb-16 sm:pt-20">
          <Link to="/" className="text-sm opacity-55 hover:opacity-100">
            ← Inktella
          </Link>
          <h1 className="mt-10 text-4xl sm:text-5xl">Pricing</h1>
          <p className="hand mt-3 text-2xl opacity-70">one price, nothing hidden</p>

          <div className="mt-12 rounded-xl border border-border/70 p-6 sm:p-8">
            <p className="text-xs tracking-[0.24em] uppercase opacity-50">A Notepage</p>
            <p className="mt-4 font-heading text-5xl leading-none">$10</p>
            <p className="mt-2 opacity-70">per year, per notebook</p>
            <p className="mt-6 leading-relaxed opacity-75">
              Everything below is included. There is no free tier with the good parts
              removed, and no upgrade waiting further down the page.
            </p>
            <Link
              to="/notepages/new"
              className="mt-8 inline-block rounded-md bg-primary px-5 py-3 text-sm text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start a Notepage
            </Link>
            <p className="hand tilt-right mt-6 inline-block text-lg opacity-65">
              reading is free, always.
            </p>
          </div>
        </section>

        <hr className="rule-irregular mx-auto max-w-2xl" />

        <section className="mx-auto max-w-2xl px-5 py-16">
          <h2 className="text-xs tracking-[0.24em] uppercase opacity-50">What's included</h2>
          <div className="mt-8 divide-y divide-border/70">
            {features.map((f) => (
              <div key={f.title} className="py-5">
                <p className="font-heading text-xl">{f.title}</p>
                <p className="mt-1.5 leading-relaxed opacity-75">{f.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="rule-irregular mx-auto max-w-2xl" />

        <section className="mx-auto max-w-2xl px-5 py-16">
          <h2 className="text-xs tracking-[0.24em] uppercase opacity-50">Good to know</h2>
          <div className="mt-8 space-y-7">
            {more.map((item) => (
              <div key={item.q}>
                <p className="text-lg">{item.q}</p>
                <p className="mt-1.5 leading-relaxed opacity-75">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              to="/notepages/new"
              className="rounded-md bg-primary px-5 py-3 text-sm text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start a Notepage — $10/year
            </Link>
            <Link to="/about" className="text-sm underline underline-offset-4">
              What is Inktella? →
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
