import { useState } from "react";
import { ArrowRight, Share2, UserRound } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getNotepage } from "@/data/inktella";

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
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  if (!np) return null;

  const shareNotepage = async () => {
    const shareData = {
      title: `${np.name} — a notebook on Inktella`,
      text: np.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareStatus("Shared");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setShareStatus("Unable to share");
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareStatus("Link copied");
    } catch {
      setShareStatus("Copy unavailable");
    }
  };

  return (
    <main className="h-[100svh] overflow-hidden bg-black">
      <section className="notepage-cover relative flex h-full min-h-[100svh] overflow-hidden px-7 pb-9 pt-8 text-[var(--np-cover-ink)] sm:px-16 sm:pb-14 sm:pt-12">
        <img
          src={np.portrait}
          alt={`${np.owner}, owner of ${np.name}`}
          width={816}
          height={816}
          className="absolute inset-0 size-full object-cover object-center opacity-75"
        />
        <div aria-hidden className="notepage-cover-shade absolute inset-0" />

        <div className="relative z-10 flex w-full flex-col">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-heading text-3xl tracking-[-0.04em] sm:text-5xl">Inktella</p>
              <p className="mt-1 text-[0.6rem] uppercase tracking-[0.42em] opacity-75 sm:text-xs">Notepages</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button type="button" aria-label="Share this Notepage" onClick={shareNotepage} className="grid size-14 place-items-center rounded-full bg-white/15 backdrop-blur-sm transition-colors hover:bg-white/25">
                <Share2 aria-hidden className="size-6" />
              </button>
              {shareStatus && <span role="status" className="text-[0.65rem] opacity-80">{shareStatus}</span>}
            </div>
          </div>

          <div className="mt-auto grid gap-7 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-16">
            <div className="-mx-2 rounded-2xl bg-black/20 p-2 backdrop-blur-[2px] sm:mx-0 sm:rounded-none sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
              <div className="mb-3 flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.16em] opacity-85 sm:mb-5 sm:gap-3 sm:text-sm sm:tracking-[0.2em]">
                <span>{np.owner}</span>
                <span className="h-px w-7 bg-current/70" />
                <span className="normal-case tracking-normal">{np.country}</span>
              </div>
              <h1 className="max-w-[13ch] font-heading text-3xl leading-[0.98] tracking-[-0.035em] sm:text-6xl">{np.name}</h1>
              <p className="mt-3 max-w-[35ch] text-xs leading-relaxed opacity-85 sm:mt-4 sm:text-lg">{np.description}</p>
                <Link
                  to="/$notepage/notes"
                  params={{ notepage: np.slug }}
                  className="mt-5 inline-flex items-center gap-5 rounded-full bg-[var(--np-cover-ink)] px-5 py-3 text-xs font-medium text-black transition-transform hover:scale-[1.02] sm:mt-6 sm:gap-6 sm:px-6 sm:py-3.5 sm:text-sm"
                >
                  Start reading <ArrowRight aria-hidden />
                </Link>
            </div>

            <nav className="flex items-center gap-6 border-t border-white/25 pt-3 text-xs sm:gap-7 sm:border-t-0 sm:border-l sm:pl-8 sm:pt-4 sm:text-sm" aria-label="Notepage">
              <Link to="/$notepage/about" params={{ notepage: np.slug }} className="flex items-center gap-2 opacity-90 hover:opacity-100"><UserRound aria-hidden className="size-5" /> About</Link>
            </nav>
          </div>

          <div className="mt-10 flex items-center justify-between text-[0.6rem] uppercase tracking-[0.32em] opacity-70 sm:mt-12 sm:text-xs">
            <span>a more human internet</span>
            <span>01 <span className="ml-3 inline-block w-10 align-middle border-t border-current/70" /></span>
          </div>
        </div>
      </section>
    </main>
  );
}
