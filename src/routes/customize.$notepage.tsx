import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Image, Palette, Type, Upload } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [background, setBackground] = useState(np?.appearance.backgroundColor ?? "#f5f1e8");
  const [backgroundType, setBackgroundType] = useState(np?.appearance.backgroundType ?? "image");
  const [backgroundImage, setBackgroundImage] = useState(np?.appearance.backgroundImage ?? np?.portrait ?? "");
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [backgroundPosition, setBackgroundPosition] = useState(np?.appearance.backgroundPosition ?? "center");
  const [coverUrl, setCoverUrl] = useState("");
  const [overlayOpacity, setOverlayOpacity] = useState(np?.appearance.overlayOpacity ?? 0.2);
  const [cover, setCover] = useState(np?.portrait ?? "");
  const [header, setHeader] = useState(np?.header ?? {
    navLabel: np?.name ?? "Notepage",
    eyebrow: "the notebook entries",
    title: `Notes from ${np?.owner ?? "you"}`,
    description: np?.description ?? "",
  });
  useEffect(() => () => {
    if (backgroundImage.startsWith("blob:")) URL.revokeObjectURL(backgroundImage);
    if (cover.startsWith("blob:")) URL.revokeObjectURL(cover);
  }, [backgroundImage, cover]);

  function handleImageUpload(file: File | undefined, setImage: (value: string) => void) {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(URL.createObjectURL(file));
  }

  function applyImageUrl(value: string, setImage: (value: string) => void) {
    const url = value.trim();
    if (/^https?:\/\/\S+$/i.test(url)) setImage(url);
  }

  if (!np) return null;

  return (
    <div
      className="min-h-screen"
      style={
        {
          ...themeStyle(np),
          "--np-bg": background,
          "--np-heading": fontPack.heading,
          "--np-body": fontPack.body,
          "--np-hand": fontPack.hand,
          "--np-background-color": background,
          "--np-background-image": `url(${backgroundImage})`,
          "--np-background-position": backgroundPosition,
          "--np-overlay-opacity": overlayOpacity,
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
                <Image aria-hidden className="size-5" />
                <h2 className="text-lg font-semibold">Cover</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose the image shown across your Notepage cover.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  np.portrait,
                  "linear-gradient(135deg,#4f46e5,#ec4899)",
                  "linear-gradient(135deg,#0f766e,#f59e0b)",
                ].map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCover(item)}
                    className={`relative aspect-[4/3] overflow-hidden rounded-xl border-2 ${cover === item ? "border-foreground" : "border-transparent"}`}
                    style={item.startsWith("linear") ? { background: item } : {}}
                  >
                    {!item.startsWith("linear") && (
                      <img
                        src={item}
                        alt={`Cover option ${index + 1}`}
                        className="size-full object-cover"
                      />
                    )}
                    {cover === item && (
                      <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-background text-foreground">
                        <Check aria-hidden className="size-4" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr]">
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border/70 px-4 py-3 text-sm hover:bg-muted/50">
                  <Upload aria-hidden className="size-4" /> Upload cover
                  <input type="file" accept="image/*" className="sr-only" onChange={(event) => handleImageUpload(event.target.files?.[0], setCover)} />
                </label>
                <div className="flex gap-2">
                  <input aria-label="Cover image URL" value={coverUrl} onChange={(event) => setCoverUrl(event.target.value)} placeholder="https://…/cover.jpg" className="min-w-0 flex-1 rounded-xl border border-border/70 bg-background px-3 py-2 text-sm" />
                  <Button type="button" variant="outline" onClick={() => applyImageUrl(coverUrl, setCover)}>Use URL</Button>
                </div>
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
            <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-7">
              <div className="flex items-center gap-2">
                <Palette aria-hidden className="size-5" />
                <h2 className="text-lg font-semibold">Page background</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Control the fixed background behind every page in this Notepage.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => setBackgroundType("image")} className={`rounded-xl border p-3 text-left text-sm ${backgroundType === "image" ? "border-foreground bg-muted" : "border-border/70"}`}>
                  Use background image
                </button>
                <button type="button" onClick={() => setBackgroundType("color")} className={`rounded-xl border p-3 text-left text-sm ${backgroundType === "color" ? "border-foreground bg-muted" : "border-border/70"}`}>
                  Use solid color
                </button>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-[auto_1fr]">
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border/70 px-4 py-3 text-sm hover:bg-muted/50">
                  <Upload aria-hidden className="size-4" /> Upload background
                  <input type="file" accept="image/*" className="sr-only" onChange={(event) => handleImageUpload(event.target.files?.[0], setBackgroundImage)} />
                </label>
                <div className="flex gap-2">
                  <input aria-label="Background image URL" value={backgroundUrl} onChange={(event) => setBackgroundUrl(event.target.value)} placeholder="https://…/background.jpg" className="min-w-0 flex-1 rounded-xl border border-border/70 bg-background px-3 py-2 text-sm" />
                  <Button type="button" variant="outline" onClick={() => applyImageUrl(backgroundUrl, setBackgroundImage)}>Use URL</Button>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-4">
                <input
                  aria-label="Page background color"
                  type="color"
                  value={background.startsWith("#") ? background : "#f5f1e8"}
                  onChange={(event) => setBackground(event.target.value)}
                  className="size-12 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                />
                <span className="font-mono text-sm uppercase text-muted-foreground">{background}</span>
              </div>
              <label className="mt-5 block text-sm font-medium">
                Image position
                <select value={backgroundPosition} onChange={(event) => setBackgroundPosition(event.target.value)} className="mt-2 w-full rounded-lg border border-border/70 bg-background px-3 py-2">
                  <option value="center">Center</option>
                  <option value="center top">Top</option>
                  <option value="center bottom">Bottom</option>
                  <option value="left center">Left</option>
                  <option value="right center">Right</option>
                </select>
              </label>
              <label className="mt-5 block text-sm font-medium">
                Reading overlay
                <input aria-label="Reading overlay" type="range" min="0" max="0.7" step="0.05" value={overlayOpacity} onChange={(event) => setOverlayOpacity(Number(event.target.value))} className="mt-3 w-full" />
              </label>
            </div>
          </section>
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
              <p className="border-b border-border/70 px-5 py-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Live preview
              </p>
              <div className="relative aspect-[4/5] overflow-hidden" style={{ background }}>
                <div
                  className="absolute inset-0"
                  style={
                    backgroundType === "image"
                      ? {
                          backgroundImage: `url(${backgroundImage})`,
                          backgroundSize: "cover",
                          backgroundPosition,
                        }
                      : { backgroundColor: background }
                  }
                />
                <div className="absolute inset-0" style={{ background: `rgba(255,255,255,${overlayOpacity})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-6 text-white">
                  <p className="text-xs uppercase tracking-[0.16em]">{header.navLabel}</p>
                  <p className="hand mt-4 text-xl">{header.eyebrow}</p>
                  <h2 className="mt-2 text-3xl" style={{ fontFamily: fontPack.heading }}>
                    {header.title}
                  </h2>
                  <p className="mt-2 text-sm opacity-85" style={{ fontFamily: fontPack.body }}>
                    {header.description}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
