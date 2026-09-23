import { useState } from "react";
import { ArrowRight, Feather, MessageCircle, Share2, UserRound } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getNotepage } from "@/data/inktella";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const [inkAmount, setInkAmount] = useState("1");
  const [inkNote, setInkNote] = useState("");
  const [inkSent, setInkSent] = useState(false);
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
    <main className="h-[100dvh] w-full overflow-hidden bg-transparent">
      <section className="notepage-cover relative flex h-[100dvh] min-h-[100dvh] w-full overflow-hidden px-7 pb-9 pt-8 text-[var(--np-cover-ink)] sm:px-16 sm:pb-14 sm:pt-12">
        <div className="relative z-10 flex w-full flex-col">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-heading text-3xl tracking-[-0.04em] sm:text-5xl">Inktella</p>
              <p className="mt-1 text-[0.6rem] uppercase tracking-[0.42em] opacity-75 sm:text-xs">
                Notepages
              </p>
            </div>
            <div className="absolute right-0 top-0 flex items-center gap-2">
              {np.inkProgramApproved && (
                <Sheet onOpenChange={(open) => { if (open) setInkSent(false); }}>
                  <SheetTrigger asChild>
                    <button
                      type="button"
                      aria-label={`Ink ${np.owner}`}
                      className="grid size-14 place-items-center rounded-full border border-black/15 bg-white/70 transition-colors hover:bg-white"
                    >
                      <Feather aria-hidden className="size-6" />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="rounded-t-[2rem] border-black/10 bg-[#fbfaf6] px-6 pb-8 pt-8 text-[#171717] sm:mx-auto sm:max-w-xl">
                    <SheetHeader className="text-left">
                      <SheetTitle className="font-heading text-3xl tracking-tight">Ink {np.owner}</SheetTitle>
                      <SheetDescription className="max-w-md leading-relaxed text-[#55514a]">
                        Ink is a small way to support the people whose notes you return to. You have 24 ink to give.
                      </SheetDescription>
                    </SheetHeader>
                    {inkSent ? (
                      <div className="mt-8 rounded-2xl border border-black/10 p-5 text-center">
                        <p className="font-heading text-xl">Ink sent.</p>
                        <p className="mt-1 text-sm text-[#55514a]">Your note is on its way to {np.owner}.</p>
                      </div>
                    ) : (
                      <form
                        className="mt-7 grid gap-5"
                        onSubmit={(event) => { event.preventDefault(); setInkSent(true); }}
                      >
                        <label className="grid gap-2 text-sm font-medium" htmlFor="ink-amount">
                          How much ink?
                          <input
                            id="ink-amount"
                            type="number"
                            min="1"
                            max="24"
                            inputMode="numeric"
                            value={inkAmount}
                            onChange={(event) => setInkAmount(event.target.value)}
                            className="rounded-xl border border-black/15 bg-transparent px-4 py-3 text-lg outline-none focus:border-black"
                          />
                        </label>
                        <label className="grid gap-2 text-sm font-medium" htmlFor="ink-note">
                          Note <span className="font-normal text-[#77736c]">(optional)</span>
                          <textarea
                            id="ink-note"
                            rows={3}
                            value={inkNote}
                            onChange={(event) => setInkNote(event.target.value)}
                            placeholder={`Say something kind to ${np.owner}…`}
                            className="resize-none rounded-xl border border-black/15 bg-transparent px-4 py-3 font-normal outline-none placeholder:text-[#99948b] focus:border-black"
                          />
                        </label>
                        <button type="submit" className="rounded-full bg-[#171717] px-5 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-85">
                          Send ink to {np.owner}
                        </button>
                      </form>
                    )}
                  </SheetContent>
                </Sheet>
              )}
              <button
                type="button"
                aria-label="Share this Notepage"
                onClick={shareNotepage}
                className="grid size-14 place-items-center rounded-full border border-black/15 bg-white/70 transition-colors hover:bg-white"
              >
                <Share2 aria-hidden className="size-6" />
              </button>
              {shareStatus && (
                <span role="status" className="text-[0.65rem] opacity-80">
                  {shareStatus}
                </span>
              )}
            </div>
          </div>

          <div className="mt-auto grid gap-7 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-16">
            <div className="sm:mx-0 sm:p-0">
              <img
                src={np.portrait}
                alt={`${np.owner}, owner of ${np.name}`}
                className="notepage-owner-image mt-7 mb-3 h-auto w-[min(42vw,9.5rem)] sm:mt-5 sm:mb-4 sm:w-[min(27vw,17rem)]"
              />
              <div className="mb-3 flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.16em] opacity-85 sm:mb-5 sm:gap-3 sm:text-sm sm:tracking-[0.2em]">
                <span>{np.owner}</span>
                <span className="h-px w-7 bg-current/70" />
                <span className="normal-case tracking-normal">{np.country}</span>
              </div>
              <h1 className="max-w-[13ch] font-heading text-3xl leading-[0.98] tracking-[-0.035em] sm:text-6xl">
                {np.name}
              </h1>
              <p className="mt-3 max-w-[35ch] text-xs leading-relaxed opacity-85 sm:mt-4 sm:text-lg">
                {np.description}
              </p>
              <Link
                to="/$notepage/notes"
                params={{ notepage: np.slug }}
                className="mt-5 inline-flex items-center gap-5 rounded-full bg-[var(--np-cover-ink)] px-5 py-3 text-xs font-medium text-black transition-transform hover:scale-[1.02] sm:mt-6 sm:gap-6 sm:px-6 sm:py-3.5 sm:text-sm"
              >
                Start reading <ArrowRight aria-hidden />
              </Link>
            </div>

            <nav
              className="flex items-center gap-6 border-t border-black/15 pt-3 text-xs sm:gap-7 sm:border-t-0 sm:border-l sm:border-black/15 sm:pl-8 sm:pt-4 sm:text-sm"
              aria-label="Notepage"
            >
              <Link
                to="/$notepage/about"
                params={{ notepage: np.slug }}
                className="flex items-center gap-2 opacity-90 hover:opacity-100"
              >
                <UserRound aria-hidden className="size-5" /> About
              </Link>
              <Link
                to="/$notepage/guestnote"
                params={{ notepage: np.slug }}
                className="flex items-center gap-2 opacity-90 hover:opacity-100"
              >
                <MessageCircle aria-hidden className="size-5" /> Guestnotes
              </Link>
            </nav>
          </div>

          <div className="mt-10 flex items-center justify-between text-[0.6rem] uppercase tracking-[0.32em] opacity-70 sm:mt-12 sm:text-xs">
            <span>a more human internet</span>
            <span>
              01 <span className="ml-3 inline-block w-10 align-middle border-t border-current/70" />
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
