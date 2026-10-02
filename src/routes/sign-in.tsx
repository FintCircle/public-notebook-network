import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { portalUrl } from "@/lib/account-portal";

// Kept only as a forwarding address: sign-in lives on the Clerk Account Portal.
export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Join or sign in | Inktella" },
      { name: "description", content: "Sign in to Inktella to write notes and keep a Notepage." },
      { property: "og:title", content: "Join or sign in | Inktella" },
      { property: "og:description", content: "One tiny account, many little notes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  useEffect(() => {
    window.location.replace(portalUrl("sign-in", `${window.location.origin}/notepages`));
  }, []);
  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="hand text-2xl opacity-50">taking you to the front door…</p>
    </main>
  );
}
