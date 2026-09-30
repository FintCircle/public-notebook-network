import { createFileRoute, Link } from "@tanstack/react-router";
import { SignIn as ClerkSignIn } from "@clerk/clerk-react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { useAuth } from "@/lib/auth";

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
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen"><SiteNav /><main className="mx-auto flex max-w-md flex-col items-center px-5 py-16 text-center sm:py-24">
      {isAuthenticated ? (
        <>
          <p className="hand text-3xl">You&apos;re in. The notebook has noticed.</p>
          <div className="mt-6 flex justify-center gap-5 text-sm">
            <Link to="/notepages" className="underline underline-offset-4">My Notepages</Link>
            <Link to="/notella" className="underline underline-offset-4">Read around</Link>
          </div>
        </>
      ) : (
        <>
          <p className="hand text-3xl text-muted-foreground">one tiny account, many little notes</p>
          <h1 className="mt-4 mb-8 font-heading text-4xl tracking-tight sm:text-5xl">Come on in.</h1>
          <ClerkSignIn routing="hash" forceRedirectUrl="/notepages" signUpForceRedirectUrl="/notepages" />
        </>
      )}
    </main><SiteFooter /></div>
  );
}
