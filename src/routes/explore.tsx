import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { allNotetags, notepages, notesOf, notepageAppearance } from "@/data/inktella";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore notebooks and Notetags | Inktella" },
      {
        name: "description",
        content: "Wander through public Notepages and user-created Notetags across Inktella.",
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

const sortOptions = ["New", "Most notes", "Age", "Most firstborns", "Most liked", "Recently liked"] as const;
type SortOption = (typeof sortOptions)[number];

function Explore() {
  const tags = allNotetags();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("New");
  const [visibleCount, setVisibleCount] = useState(12);
  const filteredPages = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = notepages.filter((page) =>
      !needle || `${page.name} ${page.description} ${page.owner}`.toLowerCase().includes(needle),
    );
    return [...matches].sort((a, b) => {
      const aNotes = notesOf(a.slug);
      const bNotes = notesOf(b.slug);
      if (sort === "Most notes" || sort === "Most firstborns") return bNotes.length - aNotes.length;
      if (sort === "Most liked") return bNotes.reduce((sum, note) => sum + note.likes, 0) - aNotes.reduce((sum, note) => sum + note.likes, 0);
      if (sort === "Recently liked") return bNotes.reduce((date, note) => date > note.publishedAt ? date : note.publishedAt, "") .localeCompare(aNotes.reduce((date, note) => date > note.publishedAt ? date : note.publishedAt, ""));
      if (sort === "Age") return a.slug.localeCompare(b.slug);
      return b.slug.localeCompare(a.slug);
    });
  }, [query, sort]);
  const visiblePages = filteredPages.slice(0, visibleCount);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || visibleCount >= filteredPages.length) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisibleCount((count) => count + 12);
    }, { rootMargin: "240px" });
    observer.observe(target);
    return () => observer.disconnect();
  }, [filteredPages.length, visibleCount]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="flex flex-col gap-5 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">Explore</p>
            <h1 className="mt-2 text-4xl tracking-tight sm:text-5xl">Find your next Notepage.</h1>
          </div>
          <label className="relative block w-full sm:max-w-sm">
            <span className="sr-only">Search Notepages</span>
            <input id="search" type="search" value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(12); }} placeholder="Search Notepages" className="w-full rounded-full border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground" />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Explore sorting options">
          {sortOptions.map((option) => <button key={option} type="button" onClick={() => setSort(option)} className={cn("rounded-full border px-3 py-1.5 text-xs transition-colors", sort === option ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground")}>{option}</button>)}
        </div>

        <Link to="/notetags/" className="mt-7 flex items-center justify-between rounded-2xl border border-border bg-muted/40 px-5 py-4 transition-colors hover:bg-muted">
          <span><span className="block text-sm font-medium">Browse Notetags</span><span className="mt-1 block text-xs text-muted-foreground">Explore user-created labels across Inktella.</span></span><span aria-hidden className="text-xl">→</span>
        </Link>

        <section className="mt-8" aria-labelledby="notepages-heading">
          <div className="flex items-baseline justify-between"><h2 id="notepages-heading" className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Notepages</h2><span className="text-xs text-muted-foreground">{filteredPages.length} found</span></div>
          <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {visiblePages.map((page) => {
              const appearance = notepageAppearance(page);
              const cover = appearance.backgroundImage;
              return <Link key={page.slug} to="/$notepage" params={{ notepage: page.slug }} className="group relative min-h-56 overflow-hidden rounded-2xl border border-border" style={{ backgroundColor: page.theme.accent ?? appearance.backgroundColor }}>
                {cover && <img src={cover} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ objectPosition: appearance.backgroundPosition }} />}
                <div className={cn("absolute inset-0", cover ? "bg-gradient-to-t from-black/80 via-black/25 to-black/5" : "bg-gradient-to-br from-white/10 to-black/10")} />
                <div className={cn("relative flex min-h-56 flex-col justify-end p-5", cover || appearance.textColor === "light" ? "text-white" : "text-foreground")}>
                  <p className="text-xs opacity-75">by {page.owner} · {notesOf(page.slug).length} notes</p><h3 className="mt-1 text-2xl tracking-tight">{page.name}</h3><p className="mt-1 line-clamp-2 text-sm opacity-80">{page.description}</p>
                </div>
              </Link>;
            })}
          </div>
          {visibleCount < filteredPages.length && <div ref={loadMoreRef} className="h-10" aria-hidden="true" />}
          {visibleCount < filteredPages.length && <button type="button" onClick={() => setVisibleCount((count) => count + 12)} className="mx-auto block rounded-full border border-border px-5 py-2 text-sm hover:border-foreground">Load more</button>}
        </section>

        <section className="mt-14" aria-labelledby="tags-heading"><div className="flex items-baseline justify-between"><h2 id="tags-heading" className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Notetags</h2><Link to="/notetags/" className="text-xs underline underline-offset-4">View all</Link></div><div className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-3">{tags.slice(0, 24).map(([tag, count]) => <Link key={tag} to="/topics/$tag" params={{ tag }} style={{ fontSize: `${Math.min(2.1, 0.85 + count * 0.12)}rem` }} className="leading-none tracking-tight opacity-75 transition-opacity hover:opacity-100">#{tag}<span className="ml-1 text-xs opacity-50">{count}</span></Link>)}</div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
