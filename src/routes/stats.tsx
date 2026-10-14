import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, BarChart3, BookOpen, Eye, Heart, Users } from "lucide-react";
import { useState } from "react";
import { SiteFooter, SiteNav } from "@/components/site-nav";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Stats | Inktella" },
      {
        name: "description",
        content: "A small, human view of how your Notepage is being read.",
      },
    ],
  }),
  component: Stats,
});

const periods = ["7 days", "30 days", "90 days", "All time"];
const chartData = [30, 39, 48, 43, 54, 64, 58, 72, 67, 84, 78, 92, 86, 101, 95, 115, 108, 126, 118, 142];
const notes = [
  ["Building something nobody asked for", "428", "31"],
  ["What I learned this week", "291", "26"],
  ["A small thought about the web", "184", "19"],
  ["Untitled · Sep 18", "97", "8"],
];
const sources = [
  ["Inktella Explore", "52%"],
  ["Direct links", "31%"],
  ["Search engines", "17%"],
];

function Stats() {
  const [period, setPeriod] = useState("30 days");
  const max = Math.max(...chartData);

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your corner of Inktella</p>
            <h1 className="mt-3 font-heading text-5xl tracking-tight sm:text-6xl">Your Notepage stats</h1>
            <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
              A simple look at how people discover, read, and interact with your notes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1 rounded-full border border-border p-1" aria-label="Date range">
            {periods.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPeriod(item)}
                className={`rounded-full px-3 py-2 text-xs transition-colors ${period === item ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <section className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Overview">
          <StatCard icon={Eye} label="Notepage views" value="2,481" change="+18%" />
          <StatCard icon={Users} label="Unique visitors" value="1,204" change="+12%" />
          <StatCard icon={BookOpen} label="Notes read" value="1,876" change="+9%" />
          <StatCard icon={Heart} label="Likes received" value="143" change="+6%" />
        </section>

        <section className="mt-12 rounded-2xl border border-border bg-card p-5 sm:p-7" aria-labelledby="reading-activity">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 id="reading-activity" className="font-heading text-2xl">Reading activity</h2>
              <p className="mt-1 text-sm text-muted-foreground">Views over the last {period.toLowerCase()}</p>
            </div>
            <BarChart3 className="size-5 text-muted-foreground" aria-hidden />
          </div>
          <div className="mt-8 flex h-56 items-end gap-1.5 sm:gap-3" aria-label="Views chart">
            {chartData.map((value, index) => (
              <div key={`${value}-${index}`} className="group flex h-full flex-1 items-end">
                <div
                  className="relative w-full rounded-t-sm bg-primary/75 transition-all group-hover:bg-primary"
                  style={{ height: `${(value / max) * 100}%` }}
                  title={`${value} views`}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs text-muted-foreground"><span>Sep 15</span><span>Oct 14</span></div>
        </section>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-7" aria-labelledby="popular-notes">
            <div className="flex items-center justify-between"><h2 id="popular-notes" className="font-heading text-2xl">Popular notes</h2><ArrowUpRight className="size-5 text-muted-foreground" aria-hidden /></div>
            <div className="mt-6 flex flex-col gap-1">
              {notes.map(([title, views, likes], index) => (
                <div key={title} className="flex items-center gap-4 border-t border-border py-4">
                  <span className="w-5 text-sm text-muted-foreground">{index + 1}</span>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{title}</p><p className="mt-1 text-xs text-muted-foreground">{views} views · {likes} likes</p></div>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-7" aria-labelledby="traffic-sources">
            <h2 id="traffic-sources" className="font-heading text-2xl">Traffic sources</h2>
            <div className="mt-7 flex flex-col gap-5">{sources.map(([source, percent]) => <div key={source}><div className="flex justify-between text-sm"><span>{source}</span><span className="text-muted-foreground">{percent}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: percent }} /></div></div>)}</div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-primary/5 p-5 sm:p-7" aria-labelledby="cover-rate">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">A useful signal</p><h2 id="cover-rate" className="mt-2 font-heading text-3xl">Cover-to-reading rate</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">The percentage of visitors who opened a note after viewing your Notepage cover.</p></div>
            <div className="shrink-0"><p className="font-heading text-5xl">64.8%</p><p className="mt-1 text-sm text-primary">+8.2 percentage points</p></div>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-4 border-t border-border/70 pt-5 text-sm sm:max-w-md"><div><p className="text-2xl font-medium">1,250</p><p className="text-muted-foreground">Cover visitors</p></div><div><p className="text-2xl font-medium">810</p><p className="text-muted-foreground">Started reading</p></div></div>
        </section>

        <p className="mt-8 text-center text-xs text-muted-foreground">Illustrative data for this preview · Detailed stats are private to you.</p>
      </main>
      <SiteFooter />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, change }: { icon: typeof Eye; label: string; value: string; change: string }) {
  return <article className="rounded-2xl border border-border bg-card p-5"><Icon className="size-5 text-muted-foreground" aria-hidden /><p className="mt-7 text-sm text-muted-foreground">{label}</p><div className="mt-2 flex items-end justify-between gap-3"><p className="font-heading text-4xl">{value}</p><span className="mb-1 text-xs text-primary">{change}</span></div></article>;
}
