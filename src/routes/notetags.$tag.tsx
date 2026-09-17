import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { LikeButton } from "@/components/like-button";
import { getNotepage, notesByTag } from "@/data/inktella";

export const Route = createFileRoute("/notetags/$tag")({
  head: ({ params }) => ({
    meta: [
      { title: `#${params.tag} across Inktella` },
      {
        name: "description",
        content: `Notes tagged #${params.tag} from public notebooks across the Tellaverse.`,
      },
      { property: "og:title", content: `#${params.tag} across Inktella` },
      {
        property: "og:description",
        content: `Notes tagged #${params.tag} from across the network.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GlobalTag,
});

function GlobalTag() {
  const { tag } = Route.useParams();
  const results = notesByTag(tag);

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-2xl px-5 py-14">
        <h1 className="text-3xl">#{tag}</h1>
        <p className="hand mt-2 text-xl opacity-70">across the Tellaverse</p>

        <ul className="mt-10 divide-y divide-border/70">
          {results.map((note) => {
            const np = getNotepage(note.notepage);
            return (
              <li key={note.id} className="py-6">
                <p className="text-sm opacity-60">{np?.owner}</p>
                <h2 className="mt-1 text-lg">
                  <Link
                    to="/$notepage/notepage/$noteId"
                    params={{ notepage: note.notepage, noteId: note.id }}
                    className="hover:underline"
                  >
                    {note.title}
                  </Link>
                </h2>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs opacity-50">{note.date}</span>
                  <LikeButton count={note.likes} />
                </div>
              </li>
            );
          })}
          {results.length === 0 && (
            <li className="py-8 opacity-60">Nobody has written under this one yet.</li>
          )}
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
}
