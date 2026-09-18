import { createFileRoute, Link } from "@tanstack/react-router";
import { NoteEntry } from "@/components/note-entry";
import { AboutSheet } from "@/components/about-sheet";
import { getNotepage, notesOf } from "@/data/inktella";

export const Route = createFileRoute("/$notepage/")({
  head: ({ params }) => {
    const np = getNotepage(params.notepage);
    if (!np) return { meta: [{ title: "Notepage not found | Inktella" }] };
    return {
      meta: [
        { title: `${np.name} — a notebook on Inktella` },
        { name: "description", content: np.description },
        { property: "og:title", content: `${np.name} — a notebook on Inktella` },
        { property: "og:description", content: np.description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: NotepageHome,
});

function NotepageHome() {
  const { notepage } = Route.useParams();
  const np = getNotepage(notepage);
  const entries = notesOf(notepage);
  if (!np) return null;

  return (
    <main className="mx-auto max-w-2xl px-5 py-14">
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-xs tracking-[0.24em] uppercase opacity-60">{np.name}</h1>
          <p className="mt-4 max-w-[38ch] text-lg leading-snug opacity-80">
            {np.description}
          </p>
        </div>
        <AboutSheet notepage={np} />
      </header>

      <hr className="rule-irregular mt-10" />

      <div className="divide-y divide-current/10">
        {entries.map((note) => (
          <NoteEntry key={note.id} note={note} />
        ))}
      </div>

    </main>
  );
}
