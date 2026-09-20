import { createFileRoute } from "@tanstack/react-router";
import { Guestbook } from "@/components/guestbook";
import { NoteEntry } from "@/components/note-entry";
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
    <main>
      <header className="notepage-cover relative flex min-h-[82svh] items-end overflow-hidden px-5 pb-12 pt-24 text-[var(--np-cover-ink)] sm:min-h-[88svh] sm:px-10 sm:pb-16">
        <img
          src={np.portrait}
          alt=""
          width={816}
          height={816}
          className="absolute inset-0 size-full object-cover object-center"
        />
        <div aria-hidden className="notepage-cover-shade absolute inset-0" />
        <div className="relative z-10 mx-auto w-full max-w-2xl">
          <h1 className="max-w-[10ch] font-heading text-5xl leading-[0.94] sm:text-7xl">
            {np.name}
          </h1>
          <p className="mt-5 max-w-[34ch] text-lg leading-snug opacity-85 sm:text-xl">
            {np.description}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-5 py-10 sm:py-14">
        <div className="divide-y divide-current/10">
          {entries.map((note) => (
            <NoteEntry key={note.id} note={note} />
          ))}
        </div>

        <Guestbook notepage={np} />
      </div>
    </main>
  );
}
