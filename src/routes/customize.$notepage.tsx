import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Type } from "lucide-react";
import { useState } from "react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { getNotepage, themeStyle } from "@/data/inktella";

const fontPacks = [
  {
    id: "space",
    name: "Modern notebook",
    heading: '"Space Grotesk", sans-serif',
    body: '"DM Sans", sans-serif',
    hand: '"Caveat", cursive',
  },
  {
    id: "literary",
    name: "Literary",
    heading: '"Instrument Serif", serif',
    body: '"Lora", serif',
    hand: '"Gloria Hallelujah", cursive',
  },
  {
    id: "quiet",
    name: "Quiet studio",
    heading: '"DM Sans", sans-serif',
    body: '"DM Sans", sans-serif',
    hand: '"Caveat", cursive',
  },
] as const;

export const Route = createFileRoute("/customize/$notepage")({
  beforeLoad: ({ params }) => {
    if (!getNotepage(params.notepage)) throw notFound();
  },
  component: CustomizeNotepage,
});

function CustomizeNotepage() {
  const { notepage: slug } = Route.useParams();
  const np = getNotepage(slug);
  const [fontPack, setFontPack] = useState(fontPacks[0]);
  const [header, setHeader] = useState(np?.header ?? {
    navLabel: np?.name ?? "Notepage",
    eyebrow: "the notebook entries",
    title: `Notes from ${np?.owner ?? "you"}`,
    description: np?.description ?? "",
  });
  if (!np) return null;

  return (
    <div
      className="min-h-screen"
      style={
        {
          ...themeStyle(np),
          "--np-heading": fontPack.heading,
          "--np-body": fontPack.body,
          "--np-hand": fontPack.hand,
        } as React.CSSProperties
      }
    >
      <SiteNav />
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <Link
          to="/notepages"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft aria-hidden /> Back to Notepages
        </Link>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{np.name}</p>
            <h1 className="mt-1 text-4xl">Customize</h1>
            <p className="hand mt-2 text-xl opacity-65">make this corner feel like yours</p>
          </div>
          <Button>
            <Check aria-hidden /> Save changes
          </Button>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <section className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-7">
              <div className="flex items-center gap-2">
                <Type aria-hidden className="size-5" />
                <h2 className="text-lg font-semibold">Upper section</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Write the welcome text readers see before your notes.</p>
              <div className="mt-5 grid gap-4">
                {([['navLabel', 'Back-link label'], ['eyebrow', 'Small handwritten line'], ['title', 'Heading'], ['description', 'Description']] as const).map(([field, label]) => (
                  <label key={field} className="grid gap-2 text-sm font-medium">
                    {label}
                    {field === "description" ? (
                      <textarea value={header[field]} onChange={(event) => setHeader({ ...header, [field]: event.target.value })} rows={3} className="rounded-xl border border-border/70 bg-background px-3 py-2 font-normal" />
                    ) : (
                      <input value={header[field]} onChange={(event) => setHeader({ ...header, [field]: event.target.value })} className="rounded-xl border border-border/70 bg-background px-3 py-2 font-normal" />
                    )}
                  </label>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-7">
              <div className="flex items-center gap-2">
                <Type aria-hidden className="size-5" />
                <h2 className="text-lg font-semibold">Font pack</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                One considered set of fonts across the whole Notepage.
              </p>
              <div className="mt-5 grid gap-3">
                {fontPacks.map((pack) => (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => setFontPack(pack)}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left transition-colors ${fontPack.id === pack.id ? "border-foreground bg-muted" : "border-border/70 hover:bg-muted/50"}`}
                  >
                    <span>
                      <span className="block font-medium" style={{ fontFamily: pack.heading }}>
                        {pack.name}
                      </span>
                      <span
                        className="mt-1 block text-xs text-muted-foreground"
                        style={{ fontFamily: pack.body }}
                      >
                        Headings, notes, and handwritten accents
                      </span>
                    </span>
                    {fontPack.id === pack.id && <Check aria-hidden className="size-4" />}
                  </button>
                ))}
              </div>
            </div>
            </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
