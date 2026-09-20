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
  if (!np) return null;

  return (
    <main className="h-[100svh] overflow-hidden bg-black">
      <section className="notepage-cover relative flex h-full min-h-[100svh] overflow-hidden px-7 pb-9 pt-8 text-[var(--np-cover-ink)] sm:px-16 sm:pb-14 sm:pt-12">
        <img
          src={np.portrait}
          alt={`${np.owner}, owner of ${np.name}`}
          width={816}
          height={816}
          className="absolute inset-0 size-full object-cover object-center opacity-55"
        />
        <div aria-hidden className="notepage-cover-shade absolute inset-0" />

        <div className="relative z-10 flex w-full flex-col">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-heading text-3xl tracking-[-0.04em] sm:text-5xl">Inktella</p>
              <p className="mt-1 text-[0.6rem] uppercase tracking-[0.42em] opacity-75 sm:text-xs">Notepages</p>
            </div>
            <button type="button" aria-label="Share this Notepage" className="grid size-14 place-items-center rounded-full bg-white/15 backdrop-blur-sm transition-colors hover:bg-white/25">
              <Share2 aria-hidden className="size-6" />
            </button>
          </div>

          <div className="mt-auto grid gap-10 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-16">
            <div>
              <div className="mb-5 flex items-center gap-3 text-sm uppercase tracking-[0.2em] opacity-85">
                <span>{np.owner}</span>
                <span className="h-px w-7 bg-current/70" />
                <span className="normal-case tracking-normal">{np.country}</span>
              </div>
              <h1 className="max-w-[13ch] font-heading text-4xl leading-[0.94] tracking-[-0.04em] sm:text-6xl">{np.name}</h1>
              <p className="mt-4 max-w-[35ch] text-sm leading-relaxed opacity-85 sm:text-lg">{np.description}</p>
                <Link
                  to="/$notepage/notes"
                  params={{ notepage: np.slug }}
                  className="mt-6 inline-flex items-center gap-6 rounded-full bg-[var(--np-cover-ink)] px-6 py-3.5 text-sm font-medium text-black transition-transform hover:scale-[1.02]"
                >
                  Start reading <ArrowRight aria-hidden />
                </Link>
            </div>

            <nav className="flex items-center gap-7 border-t border-white/25 pt-4 text-sm sm:border-t-0 sm:border-l sm:pl-8" aria-label="Notepage">
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
