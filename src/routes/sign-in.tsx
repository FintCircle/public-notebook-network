import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Join or sign in | Inktella" },
      { name: "description", content: "Sign in to Inktella with a magic link or Google to write notes and keep a Notepage." },
      { property: "og:title", content: "Join or sign in | Inktella" },
      { property: "og:description", content: "One tiny account, many little notes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const { isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!loading && isAuthenticated) {
    return (
      <div className="min-h-screen"><SiteNav /><main className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="hand text-3xl">You&apos;re in. The notebook has noticed.</p>
        <div className="mt-6 flex justify-center gap-5 text-sm">
          <Link to="/notepages" className="underline underline-offset-4">My Notepages</Link>
          <Link to="/notella" className="underline underline-offset-4">Read around</Link>
        </div>
      </main></div>
    );
  }

  async function sendLink(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/sign-in` },
    });
    setBusy(false);
    if (err) setError(err.message);
    else setSent(true);
  }

  async function google() {
    setError("");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/sign-in` });
    if (result.error) setError(result.error.message ?? "Google sign-in didn't work. Try again.");
  }

  return (
    <div className="min-h-screen"><SiteNav /><main className="mx-auto flex max-w-md flex-col items-center px-5 py-20 text-center sm:py-28">
      <p className="hand text-3xl text-muted-foreground">one tiny account, many little notes</p>
      <h1 className="mt-4 font-heading text-4xl tracking-tight sm:text-5xl">Come on in.</h1>
      <p className="mt-5 leading-relaxed text-muted-foreground">Write, like notes, leave guestnotes, and keep a Notepage.</p>

      <Button type="button" variant="outline" onClick={google} className="mt-9 h-12 w-full">Continue with Google</Button>

      <div className="my-7 flex w-full items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>

      {sent ? (
        <div className="w-full rounded-md border border-border p-5">
          <p className="hand text-2xl">check your inbox</p>
          <p className="mt-2 text-sm text-muted-foreground">We sent a sign-in link to {email}. Open it on this device.</p>
          <button type="button" onClick={() => setSent(false)} className="mt-3 text-xs underline underline-offset-4">Use a different email</button>
        </div>
      ) : (
        <form onSubmit={sendLink} className="flex w-full flex-col gap-3">
          <label htmlFor="email" className="sr-only">Email</label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-12" />
          <Button type="submit" disabled={busy} className="h-12">{busy ? "Sending…" : "Email me a magic link"}</Button>
        </form>
      )}
      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
    </main><SiteFooter /></div>
  );
}
