import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { LikeButton } from "@/components/like-button";
import { NotetagList } from "@/components/notetag-list";
import { notes } from "@/data/inktella";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Notella — notes around things you care about | Inktella" },
      {
        name: "description",
        content: "A quiet discovery feed of notes and writers around the things you care about.",
      },
    ],
  }),
  component: Notella,
});

function Notella() {
  const feed = [...notes].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-2xl px-5 py-14">
        <h1 className="text-xs uppercase tracking-[0.24em] opacity-50">Notella</h1>
        <p className="hand mt-2 text-2xl opacity-70">notes around things you care about</p>
        <div className="mt-10 divide-y divide-border/70">
          {feed.map((note) => (
            <article key={note.id} className="py-8">
              <p className="text-xs uppercase tracking-[0.18em] opacity-50">Note</p>
              <h2 className="mt-3 text-xl leading-snug">{note.title}</h2>
              <p className="mt-2 leading-relaxed opacity-75">{note.preview}</p>
              <div className="mt-4">
                <NotetagList tags={note.notetags} />
              </div>
              <div className="mt-4">
                <LikeButton note={note} />
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export default Notella;

// Notella is the public homepage; the old /notella route is intentionally gone.
// This default export keeps route tooling happy while the named Route remains authoritative.
function _unused() {
  return null;
}
void _unused;
