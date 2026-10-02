import { createFileRoute }
import { portalUrl } from "@/lib/account-portal"; from "@tanstack/react-router";

export const Route = createFileRoute("/signed-out")({
  head: () => ({
    meta: [{ title: "See you soon — Inktella" }],
  }),
  component: SignedOut,
});

function SignedOut() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5 py-16">
      <section className="max-w-md text-center">
        <p className="hand text-3xl text-muted-foreground">the notebook is waving from the window</p>
        <h1 className="mt-4 font-heading text-4xl tracking-tight">See you soon.</h1>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          Your little corner is tucked away safely. Come back when another thought starts knocking.
        </p>
        <a
          href={portalUrl("sign-in", "https://inktella.com/notepages")}
          className="mt-8 inline-flex rounded-md bg-primary px-5 py-3 text-sm text-primary-foreground transition-opacity hover:opacity-90"
        >
          Log in again
        </a>
      </section>
    </main>
  );
}
