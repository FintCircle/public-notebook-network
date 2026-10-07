import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { notepages } from "@/data/inktella";
import { Compass, CircleHelp, Newspaper, Tags, ArrowRight } from "lucide-react";

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
        content: "Not everything needs to be an article. Start a public notebook for $10 a year.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const count = Math.max(notepages.length, 12);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteNav />

      <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 py-8 sm:py-12">
        {/* Main Desktop Split / Mobile Stacked Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Hero Section (Left side on Desktop, Top on Mobile) */}
          <section className="lg:col-span-7 flex flex-col relative rounded-2xl overflow-hidden border border-border shadow-sm min-h-[500px] lg:min-h-[600px] justify-between p-6 sm:p-10 text-white">
            {/* Hero Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
                alt="Open notebook on a writing desk"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-stone-950/75 backdrop-blur-[1px]" />
            </div>

            {/* Overlaid Welcome Content */}
            <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs tracking-wider uppercase backdrop-blur-md text-stone-200 border border-white/15">
                  Welcome to Inktella
                </span>
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mt-4 text-white">
                  Inktella
                </h1>
                <p className="hand mt-2 text-2xl text-stone-300">the public notebook network</p>
              </div>

              <div className="space-y-4">
                <p className="font-heading text-2xl sm:text-3xl leading-snug text-stone-100">
                  Not everything needs
                  <br />
                  to be{" "}
                  <span className="underline decoration-stone-400 underline-offset-4">
                    an article
                  </span>
                  .
                </p>

                <div className="space-y-1.5 text-base sm:text-lg text-stone-300 font-normal">
                  <p>• Write what happened.</p>
                  <p>• Something you're thinking about.</p>
                  <p>• Something you learned.</p>
                  <p>• A story you don't want to lose.</p>
                  <p>• Something unfinished.</p>
                </div>

                <div className="pt-2">
                  <span className="hand tilt-left inline-block text-lg text-stone-300">
                    it doesn't have to be impressive. <span aria-hidden>↖</span>
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to="/notepages/new"
                  className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-stone-900 shadow transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start a Notepage — $10/year
                </Link>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  Wander around <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </div>
          </section>

          {/* Right Hand Free Side (Founder Message + Menu entries) */}
          <section className="lg:col-span-5 flex flex-col justify-between space-y-8">
            {/* Founder Message Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
                  alt="Derrick Katungi"
                  className="size-14 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div>
                  <h2 className="text-lg font-medium">Derrick Katungi</h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Founder of Inktella
                  </p>
                </div>
              </div>

              <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground border-l-2 border-primary/40 pl-3.5 italic">
                "People have always kept notebooks — bits of thinking, half-finished pages, and
                things they didn't want to lose. We made these ones public, quiet, and personal."
              </blockquote>
            </div>

            {/* Menu entries section */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex-1 flex flex-col justify-center">
              <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-semibold mb-4">
                Main Menu
              </h3>

              <nav aria-label="Main menu entries" className="space-y-3">
                <Link
                  to="/notella"
                  className="group flex items-center justify-between rounded-xl border border-border/60 p-3.5 transition-colors hover:bg-muted/70 hover:border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Newspaper className="size-5" aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        Access Notella
                      </p>
                      <p className="text-xs text-muted-foreground">The minimal discovery feed</p>
                    </div>
                  </div>
                  <ArrowRight
                    className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </Link>

                <Link
                  to="/explore"
                  className="group flex items-center justify-between rounded-xl border border-border/60 p-3.5 transition-colors hover:bg-muted/70 hover:border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Compass className="size-5" aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        Explore
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Discover public notebooks and recent notes
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </Link>

                <Link
                  to="/question"
                  className="group flex items-center justify-between rounded-xl border border-border/60 p-3.5 transition-colors hover:bg-muted/70 hover:border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <CircleHelp className="size-5" aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        Question of the day
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Think first, then hear the room
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </Link>

                <Link
                  to="/topics"
                  className="group flex items-center justify-between rounded-xl border border-border/60 p-3.5 transition-colors hover:bg-muted/70 hover:border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Tags className="size-5" aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        Topics
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Browse notes across shared topics
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </Link>
              </nav>
            </div>
          </section>
        </div>

        {/* Divider */}
        <hr className="rule-irregular my-12" />

        {/* Host Count Message Section */}
        <section className="text-center max-w-2xl mx-auto py-4 px-4 space-y-4">
          <p className="text-2xl sm:text-3xl font-heading leading-relaxed">
            Inktella hosts <span className="font-semibold text-primary">{count}</span> notepages as
            of today, start your notepage too and we'll count it.
          </p>
          <div>
            <Link
              to="/notepages/new"
              className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 hover:text-primary transition-colors"
            >
              Start your Notepage now →
            </Link>
          </div>
        </section>

        {/* Divider */}
        <hr className="rule-irregular my-12" />

        {/* Other Pages Navigation & Copyright Notice */}
        <footer className="pt-2 pb-8 text-center space-y-8">
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-semibold mb-4">
              Other pages
            </h3>
            <nav
              aria-label="Other pages"
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm"
            >
              <Link
                to="/about"
                className="hover:underline underline-offset-4 text-foreground/80 hover:text-foreground"
              >
                About
              </Link>
              <Link
                to="/terms"
                className="hover:underline underline-offset-4 text-foreground/80 hover:text-foreground"
              >
                Terms
              </Link>
              <Link
                to="/pricing"
                className="hover:underline underline-offset-4 text-foreground/80 hover:text-foreground"
              >
                Pricing
              </Link>
              <Link
                to="/guidelines"
                className="hover:underline underline-offset-4 text-foreground/80 hover:text-foreground"
              >
                Guidelines
              </Link>
              <Link
                to="/privacy"
                className="hover:underline underline-offset-4 text-foreground/80 hover:text-foreground"
              >
                Privacy
              </Link>
            </nav>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Inktella. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
