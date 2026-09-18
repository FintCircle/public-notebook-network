import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/notepages/new")({
  head: () => ({ meta: [
    { title: "Create a Notepage | Inktella" },
    { name: "description", content: "Name and customize your personal public notebook on Inktella." },
    { property: "og:title", content: "Create a Notepage | Inktella" },
    { property: "og:description", content: "Name and customize your personal public notebook on Inktella." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: NewNotepage,
});

const backgrounds = [
  { name: "Paper", className: "bg-paper text-ink" },
  { name: "Mist", className: "bg-secondary text-secondary-foreground" },
  { name: "Soft green", className: "bg-accent text-accent-foreground" },
] as const;
const types = ["Space Grotesk", "Instrument Serif", "Lora"] as const;

function NewNotepage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [background, setBackground] = useState(0);
  const [type, setType] = useState<(typeof types)[number]>("Space Grotesk");
  const canContinue = name.trim().length > 1 && description.trim().length > 5;
  const selectedBackground = backgrounds[background] ?? backgrounds[0];

  return (
    <div className="min-h-screen"><SiteNav /><main className="mx-auto max-w-2xl px-5 py-14">
      <p className="text-xs uppercase opacity-45">Step {step} of 3</p>
      {step === 1 && <section className="mt-5"><h1 className="text-3xl">Start a Notepage</h1><p className="hand mt-2 text-xl opacity-60">give your notebook a door sign</p><div className="mt-10 space-y-7"><div><label htmlFor="page-name" className="text-sm">Notepage name</label><Input id="page-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Derrick's Notes" className="mt-2 h-12" /></div><div><label htmlFor="page-description" className="text-sm">Description</label><Textarea id="page-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What tends to end up here?" className="mt-2 min-h-28 resize-none" /></div><Button disabled={!canContinue} onClick={() => setStep(2)}>Continue <ChevronRight aria-hidden /></Button></div></section>}
      {step === 2 && <section className="mt-5"><h1 className="text-3xl">Make it yours</h1><p className="hand mt-2 text-xl opacity-60">quiet choices are still choices</p><div className="mt-9"><p className="text-sm">Background</p><div className="mt-3 grid grid-cols-3 gap-3">{backgrounds.map((option, index) => <Button key={option.name} variant="outline" onClick={() => setBackground(index)} className={`h-20 whitespace-normal ${option.className} ${background === index ? "ring-2 ring-ring" : ""}`}><span>{option.name}</span>{background === index && <Check aria-hidden />}</Button>)}</div></div><div className="mt-8"><p className="text-sm">Type</p><div className="mt-3 grid gap-2">{types.map((font) => <Button key={font} variant="outline" onClick={() => setType(font)} className="h-12 justify-between" aria-pressed={type === font}><span style={{ fontFamily: font }}>{font}</span>{type === font && <Check aria-hidden />}</Button>)}</div></div><div className={`mt-9 border-y border-current/10 p-6 ${selectedBackground.className}`}><p className="text-xs uppercase opacity-45">Preview</p><h2 className="mt-5 text-2xl" style={{ fontFamily: type }}>{name || "Your Notepage"}</h2><p className="mt-3 text-sm leading-relaxed opacity-70">{description || "Your description will live here."}</p></div><div className="mt-8 flex gap-3"><Button variant="ghost" onClick={() => setStep(1)}><ChevronLeft aria-hidden />Back</Button><Button onClick={() => setStep(3)}>Create Notepage <ChevronRight aria-hidden /></Button></div></section>}
      {step === 3 && <section className="mt-16 text-center"><span className="mx-auto flex size-12 items-center justify-center rounded-full border border-border"><Check aria-hidden /></span><h1 className="mt-6 text-3xl">Your Notepage is ready.</h1><p className="mt-3 opacity-65">Open your notebook area whenever you want to add a note or visit the public page.</p><Button asChild className="mt-8"><Link to="/notepages">Go to My Notepages <ChevronRight aria-hidden /></Link></Button></section>}
    </main></div>
  );
}