import { createFileRoute, Link } from "@tanstack/react-router";
import { Guestbook } from "@/components/guestbook";
import { getNotepage } from "@/data/inktella";

export const Route = createFileRoute("/$notepage/guestbook")({
  component: GuestbookPage,
});

function GuestbookPage() {
  const { notepage } = Route.useParams();
  const np = getNotepage(notepage);
  if (!np) return null;

  return (
    <main className="mx-auto min-w-0 max-w-2xl overflow-hidden px-5 py-8 sm:py-14">
      <Link to="/$notepage" params={{ notepage: np.slug }} className="text-sm opacity-60 hover:opacity-100">
        ← {np.name}
      </Link>
      <header className="mt-12 border-b border-current/15 pb-8">
        <p className="text-sm uppercase tracking-[0.18em] opacity-55">A note for the owner</p>
        <h1 className="mt-2 font-heading text-4xl tracking-tight sm:text-5xl">Guestnotes</h1>
        <p className="mt-3 max-w-[38ch] leading-relaxed opacity-70">Notes people left while they were here.</p>
      </header>
      <Guestbook notepage={np} />
    </main>
  );
}
