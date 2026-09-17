import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { LikeButton } from "@/components/like-button";
import { NotetagList } from "@/components/notetag-list";
import { getNotepage, notes } from "@/data/inktella";

export const Route = createFileRoute("/notella")({
  head: () => ({
    meta: [
      { title: "Notella — notes around things you care about | Inktella" },
      {
        name: "description",
        content:
          "Notella is Inktella's quiet discovery feed: notes and writers around the things you care about.",
      },
      { property: "og:title", content: "Notella — notes around things you care about" },
      {
        property: "og:description",
        content: "A minimal feed of personal notes from public notebooks.",
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
        <h1 className="text-xs tracking-[0.24em] uppercase opacity-50">Notella</h1>
        <p className="hand mt-2 text-2xl opacity-70">
          notes around things you care about
        </p>

        <div className="mt-10 divide-y divide-border/70">
          {feed.map((note) => {
            const np = getNotepage(note.notepage);
            return (
              <article key={note.id} className="py-8">
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="flex size-7 items-center justify-center rounded-full border border-border text-xs"
                  >
                    {np?.avatarInitial}
                  </span>
                  <Link
                    to="/$notepage"
                    params={{ notepage: note.notepage }}
                    className="text-sm hover:underline"
                  >
                    {np?.owner}
                  </Link>
                </div>

                <h2 className="mt-3 text-xl leading-snug">
                  <Link
                    to="/$notepage/notepage/$noteId"
                    params={{ notepage: note.notepage, noteId: note.id }}
                    className="hover:underline"
                  >
                    {note.title}
                  </Link>
                </h2>
                <p className="mt-2 leading-relaxed opacity-75">{note.preview}</p>

                <div className="mt-4">
                  <NotetagList tags={note.notetags} />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <LikeButton count={note.likes} />
                  <Link
                    to="/$notepage/notepage/$noteId"
                    params={{ notepage: note.notepage, noteId: note.id }}
                    className="text-sm opacity-60 hover:opacity-100"
                  >
                    Read →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
