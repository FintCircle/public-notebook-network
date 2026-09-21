import { ArrowLeft } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Guestnote } from "@/components/guestnote";
import { getNotepage } from "@/data/inktella";

export const Route = createFileRoute("/$notepage/guestnote")({
  component: GuestnotePage,
});

function GuestnotePage() {
  const { notepage } = Route.useParams();
  const np = getNotepage(notepage);
  if (!np) return null;

  return (
    <main className="min-h-screen overflow-x-hidden bg-transparent px-5 pb-28 pt-7 sm:px-10 sm:pb-16 sm:pt-12">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/$notepage"
          params={{ notepage: np.slug }}
          className="inline-flex items-center gap-2 text-sm opacity-65 transition-opacity hover:opacity-100"
        >
          <ArrowLeft aria-hidden className="size-4" />
          Back to {np.name}
        </Link>

        <header className="relative mt-14 max-w-3xl sm:mt-16">
          <p className="hand text-xl opacity-70 sm:text-2xl">A little corner for kind words</p>
          <h1 className="mt-2 font-heading text-5xl tracking-[-0.055em] sm:text-7xl">Guestnotes</h1>
          <p className="mt-5 max-w-[36ch] text-lg leading-relaxed opacity-65 sm:text-xl">
            Notes from people who stopped by, stayed awhile, and left something human behind.
          </p>
          <div aria-hidden className="mt-8 h-px max-w-md bg-current/15" />
        </header>

        <Guestnote notepage={np} />

        <p className="hand mt-10 text-center text-xl opacity-60 sm:text-2xl">
          Real people. Real notes. A kinder internet.
        </p>
      </div>
    </main>
  );
}
