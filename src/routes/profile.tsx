import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ChevronLeft, ChevronRight, Globe, Link2, Pencil, Save, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { myNotepages } from "@/lib/inktella-store";
import { updateProfile } from "@/lib/inktella.functions";
import { useAuth } from "@/lib/auth";
import { portalUrl } from "@/lib/account-portal";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Inktella" }, { name: "description", content: "Your public Inktella profile and Notepages." }] }),
  component: Profile,
});

function Profile() {
  const { isAuthenticated, user, displayName } = useAuth();
  const pages = myNotepages();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(displayName || "Your name");
  const [bio, setBio] = useState("A place for notes, observations, and unfinished thoughts.");
  const [country, setCountry] = useState("");
  const [portrait, setPortrait] = useState(user?.imageUrl ?? "");
  const [saved, setSaved] = useState(false);
  const [slide, setSlide] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  async function save() {
    if (!isAuthenticated) return;
    await updateProfile({ data: { displayName: name, bio, country, portraitUrl: portrait || null } });
    setSaved(true);
    setEditing(false);
    window.setTimeout(() => setSaved(false), 2500);
  }

  async function chooseImage(file: File | undefined) {
    if (!file || !user) return;
    await user.setProfileImage({ file });
    setPortrait(user.imageUrl);
  }

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
        <section className="rounded-[2rem] border border-border/80 bg-background p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-start">
            <div className="relative shrink-0">
              {portrait ? <img src={portrait} alt="Profile portrait" className="size-32 rounded-[1.65rem] object-cover sm:size-40" /> : <div className="flex size-32 items-center justify-center rounded-[1.65rem] bg-muted text-4xl font-semibold sm:size-40">{name.slice(0, 1).toUpperCase()}</div>}
              {editing && <button type="button" onClick={() => fileRef.current?.click()} className="absolute -bottom-3 -right-3 inline-flex size-10 items-center justify-center rounded-full border border-border bg-background shadow-sm" aria-label="Upload profile image"><Upload aria-hidden /></button>}
              <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(e) => void chooseImage(e.target.files?.[0])} />
            </div>
            <div className="min-w-0 flex-1">
              {editing ? <div className="flex flex-col gap-3"><input value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border border-border bg-transparent px-3 py-2 text-3xl font-semibold" aria-label="Display name" /><textarea value={bio} onChange={(e) => setBio(e.target.value)} className="rounded-lg border border-border bg-transparent px-3 py-2 leading-relaxed" aria-label="Bio" rows={3} /><input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className="rounded-lg border border-border bg-transparent px-3 py-2" aria-label="Country" /></div> : <><h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{name}</h1><p className="mt-5 max-w-xl text-xl leading-relaxed">{bio}</p></>}
            </div>
            {isAuthenticated && <button type="button" onClick={() => editing ? void save() : setEditing(true)} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-muted">{editing ? <Save aria-hidden /> : <Pencil aria-hidden />} {editing ? "Save profile" : "Edit profile"}</button>}
          </div>
          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4 text-sm text-muted-foreground"><span className="inline-flex items-center gap-2"><Globe aria-hidden /> {country || "Somewhere in the world"}</span><span className="inline-flex items-center gap-2"><CalendarDays aria-hidden /> On Inktella since 2026</span><span className="inline-flex items-center gap-2"><Link2 aria-hidden /> public profile</span></div>
          {saved && <p className="mt-4 text-sm text-primary" role="status">Profile saved.</p>}
          {!isAuthenticated && <p className="mt-6 text-sm text-muted-foreground"><a className="underline" href={portalUrl("sign-in")}>Sign in</a> to edit your profile.</p>}

          <div className="my-10 border-t border-border/70" />
          <div className="flex items-baseline justify-between gap-4"><div><p className="hand text-lg text-muted-foreground">your corners of the network</p><h2 className="text-3xl font-semibold tracking-tight">Notepages</h2></div><span className="text-sm text-muted-foreground">{pages.length} total</span></div>
          {pages.length ? <div className="relative mt-8"><div className="grid grid-cols-1 gap-6 sm:grid-cols-2">{pages.slice(slide, slide + 2).map((page) => <Link key={page.slug} to="/$notepage" params={{ notepage: page.slug }} className="group"><div className="flex aspect-[1.45] items-center justify-center rounded-3xl bg-muted text-2xl font-semibold transition-transform group-hover:-translate-y-1">{page.avatarInitial}</div><h3 className="mt-4 text-2xl font-semibold group-hover:underline">{page.name}</h3><p className="mt-2 text-muted-foreground">{page.description}</p></Link>)}</div>{pages.length > 2 && <div className="mt-5 flex justify-end gap-2"><button type="button" aria-label="Previous Notepages" disabled={slide === 0} onClick={() => setSlide(Math.max(0, slide - 1))} className="rounded-full border p-2 disabled:opacity-30"><ChevronLeft aria-hidden /></button><button type="button" aria-label="Next Notepages" disabled={slide + 2 >= pages.length} onClick={() => setSlide(Math.min(pages.length - 2, slide + 1))} className="rounded-full border p-2 disabled:opacity-30"><ChevronRight aria-hidden /></button></div>}</div> : <p className="mt-6 text-muted-foreground">No Notepages yet.</p>}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
