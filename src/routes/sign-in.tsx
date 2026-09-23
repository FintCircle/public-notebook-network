import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/sign-in")({
  component: SignIn,
});

function SignIn() {
  const { isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <main className="mx-auto max-w-2xl px-5 py-24 text-center"><p className="hand text-3xl">You&apos;re already in. The notebook has noticed.</p><Link to="/" className="mt-6 inline-block underline">Back home</Link></main>;
  }

  return (
    <div className="min-h-screen"><SiteNav /><main className="mx-auto flex max-w-xl flex-col items-center px-5 py-20 text-center sm:py-28">
      <p className="hand text-3xl text-muted-foreground">one tiny account, many little notes</p>
      <h1 className="mt-4 font-heading text-4xl tracking-tight sm:text-5xl">Come on in.</h1>
      <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">Sign in to write, like notes, leave guestnotes, and make a Notepage. Google sign-in will be connected here next.</p>
      <button type="button" onClick={() => { signIn(); navigate({ to: "/notella" }); }} className="mt-8 rounded-md bg-primary px-6 py-3 text-sm text-primary-foreground">Continue with Google</button>
      <p className="mt-4 text-xs text-muted-foreground">Preview setup only — no Google account is requested yet.</p>
    </main><SiteFooter /></div>
  );
}
