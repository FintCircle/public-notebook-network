import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, ImagePlus, Save } from "lucide-react";
import { useRef, useState } from "react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { updateProfile } from "@/lib/inktella.functions";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/manage-profile")({ head: () => ({ meta: [{ title: "Manage profile — Inktella" }, { name: "description", content: "Edit your Inktella profile." }] }), component: ManageProfile });

function ManageProfile() {
  const { isAuthenticated, user, displayName } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(displayName || "");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [portrait, setPortrait] = useState(user?.imageUrl || "");
  const [saved, setSaved] = useState(false);
  if (!isAuthenticated) return <div className="min-h-screen"><SiteNav /><main className="mx-auto max-w-xl px-5 py-16"><h1 className="text-3xl font-semibold">Sign in to manage your profile.</h1></main></div>;
  async function chooseImage(file?: File) { if (!file || !user) return; await user.setProfileImage({ file }); setPortrait(user.imageUrl); }
  async function save() { await updateProfile({ data: { displayName: name, bio, country, portraitUrl: portrait.startsWith("https://img.clerk.com/") ? portrait : null } }); setSaved(true); setTimeout(() => void navigate({ to: "/profile" }), 700); }
  return <div className="min-h-screen"><SiteNav /><main className="mx-auto max-w-xl px-5 py-8 sm:py-12"><Link to="/profile" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft aria-hidden /> Profile</Link><header className="mt-8"><p className="hand text-lg text-muted-foreground">make it yours</p><h1 className="mt-1 text-4xl font-semibold tracking-tight">Manage profile</h1><p className="mt-3 text-muted-foreground">This is the profile people see when they find your notes.</p></header><form onSubmit={(e) => { e.preventDefault(); void save(); }} className="mt-8 flex flex-col gap-5"><div className="flex items-center gap-4"><div className="flex size-20 items-center justify-center overflow-hidden rounded-2xl bg-muted text-2xl font-semibold">{portrait ? <img src={portrait} alt="Your profile portrait" className="size-full object-cover" /> : name.slice(0, 1).toUpperCase()}</div><button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-muted"><ImagePlus aria-hidden /> Upload image</button><input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(e) => void chooseImage(e.target.files?.[0])} /></div><label className="flex flex-col gap-2 text-sm">Display name<input value={name} onChange={(e) => setName(e.target.value)} required className="rounded-xl border border-border bg-transparent px-3 py-2" /></label><label className="flex flex-col gap-2 text-sm">Bio<textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="rounded-xl border border-border bg-transparent px-3 py-2" /></label><label className="flex flex-col gap-2 text-sm">Country<input value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-xl border border-border bg-transparent px-3 py-2" /></label><button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm text-primary-foreground"><Save aria-hidden /> Save profile</button>{saved && <p className="inline-flex items-center gap-2 text-sm text-primary" role="status"><Check aria-hidden /> Saved</p>}</form></main><SiteFooter /></div>;
}

export default ManageProfile;
