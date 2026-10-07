import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { createNotepage } from "@/lib/inktella.functions";
import { slugify, useInktellaStore } from "@/lib/inktella-store";
import { Check, ChevronLeft, ChevronRight, ImagePlus } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AuthOnly } from "@/lib/auth";

export const Route = createFileRoute("/notepages/new")({
  head: () => ({
    meta: [
      { title: "Create a Notepage | Inktella" },
      {
        name: "description",
        content: "Name and customize your personal public notebook on Inktella.",
      },
      { property: "og:title", content: "Create a Notepage | Inktella" },
      {
        property: "og:description",
        content: "Name and customize your personal public notebook on Inktella.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewNotepage,
});

const backgrounds = [
  { name: "Paper", className: "bg-paper text-ink" },
  { name: "Mist", className: "bg-secondary text-secondary-foreground" },
  { name: "Soft green", className: "bg-accent text-accent-foreground" },
] as const;
const types = ["Space Grotesk", "Instrument Serif", "Lora"] as const;

function NewNotepage() {
  return (
    <AuthOnly message="Creating a Notepage is a big step. The notebook would like to know who is holding the pen.">
      <NewNotepageForm />
    </AuthOnly>
  );
}

const backgroundTokens = [
  { bg: "oklch(0.975 0.012 90)", ink: "oklch(0.21 0.015 60)" },
  { bg: "oklch(0.95 0.01 250)", ink: "oklch(0.25 0.02 250)" },
  { bg: "oklch(0.93 0.035 145)", ink: "oklch(0.25 0.03 150)" },
] as const;

function fileToDataUrl(file: File, maxSide = 1600): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function NewNotepageForm() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [background, setBackground] = useState(0);
  const [type, setType] = useState<(typeof types)[number]>("Space Grotesk");
  const [coverUrl, setCoverUrl] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [, setCreatedSlug] = useState("");
  const navigate = useNavigate();
  const { refresh } = useInktellaStore();
  const canContinue = name.trim().length > 1 && description.trim().length > 5;
  const selectedBackground = backgrounds[background] ?? backgrounds[0];

  async function chooseCover(file?: File) {
    if (!file) return;
    try {
      setCoverUrl(await fileToDataUrl(file));
    } catch {
      setError("That image couldn't be read.");
    }
  }

  async function create() {
    setSaving(true);
    setError("");
    const tokens = backgroundTokens[background] ?? backgroundTokens[0];
    try {
      const res = await createNotepage({
        data: {
          name: name.trim(),
          description: description.trim(),
          slug: slugify(name) || "notepage",
          bg: tokens.bg,
          ink: tokens.ink,
          headingFont: type,
          ...(coverUrl ? { coverUrl } : {}),
        },
      });
      setCreatedSlug(res.slug);
      await navigate({ to: "/notepages" });
      void refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "That didn't save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-2xl px-5 py-14">
        <p className="text-xs uppercase opacity-45">Step {step} of 3</p>
        {step === 1 && (
          <section className="mt-5">
            <h1 className="text-3xl">Start a Notepage</h1>
            <p className="hand mt-2 text-xl opacity-60">give your notebook a door sign</p>
            <div className="mt-10 space-y-7">
              <div>
                <label htmlFor="page-name" className="text-sm">
                  Notepage name
                </label>
                <Input
                  id="page-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Derrick's Notes"
                  className="mt-2 h-12"
                />
              </div>
              <div>
                <label htmlFor="page-description" className="text-sm">
                  Description
                </label>
                <Textarea
                  id="page-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What tends to end up here?"
                  className="mt-2 min-h-28 resize-none"
                />
              </div>
              <Button disabled={!canContinue} onClick={() => setStep(2)}>
                Continue <ChevronRight aria-hidden />
              </Button>
            </div>
          </section>
        )}
        {step === 2 && (
          <section className="mt-5">
            <h1 className="text-3xl">Make it yours</h1>
            <p className="hand mt-2 text-xl opacity-60">choose its cover and type</p>
            <div className="mt-9">
              <p className="text-sm">Cover image</p>
              <label className="mt-3 flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input bg-muted/35 px-5 text-center text-sm transition-colors hover:bg-muted">
                <ImagePlus aria-hidden className="size-5" />
                <span>{coverUrl ? "Choose a different image" : "Choose an image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => void chooseCover(event.target.files?.[0])}
                />
              </label>
            </div>
            <div className="mt-8">
              <p className="text-sm">Background</p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {backgrounds.map((option, index) => (
                  <Button
                    key={option.name}
                    variant="outline"
                    onClick={() => setBackground(index)}
                    className={`h-20 whitespace-normal ${option.className} ${background === index ? "ring-2 ring-ring" : ""}`}
                  >
                    <span>{option.name}</span>
                    {background === index && <Check aria-hidden />}
                  </Button>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <p className="text-sm">Type</p>
              <div className="mt-3 grid gap-2">
                {types.map((font) => (
                  <Button
                    key={font}
                    variant="outline"
                    onClick={() => setType(font)}
                    className="h-12 justify-between"
                    aria-pressed={type === font}
                  >
                    <span style={{ fontFamily: font }}>{font}</span>
                    {type === font && <Check aria-hidden />}
                  </Button>
                ))}
              </div>
            </div>
            <div
              className={`relative mt-9 flex aspect-[3/4] items-end overflow-hidden p-6 ${selectedBackground.className}`}
            >
              {coverUrl && (
                <img
                  src={coverUrl}
                  alt="Your selected cover preview"
                  className="absolute inset-0 size-full object-cover"
                />
              )}
              <div
                aria-hidden
                className={coverUrl ? "notepage-cover-shade absolute inset-0" : "hidden"}
              />
              <div className={`relative z-10 ${coverUrl ? "text-[var(--np-cover-ink)]" : ""}`}>
                <p className="text-xs uppercase opacity-60">Cover preview</p>
                <h2
                  className="mt-5 max-w-[10ch] text-4xl leading-none"
                  style={{ fontFamily: type }}
                >
                  {name || "Your Notepage"}
                </h2>
                <p className="mt-4 max-w-[30ch] text-sm leading-relaxed opacity-80">
                  {description || "Your description will live here."}
                </p>
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ChevronLeft aria-hidden />
                Back
              </Button>
              <Button disabled={saving} onClick={() => void create()}>
                {saving ? "Creating…" : "Create Notepage"} <ChevronRight aria-hidden />
              </Button>
            </div>
            {error && (
              <p role="alert" className="mt-4 text-sm text-destructive">
                {error}
              </p>
            )}
          </section>
        )}
        {step === 3 && (
          <section className="mt-16 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-border">
              <Check aria-hidden />
            </span>
            <h1 className="mt-6 text-3xl">Your Notepage is ready.</h1>
            <p className="mt-3 opacity-65">
              Open your notebook area whenever you want to add a note or visit the public page.
            </p>
            <Button asChild className="mt-8">
              <Link to="/notepages">
                Go to My Notepages <ChevronRight aria-hidden />
              </Link>
            </Button>
          </section>
        )}
      </main>
    </div>
  );
}
