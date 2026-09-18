import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Eye, PenLine, Plus } from "lucide-react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { notepages, notesOf } from "@/data/inktella";

export const Route = createFileRoute("/notepages/")({
  head: () => ({ meta: [
    { title: "My Notepages | Inktella" },
    { name: "description", content: "Open your notebooks, add notes, and manage your Notepages." },
    { property: "og:title", content: "My Notepages | Inktella" },
    { property: "og:description", content: "Open your notebooks and add notes on Inktella." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: MyNotepages,
});

function MyNotepages() {
  const mine = notepages.slice(0, 2);
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-5 py-14">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div><h1 className="text-3xl">My Notepages</h1><p className="hand mt-2 text-xl opacity-60">your notebooks, all in one place</p></div>
          <Button asChild><Link to="/notepages/new"><Plus aria-hidden />New Notepage</Link></Button>
        </div>
        <div className="mt-10 divide-y divide-border/70 border-y border-border/70">
          {mine.map((np) => (
            <article key={np.slug} className="py-7">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="min-w-0"><div className="flex items-center gap-2"><BookOpen aria-hidden className="size-4 opacity-45" /><h2 className="text-xl">{np.name}</h2></div><p className="mt-2 max-w-[52ch] text-sm leading-relaxed opacity-65">{np.description}</p><p className="mt-3 text-xs opacity-45">{notesOf(np.slug).length} notes · renews Sep 2027</p></div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" asChild><Link to="/$notepage" params={{ notepage: np.slug }}><Eye aria-hidden />View</Link></Button>
                  <Button asChild><Link to="/write" search={{ notepage: np.slug }}><PenLine aria-hidden />Add note</Link></Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}