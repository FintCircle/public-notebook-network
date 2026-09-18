import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ugandaSilhouette from "@/assets/uganda-silhouette.png";
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
  const [headerStyle, setHeaderStyle] = useState<"circle" | "frame" | "polaroid">("circle");
  if (!np) return null;

  return (
    <main className="mx-auto max-w-2xl px-5 py-10 sm:py-14">
      <header className="relative overflow-hidden border-b border-current/15 pb-9">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="min-w-0 flex-1">
            <p className="hand text-lg opacity-65">a public notebook</p>
            <h1 className="mt-2 font-heading text-4xl leading-none tracking-tight sm:text-5xl">{np.name}</h1>
            <p className="mt-5 max-w-[38ch] text-lg leading-snug opacity-75">{np.description}</p>

            <div className="mt-7 flex items-center gap-3">
              <img
                src={np.portrait}
                alt={`${np.owner}, owner of ${np.name}`}
                className={`size-12 object-cover transition-all ${
                  headerStyle === "circle" ? "rounded-full" : headerStyle === "frame" ? "rounded-md border-2 border-current p-1" : "rounded-sm border border-current/20 p-1"
                }`}
              />
              <div>
                <p className="text-sm font-medium">{np.owner}</p>
                <p className="text-xs opacity-60">writing from {np.country}</p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-start gap-3 pt-1">
            <img src={ugandaSilhouette} alt="Silhouette of Uganda" className="h-20 w-14 object-contain opacity-65" />
            <div className="text-right text-xs uppercase tracking-[0.16em] opacity-55">
              <p>{np.country}</p>
              <p className="mt-1">{np.countryCode}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs opacity-55">
            <span>portrait style</span>
            <div className="flex rounded-full border border-current/20 p-0.5" role="group" aria-label="Portrait style">
              {(["circle", "frame", "polaroid"] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  aria-pressed={headerStyle === style}
                  onClick={() => setHeaderStyle(style)}
                  className={`rounded-full px-2.5 py-1 capitalize transition-colors ${headerStyle === style ? "bg-current/10 text-current" : "hover:bg-current/5"}`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
          <AboutSheet notepage={np} />
        </div>
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
