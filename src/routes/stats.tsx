import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Eye, Heart, MessageCircle } from "lucide-react";
import { SiteFooter, SiteNav } from "@/components/site-nav";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Stats | Inktella" },
      { name: "description", content: "A small, human view of how your Notepage is being read." },
    ],
  }),
  component: Stats,
});

const notes = [
  ["Building something nobody asked for", "428", "31"],
  ["What I learned this week", "291", "26"],
  ["A small thought about the web", "184", "19"],
  ["Untitled · Sep 18", "97", "8"],
];

const countries = [["Uganda", "34%"], ["United States", "18%"], ["United Kingdom", "11%"], ["Kenya", "8%"], ["Other", "29%"]];
const sources = [["Inktella Discover", "46%"], ["Notetags", "24%"], ["Direct / shared links", "19%"], ["Other Notepages", "8%"], ["Other", "3%"]];

function Stats() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your corner of Inktella</p>
            <h1 className="mt-3 font-heading text-5xl tracking-tight sm:text-6xl">Stats</h1>
            <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">Are people finding your notes, and what are they enjoying?</p>
          </div>
          <BarChart3 aria-hidden className="mt-2 size-7 text-muted-foreground" />
        </div>

        <section className="mt-14 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-muted/30 py-5">
          {[["2,481", "Reads", Eye], ["186", "Likes", Heart], ["24", "Guestnotes", MessageCircle]].map(([value, label, Icon]) => (
            <div key={String(label)} className="px-3 text-center sm:px-6">
              <Icon aria-hidden className="mx-auto mb-2 size-4 text-muted-foreground" />
              <p className="text-2xl tracking-tight sm:text-3xl">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </section>

        <section className="mt-16">
          <div className="flex items-end justify-between gap-4"><h2 className="text-xl">Your Notepage lately</h2><span className="text-xs text-muted-foreground">7 days · 30 days · 12 months</span></div>
          <div className="mt-6 flex h-40 items-end gap-2 border-b border-l border-border px-3 pb-0 pt-5 sm:gap-4">
            {[36, 52, 44, 72, 64, 91, 78, 100, 86, 96, 74, 88].map((height, index) => <div key={index} className="flex-1 rounded-t-sm bg-primary/65" style={{ height: `${height}%` }} aria-label={`${height} reads`} />)}
          </div>
        </section>

        <section className="mt-16"><h2 className="text-xl">Notes people are reading</h2><div className="mt-5 divide-y divide-border/70 border-y border-border/70">{notes.map(([note, reads, likes]) => <div key={note} className="grid grid-cols-[1fr_auto_auto] gap-4 py-4 text-sm"><span>{note}</span><span className="text-muted-foreground">{reads} reads</span><span className="text-muted-foreground">{likes} likes</span></div>)}</div></section>

        <section className="mt-16 grid gap-12 sm:grid-cols-2">
          <div><h2 className="text-xl">People stopping by</h2><p className="mt-3 text-2xl tracking-tight">1,306 <span className="text-base text-muted-foreground">readers this month</span></p><div className="mt-5 space-y-3">{countries.map(([name, value]) => <div key={name} className="flex justify-between text-sm"><span>{name}</span><span className="text-muted-foreground">{value}</span></div>)}</div></div>
          <div><h2 className="text-xl">Where they found you</h2><div className="mt-8 space-y-3">{sources.map(([name, value]) => <div key={name} className="flex justify-between text-sm"><span>{name}</span><span className="text-muted-foreground">{value}</span></div>)}</div></div>
        </section>

        <section className="mt-16 border-t border-border pt-8"><h2 className="text-xl">Guestnotes</h2><div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm"><span><strong>24</strong> Guestnotes received</span><span className="text-muted-foreground">+7 this month</span></div><p className="mt-5 text-sm text-muted-foreground">Most Guestnoted note</p><p className="mt-1">Building something nobody asked for <span className="text-muted-foreground">· 6</span></p></section>

        <blockquote className="hand mt-20 border-l-2 border-primary/40 pl-5 text-2xl leading-snug text-muted-foreground">Your little corner was visited 2,481 times.<br />Keep noting things down.</blockquote>
      </main>
      <SiteFooter />
    </div>
  );
}
