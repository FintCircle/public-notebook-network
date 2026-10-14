import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ChevronLeft, ChevronRight, Globe, Link2 } from "lucide-react";
import { useState } from "react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { myNotepages } from "@/lib/inktella-store";
import { useAuth } from "@/lib/auth";
import { portalUrl } from "@/lib/account-portal";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Inktella" }, { name: "description", content: "A public Inktella profile and its Notepages." }] }),
  component: Profile,
});

function Profile() {
  const { isAuthenticated, user, displayName } = useAuth();
  const pages = myNotepages();
  const [slide, setSlide] = useState(0);
  const name = displayName || "An Inktella member";
  const portrait = user?.imageUrl;

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <section className="rounded-[1.75rem] border border-border/80 bg-background p-5 shadow-sm sm:p-7">
          <div className="flex items-start gap-4 sm:gap-6">
            {portrait ? <img src={portrait} alt={`${name} profile portrait`} className="size-20 rounded-2xl object-cover sm:size-24" /> : <div className="flex size-20 items-center justify-center rounded-2xl bg-muted text-3xl font-semibold sm:size-24">{name.slice(0, 1).toUpperCase()}</div>}
            <div className="min-w-0 flex-1">
              <p className="hand text-base text-muted-foreground">public profile</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{name}</h1>
              <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">A place for notes, observations, and unfinished thoughts.</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Globe aria-hidden /> Somewhere in the world</span><span className="inline-flex items-center gap-1.5"><CalendarDays aria-hidden /> On Inktella since 2026</span><span className="inline-flex items-center gap-1.5"><Link2 aria-hidden /> public</span></div>
          {isAuthenticated ? <Link to="/manage-profile" className="mt-6 inline-flex rounded-full border border-border px-4 py-2 text-sm hover:bg-muted">Manage profile</Link> : <p className="mt-6 text-sm text-muted-foreground"><a className="underline" href={portalUrl("sign-in")}>Sign in</a> to manage your profile.</p>}
          <div className="my-8 border-t border-border/70" />
          <div className="flex items-baseline justify-between gap-4"><div><p className="hand text-base text-muted-foreground">their corners of the network</p><h2 className="text-2xl font-semibold tracking-tight">Notepages</h2></div><span className="text-sm text-muted-foreground">{pages.length}</span></div>
          {pages.length ? <div className="relative mt-5"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{pages.slice(slide, slide + 2).map((page) => <Link key={page.slug} to="/$notepage" params={{ notepage: page.slug }} className="group"><div className="flex aspect-[1.7] items-center justify-center rounded-2xl bg-muted text-2xl font-semibold transition-transform group-hover:-translate-y-1">{page.avatarInitial}</div><h3 className="mt-3 text-lg font-semibold group-hover:underline">{page.name}</h3><p className="mt-1 text-sm text-muted-foreground">{page.description}</p></Link>)}</div>{pages.length > 2 && <div className="mt-4 flex justify-end gap-2"><button type="button" aria-label="Previous Notepages" disabled={!slide} onClick={() => setSlide(Math.max(0, slide - 1))} className="rounded-full border p-2 disabled:opacity-30"><ChevronLeft aria-hidden /></button><button type="button" aria-label="Next Notepages" disabled={slide + 2 >= pages.length} onClick={() => setSlide(Math.min(pages.length - 2, slide + 1))} className="rounded-full border p-2 disabled:opacity-30"><ChevronRight aria-hidden /></button></div>}</div> : <p className="mt-5 text-sm text-muted-foreground">No Notepages yet.</p>}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export default Profile;
