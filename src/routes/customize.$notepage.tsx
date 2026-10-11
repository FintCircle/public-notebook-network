import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, ImagePlus, Move, Palette, Sliders, Smartphone, Type } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  component: CustomizeNotepage,
});

function CustomizeNotepage() {
  const { notepage: slug } = Route.useParams();
  const np = getNotepage(slug);
  const [fontPack, setFontPack] = useState(fontPacks[0]);
  const [accent, setAccent] = useState(np?.theme.accent ?? "#c2410c");
  const [background, setBackground] = useState<"ruled" | "white" | "custom">("ruled");
  const [customBackground, setCustomBackground] = useState("");
  const [coverPhoto, setCoverPhoto] = useState<string>(np?.appearance?.backgroundImage ?? "");

  // Focal positions stored as percentages [x, y]
  const parsePos = (posStr: string | undefined, defaultY = 35): [number, number] => {
    if (!posStr) return [50, defaultY];
    const parts = posStr.split(" ");
    const px = parts[0] ? parseInt(parts[0], 10) : 50;
    const py = parts[1] ? parseInt(parts[1], 10) : defaultY;
    return [isNaN(px) ? 50 : px, isNaN(py) ? defaultY : py];
  };

  const [focalDesk, setFocalDesk] = useState<[number, number]>(() =>
    parsePos(np?.appearance?.backgroundPosition, 35),
  );
  const [focalMob, setFocalMob] = useState<[number, number]>(() =>
    parsePos(np?.appearance?.mobileBackgroundPosition ?? np?.appearance?.backgroundPosition, 35),
  );

  const [activeFocalTab, setActiveFocalTab] = useState<"desktop" | "mobile">("desktop");
  const [textColor, setTextColor] = useState<"light" | "dark" | "auto">(np?.appearance?.textColor ?? "auto");
  const [overlayOpacity, setOverlayOpacity] = useState<number>(np?.appearance?.overlayOpacity ?? 0.45);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [header, setHeader] = useState(
    np?.header ?? {
      navLabel: np?.name ?? "Notepage",
      eyebrow: "the notebook entries",
      title: `Notes from ${np?.owner ?? "you"}`,
      description: np?.description ?? "",
    },
  );

  useEffect(() => {
    const savedFocalDesk = window.localStorage.getItem(`notepage-focal-desktop:${slug}`);
    if (savedFocalDesk) {
      const parts = savedFocalDesk.split(" ");
      const x = parts[0] ? parseInt(parts[0], 10) : NaN;
      const y = parts[1] ? parseInt(parts[1], 10) : NaN;
      if (!isNaN(x) && !isNaN(y)) setFocalDesk([x, y]);
    }
    const savedFocalMob = window.localStorage.getItem(`notepage-focal-mobile:${slug}`);
    if (savedFocalMob) {
      const parts = savedFocalMob.split(" ");
      const x = parts[0] ? parseInt(parts[0], 10) : NaN;
      const y = parts[1] ? parseInt(parts[1], 10) : NaN;
      if (!isNaN(x) && !isNaN(y)) setFocalMob([x, y]);
    }
    const savedTextColor = window.localStorage.getItem(`notepage-text-color:${slug}`) as "light" | "dark" | "auto" | null;
    if (savedTextColor) setTextColor(savedTextColor);
    const savedOpacity = window.localStorage.getItem(`notepage-overlay-opacity:${slug}`);
    if (savedOpacity) setOverlayOpacity(parseFloat(savedOpacity));
    const savedCoverPhoto = window.localStorage.getItem(`notepage-cover-photo:${slug}`);
    if (savedCoverPhoto) setCoverPhoto(savedCoverPhoto);
  }, [slug]);

  if (!np) return null;

  const currentFocal = activeFocalTab === "desktop" ? focalDesk : focalMob;
  const setCurrentFocal = (coords: [number, number]) => {
    if (activeFocalTab === "desktop") setFocalDesk(coords);
    else setFocalMob(coords);
  };

  const handleImageClickOrDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(Math.min(Math.max(0, ((e.clientX - rect.left) / rect.width) * 100), 100));
    const y = Math.round(Math.min(Math.max(0, ((e.clientY - rect.top) / rect.height) * 100), 100));
    setCurrentFocal([x, y]);
  };

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
          <div className="flex items-center gap-3">
            {saveMessage && (
              <span className="text-sm font-medium text-green-700 animate-fade-in">{saveMessage}</span>
            )}
            <Button
              onClick={() => {
                window.localStorage.setItem(`notepage-accent:${slug}`, accent);
                window.localStorage.setItem(`notepage-background:${slug}`, background);
                if (customBackground)
                  window.localStorage.setItem(`notepage-custom-background:${slug}`, customBackground);
                window.localStorage.setItem(`notepage-focal-desktop:${slug}`, `${focalDesk[0]}% ${focalDesk[1]}%`);
                window.localStorage.setItem(`notepage-focal-mobile:${slug}`, `${focalMob[0]}% ${focalMob[1]}%`);
                window.localStorage.setItem(`notepage-text-color:${slug}`, textColor);
                window.localStorage.setItem(`notepage-overlay-opacity:${slug}`, String(overlayOpacity));
                if (coverPhoto)
                  window.localStorage.setItem(`notepage-cover-photo:${slug}`, coverPhoto);

                setSaveMessage("Saved successfully!");
                setTimeout(() => setSaveMessage(null), 3000);
              }}
            >
              <Check aria-hidden /> Save changes
            </Button>
          </div>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <section className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-7">
              <div className="flex items-center gap-2">
                <Type aria-hidden className="size-5" />
                <h2 className="text-lg font-semibold">Upper section</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Write the welcome text readers see before your notes.
              </p>
              <div className="mt-5 grid gap-4">
                {(
                  [
                    ["navLabel", "Back-link label"],
                    ["eyebrow", "Small handwritten line"],
                    ["title", "Heading"],
                    ["description", "Description"],
                  ] as const
                ).map(([field, label]) => (
                  <label key={field} className="grid gap-2 text-sm font-medium">
                    {label}
                    {field === "description" ? (
                      <textarea
                        value={header[field]}
                        onChange={(event) => setHeader({ ...header, [field]: event.target.value })}
                        rows={3}
                        className="rounded-xl border border-border/70 bg-background px-3 py-2 font-normal"
                      />
                    ) : (
                      <input
                        value={header[field]}
                        onChange={(event) => setHeader({ ...header, [field]: event.target.value })}
                        className="rounded-xl border border-border/70 bg-background px-3 py-2 font-normal"
                      />
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
                    onClick={() => setFontPack(pack as typeof fontPack)}
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
            {/* Cover Photograph & Crop / Focal Point Selector */}
            <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-7">
              <div className="flex items-center gap-2">
                <ImagePlus aria-hidden className="size-5" />
                <h2 className="text-lg font-semibold">Cover photograph & positioning</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload a full-screen cover photo and click/drag to set image focal points separately for desktop and mobile screens.
              </p>

              <div className="mt-4">
                <label className="block text-sm font-medium">Cover Photograph</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setCoverPhoto(String(reader.result));
                    reader.readAsDataURL(file);
                  }}
                  className="mt-2 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                />
              </div>

              {coverPhoto && (
                <div className="mt-6 border-t border-border/60 pt-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">Adjust Focal Point</span>
                    <div className="flex rounded-lg border border-border bg-muted p-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setActiveFocalTab("desktop")}
                        className={`px-3 py-1 rounded-md font-medium transition-colors ${activeFocalTab === "desktop" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
                      >
                        Desktop crop
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveFocalTab("mobile")}
                        className={`px-3 py-1 rounded-md font-medium transition-colors ${activeFocalTab === "mobile" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
                      >
                        Mobile crop
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Click anywhere on the photo preview below to place the center point ({currentFocal[0]}%, {currentFocal[1]}%).
                  </p>

                  <div
                    onClick={handleImageClickOrDrag}
                    className={`relative mt-3 cursor-crosshair overflow-hidden rounded-xl border border-border select-none transition-all ${
                      activeFocalTab === "mobile" ? "max-w-[260px] mx-auto aspect-[9/16]" : "aspect-[16/9] w-full"
                    }`}
                  >
                    <img
                      src={coverPhoto}
                      alt="Cover focal point selector"
                      className="size-full object-cover"
                      style={{ objectPosition: `${currentFocal[0]}% ${currentFocal[1]}%` }}
                    />
                    <div
                      className="absolute size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black/40 shadow-lg backdrop-blur-sm pointer-events-none flex items-center justify-center"
                      style={{ left: `${currentFocal[0]}%`, top: `${currentFocal[1]}%` }}
                    >
                      <div className="size-2 rounded-full bg-white" />
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-medium">
                        <span>Readability Overlay Opacity</span>
                        <span>{Math.round(overlayOpacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="0.9"
                        step="0.05"
                        value={overlayOpacity}
                        onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                        className="w-full mt-2"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-2">Text Treatment</label>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {(["light", "dark", "auto"] as const).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setTextColor(mode)}
                            className={`px-3 py-2 rounded-xl border font-medium capitalize ${
                              textColor === mode ? "border-foreground bg-muted" : "border-border/70 hover:bg-muted/50"
                            }`}
                          >
                            {mode} text
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-7">
              <div className="flex items-center gap-2">
                <Palette aria-hidden className="size-5" />
                <h2 className="text-lg font-semibold">Accent color</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose the ink that highlights links, buttons, notes, and little details on this
                Notepage.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <input
                  aria-label="Custom accent color"
                  type="color"
                  value={accent}
                  onChange={(event) => setAccent(event.target.value)}
                  className="size-12 cursor-pointer rounded-xl border border-border/70 bg-background p-1"
                />
                <div>
                  <p className="text-sm font-medium">Your accent</p>
                  <p className="font-mono text-xs text-muted-foreground">{accent}</p>
                </div>
                <span className="hand ml-auto text-lg" style={{ color: accent }}>
                  a little mark of yours
                </span>
              </div>
            </div>
          </section>

          {/* Live Mobile & Desktop Previews */}
          <aside className="sticky top-8 flex flex-col gap-6">
            <div className="rounded-2xl border border-border/70 bg-card p-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h2 className="text-sm font-semibold">Live Cover Preview</h2>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {activeFocalTab === "mobile" ? <Smartphone className="size-4" /> : <Move className="size-4" />}
                  <span className="capitalize">{activeFocalTab} view</span>
                </div>
              </div>

              <div
                className={`relative mt-4 overflow-hidden rounded-2xl border border-border/80 shadow-md ${
                  activeFocalTab === "mobile" ? "max-w-[280px] mx-auto aspect-[9/16]" : "aspect-[16/10] w-full"
                }`}
                style={
                  {
                    ...themeStyle({
                      ...np,
                      appearance: {
                        backgroundType: coverPhoto ? "image" : np.appearance.backgroundType,
                        backgroundImage: coverPhoto || np.appearance.backgroundImage,
                        backgroundColor: np.appearance.backgroundColor,
                        backgroundPosition: `${focalDesk[0]}% ${focalDesk[1]}%`,
                        mobileBackgroundPosition: `${focalMob[0]}% ${focalMob[1]}%`,
                        textColor,
                        overlayOpacity,
                      },
                    }),
                    "--np-accent": accent,
                    "--np-heading": fontPack.heading,
                    "--np-body": fontPack.body,
                  } as React.CSSProperties
                }
              >
                <div className="notepage-cover absolute inset-0 flex flex-col justify-between p-4 text-[var(--np-cover-ink)]">
                  {coverPhoto && (
                    <>
                      <img
                        src={coverPhoto}
                        alt="Preview cover"
                        className="notepage-cover-image"
                        style={{
                          objectPosition: activeFocalTab === "mobile" ? `${focalMob[0]}% ${focalMob[1]}%` : `${focalDesk[0]}% ${focalDesk[1]}%`,
                        }}
                      />
                      <div className={textColor === "light" || (textColor === "auto" && coverPhoto) ? "cover-overlay" : "cover-overlay cover-overlay-light"} />
                    </>
                  )}

                  <div className="relative z-10 flex justify-between items-start">
                    <span className="font-heading font-bold text-lg">Inktella</span>
                    <span className="text-[0.6rem] uppercase tracking-widest opacity-80 font-mono">Notepage</span>
                  </div>

                  <div className="relative z-10 my-auto py-4">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-wider opacity-85">
                      A Notepage by {np.owner}
                    </p>
                    <h3 className="font-heading text-xl font-extrabold leading-snug mt-1" style={{ fontFamily: fontPack.heading }}>
                      {header.title || np.name}
                    </h3>
                    <p className="text-xs opacity-90 mt-1 line-clamp-2" style={{ fontFamily: fontPack.body }}>
                      {header.description || np.description}
                    </p>
                    <div className="mt-3 inline-block rounded-full bg-[var(--np-accent)] px-3 py-1.5 text-[0.65rem] font-semibold text-white">
                      Start reading →
                    </div>
                  </div>

                  <div className="relative z-10 flex justify-between text-[0.6rem] opacity-75 border-t border-current/20 pt-2">
                    <span>About</span>
                    <span>Guestnotes</span>
                  </div>
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
