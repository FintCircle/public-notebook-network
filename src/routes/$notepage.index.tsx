import { useState } from "react";
import { ArrowRight, MessageCircle, Share2, UserRound } from "lucide-react";
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

  const hasCoverImage =
    (np.appearance?.backgroundType ?? (np.appearance?.backgroundImage ? "image" : "color")) ===
      "image" && Boolean(np.appearance?.backgroundImage);
  const isLightText =
    np.appearance?.textColor === "light" || (!np.appearance?.textColor && hasCoverImage);

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-transparent">
      <section
        className={`notepage-cover relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden px-6 py-8 text-[var(--np-cover-ink)] sm:px-14 sm:py-12 ${
          hasCoverImage ? "" : "notepage-cover-fallback"
        }`}
      >
        {hasCoverImage && (
          <>
            <img
              src={np.appearance.backgroundImage}
              alt={`Cover background of ${np.name}`}
              className="notepage-cover-image"
            />
            <div className={isLightText ? "cover-overlay" : "cover-overlay cover-overlay-light"} />
          </>
        )}

        {/* Top Bar: Branding & Share */}
        <header className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <Link
              to="/"
              className="group block focus:outline-none focus:ring-2 focus:ring-current/40 rounded-sm"
            >
              <p className="font-heading text-2xl font-bold tracking-tight sm:text-4xl drop-shadow-sm">
                Inktella
              </p>
              <p className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.38em] opacity-80 sm:text-xs">
                Notepages
              </p>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {shareStatus && (
              <span
                role="status"
                className="text-xs font-medium backdrop-blur-md bg-black/20 text-white px-2.5 py-1 rounded-full animate-fade-in"
              >
                {shareStatus}
              </span>
            )}
            <button
              type="button"
              aria-label="Share this Notepage"
              onClick={shareNotepage}
              className="grid min-h-[44px] min-w-[44px] size-11 place-items-center rounded-full border border-current/20 bg-black/20 text-white backdrop-blur-md transition-all hover:bg-black/30 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <Share2 aria-hidden className="size-5" />
            </button>
          </div>
        </header>

        {/* Main Lower Area: Title, Description, CTA */}
        <div className="relative z-10 my-auto pt-16 pb-12 sm:pt-20 sm:pb-16 max-w-2xl">
          <div className="mb-3 inline-block rounded-full bg-current/10 backdrop-blur-sm px-3.5 py-1 text-[0.68rem] font-medium uppercase tracking-[0.2em] opacity-90 sm:text-xs">
            A Notepage by {np.owner}
          </div>

          <h1 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl sm:leading-[1.02] drop-shadow-md">
            {np.name}
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed opacity-90 sm:text-xl sm:leading-relaxed drop-shadow">
            {np.description}
          </p>

          <div className="mt-7 sm:mt-8">
            <Link
              to="/$notepage/notes"
              params={{ notepage: np.slug }}
              className="inline-flex min-h-[48px] items-center gap-3 rounded-full bg-[var(--np-accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-all hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white"
            >
              Start reading <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>

        {/* Bottom Navigation & Status */}
        <footer className="relative z-10 flex flex-col gap-4 border-t border-current/15 pt-5 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
          <nav
            className="flex items-center gap-6 text-sm font-medium"
            aria-label="Notepage sections"
          >
            <Link
              to="/$notepage/about"
              params={{ notepage: np.slug }}
              className="inline-flex min-h-[44px] items-center gap-2 opacity-85 transition-opacity hover:opacity-100 focus:outline-none focus:underline"
            >
              <UserRound aria-hidden className="size-4" /> About
            </Link>
            <Link
              to="/$notepage/guestnote"
              params={{ notepage: np.slug }}
              className="inline-flex min-h-[44px] items-center gap-2 opacity-85 transition-opacity hover:opacity-100 focus:outline-none focus:underline"
            >
              <MessageCircle aria-hidden className="size-4" /> Guestnotes
            </Link>
          </nav>

          <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.25em] opacity-75 sm:justify-end">
            <span className="hidden sm:inline">a more human internet</span>
            <span className="inline-flex items-center gap-2">
              01 <span className="h-px w-8 bg-current/60" />
            </span>
          </div>
        </footer>
      </section>
    </main>
  );
}
