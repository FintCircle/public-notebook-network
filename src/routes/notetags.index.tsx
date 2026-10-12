import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { allNotetags } from "@/data/inktella";

export const Route = createFileRoute("/notetags/")({
  head: () => ({ meta: [{ title: "Notetags | Inktella" }, { name: "description", content: "Browse user-created Notetags across Inktella." }] }),
  component: Notetags,
});

function Notetags() {
  const tags = allNotetags();
  return <div className="min-h-screen"><SiteNav /><main className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
    <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">User-created</p>
    <h1 className="mt-3 text-4xl tracking-tight">Notetags</h1>
    <p className="mt-2 max-w-xl text-muted-foreground">Personal labels made by Inkers. Explore notes by the words people chose for themselves.</p>
    <div className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-4">{tags.map(([tag, count]) => <Link key={tag} to="/topics/$tag" params={{ tag }} style={{ fontSize: `${Math.min(2.1, 0.9 + count * 0.13)}rem` }} className="leading-none tracking-tight text-foreground/80 transition-opacity hover:text-foreground hover:opacity-100">#{tag}<span className="ml-1 text-xs text-muted-foreground">{count}</span></Link>)}</div>
  </main><SiteFooter /></div>;
}
