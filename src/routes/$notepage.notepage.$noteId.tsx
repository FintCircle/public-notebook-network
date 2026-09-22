import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { LikeButton } from "@/components/like-button";
import { NotetagList } from "@/components/notetag-list";
import { getNote, getNotepage } from "@/data/inktella";

export const Route = createFileRoute("/$notepage/notepage/$noteId")({
  beforeLoad: ({ params }) => {
    if (!getNote(params.notepage, params.noteId)) throw notFound();
  },
  head: ({ params }) => {
    const note = getNote(params.notepage, params.noteId);
    const np = getNotepage(params.notepage);
    if (!note || !np) return { meta: [{ title: "Note not found | Inktella" }] };
    return {
      meta: [
        { title: `${note.title} — ${np.name}` },
        { name: "description", content: note.preview },
        { property: "og:title", content: `${note.title} — ${np.name}` },
        { property: "og:description", content: note.preview },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: NoteView,
});

function NoteView() {
  const { notepage, noteId } = Route.useParams();
  const note = getNote(notepage, noteId);
  const np = getNotepage(notepage);
  if (!note || !np) return null;

  return (
    <main className="note-detail-page mx-auto max-w-2xl bg-white px-5 py-12 text-black sm:px-8 sm:py-16">
      <Link
        to="/$notepage"
        params={{ notepage }}
        className="text-sm font-medium tracking-wide text-black/60 transition-colors hover:text-black"
      >
        ← entry from {np.name}
      </Link>

      <article className="measure mt-16">
        <h1 className="font-body text-[2.25rem] font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl">{note.title}</h1>
        <p className="mt-5 text-sm tracking-[0.12em] text-black/55 uppercase">{note.date}</p>

        <div className="note-detail-copy prose-note mt-12" dangerouslySetInnerHTML={{ __html: note.html }} />

        <div className="mt-12">
          <NotetagList tags={note.notetags} notepage={notepage} />
        </div>

        <div className="mt-6">
          <LikeButton count={note.likes} />
        </div>

        <footer className="mt-16 text-right">
          <p className="hand text-2xl">— {np.owner}</p>
          <div
            className="prose-note mt-1 ml-auto max-w-[38ch] text-sm opacity-60"
            dangerouslySetInnerHTML={{ __html: np.ownerBio }}
          />
        </footer>
      </article>
    </main>
  );
}
