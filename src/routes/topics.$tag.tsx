import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { LikeButton } from "@/components/like-button";
import { getNotepage, notesByTag } from "@/data/inktella";

export const Route = createFileRoute("/topics/$tag")({
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

const topicDescriptions: Record<string, string> = {
  life: "The everyday moments, questions, and experiences that make up a life.",
  writing: "Ideas, practices, and reflections from people who write things down.",
  technology: "How technology shapes the way we work, live, and understand the world.",
  programming: "Code, tools, and lessons from building software.",
  "artificial intelligence":
    "Explorations of intelligent systems and the changing relationship between people and machines.",
  business: "Thinking about companies, markets, and the work of making something useful.",
  startups: "Stories and lessons from starting, growing, and learning in public.",
  "self-improvement": "Practical ideas for becoming more thoughtful, capable, and intentional.",
  productivity: "Ways to focus attention, make progress, and spend time with purpose.",
  creativity: "The habits, sparks, and experiments behind creative work.",
};

function GlobalTag() {
  const { tag } = Route.useParams();
  const results = notesByTag(tag);
  const description =
    topicDescriptions[tag.toLowerCase()] ?? `Notes and perspectives collected under ${tag}.`;

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-2xl px-5 py-14">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Topic</p>
        <h1 className="mt-3 text-3xl">{tag}</h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">{description}</p>
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
