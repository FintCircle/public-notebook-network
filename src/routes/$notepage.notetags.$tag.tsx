import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getNotepage, notesByTag } from "@/data/inktella";

export const Route = createFileRoute("/$notepage/notetags/$tag")({
  head: ({ params }) => {
    const np = getNotepage(params.notepage);
    const title = np
      ? `#${params.tag} in ${np.name}`
      : `#${params.tag} | Inktella`;
    const description = np
      ? `Notes tagged #${params.tag} from ${np.name}, and the same thread across the Tellaverse.`
      : `Notes tagged #${params.tag}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: LocalTag,
});

function LocalTag() {
  const { notepage, tag } = Route.useParams();
  const np = getNotepage(notepage);
  const [scope, setScope] = useState<"local" | "tellaverse">("local");
  const results = notesByTag(tag, scope === "local" ? notepage : undefined);
  if (!np) return null;

  const tabClass = (active: boolean) =>
    active
      ? "border-b-2 border-current pb-1 text-xs tracking-[0.2em] uppercase"
      : "border-b-2 border-transparent pb-1 text-xs tracking-[0.2em] uppercase opacity-45 hover:opacity-80";

  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <Link
        to="/$notepage"
        params={{ notepage }}
        className="hand text-xl opacity-70 hover:opacity-100"
      >
        ← {np.name}
      </Link>

      <h1 className="mt-10 text-3xl">#{tag}</h1>
      <p className="mt-2 text-sm opacity-60">
        {scope === "local"
          ? `Notes from ${np.owner}`
          : "Notes from across Inktella"}
      </p>

      <div className="mt-8 flex gap-7">
        <button type="button" onClick={() => setScope("local")} className={tabClass(scope === "local")}>
          {np.owner}
        </button>
        <button
          type="button"
          onClick={() => setScope("tellaverse")}
          className={tabClass(scope === "tellaverse")}
        >
          Tellaverse
        </button>
      </div>

      <ul className="mt-10 divide-y divide-current/10">
        {results.map((note) => {
          const owner = getNotepage(note.notepage);
          return (
            <li key={note.id} className="py-5">
              {scope === "tellaverse" && (
                <p className="text-sm opacity-55">{owner?.owner}</p>
              )}
              <h2 className="mt-1 text-lg">
                <Link
                  to="/$notepage/notepage/$noteId"
                  params={{ notepage: note.notepage, noteId: note.id }}
                  className="hover:underline"
                >
                  {note.title}
                </Link>
              </h2>
              <p className="mt-1 text-xs opacity-50">{note.date}</p>
            </li>
          );
        })}
        {results.length === 0 && (
          <li className="py-8 opacity-60">Nothing under this Notetag yet.</li>
        )}
      </ul>
    </main>
  );
}
