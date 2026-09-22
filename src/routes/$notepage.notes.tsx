import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { NoteEntry } from "@/components/note-entry";
import { getNotepage, notesOf } from "@/data/inktella";

export const Route = createFileRoute("/$notepage/notes")({
  component: NotepageNotes,
});

function NotepageNotes() {
  const { notepage } = Route.useParams();
  const np = getNotepage(notepage);
  const entries = notesOf(notepage);
  if (!np) return null;

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
      <header className="border-b border-current/15 pb-10">
        <Link to="/$notepage" params={{ notepage }} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] opacity-55 hover:opacity-100">
          <ArrowLeft aria-hidden className="size-4" /> {np.header.navLabel}
        </Link>
        <p className="hand mt-12 text-xl opacity-65">{np.header.eyebrow}</p>
        <h1 className="mt-3 max-w-[14ch] font-heading text-4xl leading-[0.95] tracking-tight sm:text-6xl">{np.header.title}</h1>
        <p className="mt-5 max-w-[42ch] text-base leading-relaxed opacity-65 sm:text-lg">{np.header.description}</p>
      </header>

      <section aria-label={`${np.name} notes`} className="notepage-reading-surface divide-y divide-current/10 px-5 sm:px-8">
        {entries.map((note) => <NoteEntry key={note.id} note={note} />)}
      </section>
    </main>
  );
}
