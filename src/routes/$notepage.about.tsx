import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  AtSign,
  Check,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  Pencil,
  Play,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Twitter,
  Video,
  X,
  Youtube,
} from "lucide-react";
import { useRef, useState, type ChangeEvent, type CSSProperties } from "react";
import { getNotepage } from "@/data/inktella";

export const Route = createFileRoute("/$notepage/about")({
  head: ({ params }) => {
    const notepage = getNotepage(params.notepage);
    return {
      meta: [
        { title: notepage ? `About ${notepage.owner} — ${notepage.name}` : "About | Inktella" },
      ],
    };
  },
  component: NotepageAbout,
});

type Layout = "card" | "hero";
type Spotlight = { label: string; href: string; icon: "globe" | "mail" | "play" | "video" };
type Social = { network: string; href: string };

const spotlightIcons = { globe: Globe, mail: Mail, play: Play, video: Video };
const socialIcons: Record<string, typeof Instagram> = { Instagram, Linkedin, X, Twitter, Youtube };
const suggestions: Spotlight[] = [
  { label: "Visit my website", href: "https://", icon: "globe" },
  { label: "Email me", href: "mailto:", icon: "mail" },
  { label: "Listen to my podcast", href: "https://", icon: "play" },
  { label: "Watch my videos", href: "https://", icon: "video" },
];

function NotepageAbout() {
  const { notepage: slug } = Route.useParams();
  const notepage = getNotepage(slug);
  const [isEditing, setIsEditing] = useState(false);
  const [layout, setLayout] = useState<Layout>("card");
  const [title, setTitle] = useState(notepage?.owner ?? "");
  const [subtitle, setSubtitle] = useState("A little more about the person behind this notebook.");
  const [bio, setBio] = useState(notepage?.ownerBio ?? "");
  const [spotlights, setSpotlights] = useState<Spotlight[]>(suggestions.slice(0, 1));
  const [socials, setSocials] = useState<Social[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  if (!notepage) return null;
  const pageStyle = {
    "--np-bg": notepage.theme.bg,
    "--np-ink": notepage.theme.ink,
  } as CSSProperties;

  const formatBio = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    setBio(editorRef.current?.innerHTML ?? "");
  };
  const addBioImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file?.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    editorRef.current?.focus();
    document.execCommand(
      "insertHTML",
      false,
      `<figure><img src="${url}" alt="${file.name.replace(/\"/g, "&quot;")}" /><figcaption>${file.name}</figcaption></figure>`,
    );
    setBio(editorRef.current?.innerHTML ?? "");
  };
  const updateSpotlight = (index: number, patch: Partial<Spotlight>) =>
    setSpotlights((items) =>
      items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    );

  return (
    <main
      className="min-h-screen px-4 py-5 text-[var(--np-ink)] sm:px-8 sm:py-10"
      style={pageStyle}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Link
            to="/$notepage"
            params={{ notepage: slug }}
            className="inline-flex items-center gap-2 text-sm opacity-65 hover:opacity-100"
          >
            <ArrowLeft className="size-4" /> {notepage.name}
          </Link>
          <button
            type="button"
            onClick={() => setIsEditing((value) => !value)}
            className="inline-flex items-center gap-2 rounded-full border border-current/20 px-3 py-2 text-sm font-medium hover:bg-current/10"
          >
            {isEditing ? (
              <>
                <Check className="size-4" /> Done
              </>
            ) : (
              <>
                <Pencil className="size-4" /> Edit page
              </>
            )}
          </button>
        </div>

        {isEditing ? (
          <EditorPanel
            layout={layout}
            setLayout={setLayout}
            title={title}
            setTitle={setTitle}
            subtitle={subtitle}
            setSubtitle={setSubtitle}
            bio={bio}
            setBio={setBio}
            editorRef={editorRef}
            imageInputRef={imageInputRef}
            formatBio={formatBio}
            addBioImage={addBioImage}
            spotlights={spotlights}
            updateSpotlight={updateSpotlight}
            setSpotlights={setSpotlights}
            socials={socials}
            setSocials={setSocials}
          />
        ) : null}

        <Preview
          layout={layout}
          notepage={notepage}
          title={title}
          subtitle={subtitle}
          bio={bio}
          spotlights={spotlights}
          socials={socials}
        />
      </div>
    </main>
  );
}

function Preview({
  layout,
  notepage,
  title,
  subtitle,
  bio,
  spotlights,
  socials,
}: {
  layout: Layout;
  notepage: NonNullable<ReturnType<typeof getNotepage>>;
  title: string;
  subtitle: string;
  bio: string;
  spotlights: Spotlight[];
  socials: Social[];
}) {
  const SocialIcon = ({ network }: { network: string }) => {
    const Icon = socialIcons[network] ?? AtSign;
    return <Icon className="size-5" />;
  };
  return (
    <section
      className={`mx-auto overflow-hidden shadow-sm ${layout === "card" ? "max-w-2xl rounded-2xl bg-white/95 px-6 pb-10 pt-0 text-center sm:px-10" : "max-w-4xl bg-black/10 text-center"}`}
      aria-label="About page preview"
    >
      <div className={layout === "hero" ? "relative min-h-[480px] overflow-hidden" : ""}>
        <img
          src={notepage.portrait}
          alt={`${notepage.owner} portrait`}
          className={
            layout === "hero"
              ? "absolute inset-0 size-full object-cover grayscale"
              : "relative mx-auto -mt-1 size-40 rounded-full border-8 border-[var(--np-bg)] object-cover sm:size-48"
          }
        />
        {layout === "hero" && <div className="notepage-cover-shade absolute inset-0" />}
        <div
          className={layout === "hero" ? "absolute inset-x-0 bottom-10 px-6 text-white" : "pt-7"}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">
            {notepage.owner} · {notepage.country}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold uppercase tracking-[0.12em] sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg font-medium leading-relaxed opacity-85 sm:text-xl">
            {subtitle}
          </p>
        </div>
      </div>
      <div className={`${layout === "hero" ? "px-6 py-10 sm:px-12" : "pt-9"}`}>
        <div className="flex flex-col gap-3">
          {spotlights.map((spotlight, index) => {
            const Icon = spotlightIcons[spotlight.icon];
            return (
              <a
                key={`${spotlight.label}-${index}`}
                href={spotlight.href}
                className="flex min-h-16 items-center justify-center gap-4 rounded-xl bg-[var(--np-ink)] px-5 py-4 text-lg font-medium text-[var(--np-bg)] shadow-sm transition-transform hover:-translate-y-0.5 sm:text-2xl"
              >
                <Icon className="size-7" /> {spotlight.label}
              </a>
            );
          })}
        </div>
        <article
          className="prose-note mx-auto mt-10 max-w-2xl text-left text-lg"
          dangerouslySetInnerHTML={{ __html: bio }}
        />
        {socials.length > 0 && (
          <div className="mt-10 flex justify-center gap-3 border-t border-current/10 pt-6">
            {socials.map((social) => (
              <a
                key={social.network}
                href={social.href}
                aria-label={social.network}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-current/15 p-3 opacity-70 hover:opacity-100"
              >
                <SocialIcon network={social.network} />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function EditorPanel(props: any) {
  const {
    layout,
    setLayout,
    title,
    setTitle,
    subtitle,
    setSubtitle,
    bio,
    setBio,
    editorRef,
    imageInputRef,
    formatBio,
    addBioImage,
    spotlights,
    updateSpotlight,
    setSpotlights,
    socials,
    setSocials,
  } = props;
  return (
    <section
      className="mb-6 rounded-2xl border border-current/15 bg-white/70 p-4 shadow-sm backdrop-blur sm:p-6"
      aria-label="About page editor"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-current/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-55">
            Homepage style
          </p>
          <p className="mt-1 text-sm opacity-65">Choose the layout visitors see first.</p>
        </div>
        <div
          className="flex rounded-lg border border-current/15 p-1"
          role="group"
          aria-label="Homepage layout"
        >
          <button
            type="button"
            onClick={() => setLayout("card")}
            className={`rounded-md px-3 py-2 text-sm ${layout === "card" ? "bg-[var(--np-ink)] text-[var(--np-bg)]" : "opacity-70"}`}
          >
            Card profile
          </button>
          <button
            type="button"
            onClick={() => setLayout("hero")}
            className={`rounded-md px-3 py-2 text-sm ${layout === "hero" ? "bg-[var(--np-ink)] text-[var(--np-bg)]" : "opacity-70"}`}
          >
            Full hero
          </button>
        </div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Name
          <input
            value={title}
            onChange={(event: any) => setTitle(event.target.value)}
            className="rounded-lg border border-current/15 bg-transparent px-3 py-2 text-base outline-none focus:border-current/50"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Tagline
          <textarea
            value={subtitle}
            onChange={(event: any) => setSubtitle(event.target.value)}
            rows={2}
            className="resize-none rounded-lg border border-current/15 bg-transparent px-3 py-2 text-base outline-none focus:border-current/50"
          />
        </label>
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label htmlFor="about-bio-editor" className="text-sm font-medium">
            Rich about content
          </label>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={addBioImage}
            className="sr-only"
          />
        </div>
        <div
          className="mt-2 flex flex-wrap gap-1 rounded-t-lg border border-current/15 p-1"
          role="toolbar"
          aria-label="Formatting"
        >
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => formatBio("bold")}
            className="px-2 py-1 text-sm font-bold hover:bg-current/10"
          >
            B
          </button>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => formatBio("italic")}
            className="px-2 py-1 text-sm italic hover:bg-current/10"
          >
            I
          </button>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => formatBio("formatBlock", "h2")}
            className="px-2 py-1 text-sm hover:bg-current/10"
          >
            H2
          </button>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => formatBio("insertUnorderedList")}
            className="px-2 py-1 text-sm hover:bg-current/10"
          >
            List
          </button>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              const url = window.prompt("Link to");
              if (url) formatBio("createLink", url);
            }}
            className="px-2 py-1 text-sm hover:bg-current/10"
          >
            Link
          </button>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => imageInputRef.current?.click()}
            className="px-2 py-1 text-sm hover:bg-current/10"
          >
            Image
          </button>
        </div>
        <div
          id="about-bio-editor"
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          onInput={(event: any) => setBio(event.currentTarget.innerHTML)}
          dangerouslySetInnerHTML={{ __html: bio }}
          className="prose-note min-h-40 rounded-b-lg border border-t-0 border-current/15 bg-transparent p-4 outline-none focus:border-current/50"
        />
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Spotlight buttons</h2>
          <button
            type="button"
            onClick={() =>
              setSpotlights((items: Spotlight[]) => [
                ...items,
                { label: "Read my blog", href: "https://", icon: "globe" },
              ])
            }
            className="inline-flex items-center gap-1 text-sm underline underline-offset-4"
          >
            <Plus className="size-4" /> Add button
          </button>
        </div>
        <div className="mt-3 grid gap-2">
          {spotlights.map((item: Spotlight, index: number) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              {" "}
              <input
                value={item.label}
                onChange={(event: any) => updateSpotlight(index, { label: event.target.value })}
                aria-label={`Button ${index + 1} text`}
                className="rounded-lg border border-current/15 bg-transparent px-3 py-2"
              />
              <input
                value={item.href}
                onChange={(event: any) => updateSpotlight(index, { href: event.target.value })}
                aria-label={`Button ${index + 1} link`}
                className="rounded-lg border border-current/15 bg-transparent px-3 py-2"
              />
              <button
                type="button"
                aria-label={`Remove button ${index + 1}`}
                onClick={() =>
                  setSpotlights((items: Spotlight[]) =>
                    items.filter((_: Spotlight, itemIndex: number) => itemIndex !== index),
                  )
                }
                className="rounded-lg border border-current/15 px-3 opacity-65 hover:opacity-100"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">
            Social links <span className="font-normal opacity-55">(optional)</span>
          </h2>
          <button
            type="button"
            onClick={() =>
              setSocials((items: Social[]) => [
                ...items,
                { network: "Instagram", href: "https://" },
              ])
            }
            className="inline-flex items-center gap-1 text-sm underline underline-offset-4"
          >
            <Plus className="size-4" /> Add social
          </button>
        </div>
        <div className="mt-3 grid gap-2">
          {socials.map((item: Social, index: number) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[150px_1fr_auto]">
              <select
                value={item.network}
                onChange={(event: any) =>
                  setSocials((items: Social[]) =>
                    items.map((social, socialIndex) =>
                      socialIndex === index ? { ...social, network: event.target.value } : social,
                    ),
                  )
                }
                className="rounded-lg border border-current/15 bg-transparent px-3 py-2"
              >
                <option>Instagram</option>
                <option>Linkedin</option>
                <option>Twitter</option>
                <option>Youtube</option>
                <option>X</option>
              </select>
              <input
                value={item.href}
                onChange={(event: any) =>
                  setSocials((items: Social[]) =>
                    items.map((social, socialIndex) =>
                      socialIndex === index ? { ...social, href: event.target.value } : social,
                    ),
                  )
                }
                aria-label={`${item.network} URL`}
                className="rounded-lg border border-current/15 bg-transparent px-3 py-2"
              />
              <button
                type="button"
                aria-label={`Remove ${item.network}`}
                onClick={() =>
                  setSocials((items: Social[]) =>
                    items.filter((_: Social, socialIndex: number) => socialIndex !== index),
                  )
                }
                className="rounded-lg border border-current/15 px-3 opacity-65 hover:opacity-100"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-current/10 pt-4 text-sm opacity-60">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="size-4" /> Changes preview instantly
        </span>
        <span className="inline-flex items-center gap-2">
          <Save className="size-4" /> Ready to publish
        </span>
      </div>
    </section>
  );
}
