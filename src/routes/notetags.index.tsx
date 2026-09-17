import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { allNotetags } from "@/data/inktella";

export const Route = createFileRoute("/notetags/")({
  head: () => ({ meta: [
    { title: "Notetags | Inktella" },
    { name: "description", content: "Follow shared Notetags across public notebooks on Inktella." },
    { property: "og:title", content: "Notetags | Inktella" },
    { property: "og:description", content: "Follow shared Notetags across public notebooks on Inktella." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Notetags,
});

function Notetags() {
  return <div className="min-h-screen"><SiteNav /><main className="mx-auto max-w-2xl px-5 py-14"><h1 className="text-3xl">Notetags</h1><p className="hand mt-2 text-xl opacity-65">threads through the Tellaverse</p><div className="mt-10 divide-y divide-border/70">{allNotetags().map(([tag, count]) => <Link key={tag} to="/notetags/$tag" params={{ tag }} className="flex items-center justify-between py-4 hover:underline"><span>#{tag}</span><span className="text-xs opacity-45">{count} notes</span></Link>)}</div></main><SiteFooter /></div>;
}