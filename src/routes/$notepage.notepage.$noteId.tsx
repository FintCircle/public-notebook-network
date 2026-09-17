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
    <main className="mx-auto max-w-2xl px-5 py-12">
      <Link
        to="/$notepage"
        params={{ notepage }}
        className="hand text-xl opacity-70 hover:opacity-100"
      >
        ← entry from {np.name}
      </Link>

      <article className="measure mt-12">
        <h1 className="text-3xl leading-tight tracking-tight sm:text-[2.1rem]">
          {note.title}
        </h1>
        <p className="mt-3 text-sm opacity-55">{note.date}</p>

        <div
          className="prose-note mt-10"
          dangerouslySetInnerHTML={{ __html: note.html }}
        />

        <div className="mt-12">
          <NotetagList tags={note.notetags} notepage={notepage} />
        </div>

        <div className="mt-6">
          <LikeButton count={note.likes} />
        </div>

        <footer className="mt-16 text-right">
          <p className="hand text-2xl">— {np.owner}</p>
          <p className="mt-1 ml-auto max-w-[38ch] text-sm opacity-60">{np.ownerBio}</p>
        </footer>
      </article>
    </main>
  );
}
