import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Globe, Link2 } from "lucide-react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { notepages } from "@/data/inktella";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [{ title: "Alex Morgan — Inktella" }, { name: "description", content: "The Inktella profile for Alex Morgan." }],
  }),
  component: Profile,
});

function Profile() {
  const visiblePages = notepages.slice(0, 3);
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-8 sm:py-12">
        <section className="rounded-[2rem] border border-border/80 bg-background p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-start">
            <div className="flex size-32 shrink-0 items-center justify-center rounded-[1.65rem] bg-muted text-4xl font-semibold sm:size-40">A</div>
            <div className="min-w-0">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Alex Morgan</h1>
              <p className="mt-2 text-xl text-muted-foreground">@alexm</p>
              <p className="mt-5 max-w-xl text-xl leading-relaxed">I write about life, the internet, and the little things we overlook.</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4 text-lg text-muted-foreground">
            <span className="inline-flex items-center gap-2"><Globe aria-hidden /> United Kingdom</span>
            <span className="inline-flex items-center gap-2"><CalendarDays aria-hidden /> Joined March 2026</span>
            <a className="inline-flex items-center gap-2 hover:text-foreground" href="https://alexwrites.com"><Link2 aria-hidden /> alexwrites.com</a>
          </div>
          <div className="my-10 border-t border-border/70" />
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-3xl font-semibold tracking-tight">Notepages</h2>
            <span className="text-lg text-muted-foreground">{visiblePages.length} Notepages</span>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {visiblePages.map((page) => (
              <Link key={page.slug} to="/$notepage" params={{ notepage: page.slug }} className="group">
                <div className="flex aspect-[1.45] items-center justify-center rounded-3xl bg-muted text-2xl font-semibold transition-transform group-hover:-translate-y-1">{page.avatarInitial}</div>
                <h3 className="mt-4 text-2xl font-semibold group-hover:underline">{page.name}</h3>
                <p className="mt-2 text-lg leading-relaxed text-muted-foreground">{page.description}</p>
              </Link>
            ))}
          </div>
          <div className="mt-10 border-t border-border/70 pt-10">
            <h2 className="text-3xl font-semibold tracking-tight">About Alex</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">A place for notes, observations, and unfinished thoughts about living online and paying attention.</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
