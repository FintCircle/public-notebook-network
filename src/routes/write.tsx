import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CustomImage } from "@/components/tiptap-image-extension";
import { FloatingToolbar } from "@/components/floating-toolbar";
import { getNotepage, interests, notes as publishedNotes, type Note } from "@/data/inktella";
import { AuthOnly } from "@/lib/auth";
import { saveNote, updateNote } from "@/lib/inktella.functions";
import { drafts, myNotepages, useInktellaStore } from "@/lib/inktella-store";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Code,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RemoveFormatting,
  Undo,
  Redo,
  Image as ImageIcon,
  Eye,
  Maximize2,
  Minimize2,
  Plus,
  Heading,
} from "lucide-react";

export const Route = createFileRoute("/write")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { notepage?: string | undefined; edit?: string | undefined } => ({
    notepage: typeof search["notepage"] === "string" ? search["notepage"] : undefined,
    edit: typeof search["edit"] === "string" ? search["edit"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Write a Note | Inktella" },
      {
        name: "description",
        content: "An empty sheet of paper. Write a note — short, long, unfinished, whatever it is.",
      },
      { property: "og:title", content: "Write a Note on Inktella" },
      {
        property: "og:description",
        content: "An empty sheet of paper, not a content management system.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Write,
});

export default function Write() {
  return (
    <AuthOnly message="The blank page is waiting, but it prefers introductions first.">
      <WriteContent />
    </AuthOnly>
  );
}

function WriteContent() {
  const { notepage, edit } = Route.useSearch();
  const found = notepage ? getNotepage(notepage) : undefined;
  const selectedNotepage = found && myNotepages().includes(found) ? found : undefined;
  const existing = edit
    ? [...publishedNotes, ...drafts].find(
        (n) => n.id === edit && (!notepage || n.notepage === notepage),
      )
    : undefined;

  return <NoteEditor notepage={selectedNotepage?.slug} existing={existing} />;
}

function NotepageChooser() {
  const mine = myNotepages();

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-2xl px-5 py-14">
        <h1 className="text-3xl leading-tight">Where are you noting this down?</h1>
        <p className="hand mt-3 text-xl opacity-60">choose one of your notebooks</p>
        <div className="mt-10 divide-y divide-border/70 border-y border-border/70">
          {mine.map((np) => (
            <Link
              key={np.slug}
              to="/write"
              search={{ notepage: np.slug, edit: undefined }}
              className="group flex items-center justify-between gap-5 py-5"
            >
              <span>
                <span className="block text-lg group-hover:underline">{np.name}</span>
                <span className="mt-1 block text-sm opacity-55">{np.description}</span>
              </span>
              <span aria-hidden className="shrink-0 opacity-45">
                →
              </span>
            </Link>
          ))}
        </div>
        <Button variant="link" asChild className="mt-6 h-auto px-0">
          <Link to="/notepages/new">Start another Notepage</Link>
        </Button>
      </main>
    </div>
  );
}

type SlashOption = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
};

function NoteEditor({
  notepage,
  existing,
}: {
  notepage?: string;
  name?: string;
  existing?: Note | undefined;
}) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const existingTopics = existing
    ? interests.filter((t) => existing.notetags.includes(t.toLowerCase()))
    : [];
  const [status, setStatus] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error" | "offline">(
    "idle",
  );
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [actionSheet, setActionSheet] = useState<"draft" | "publish" | null>(null);
  const [publishNotepage, setPublishNotepage] = useState(notepage ?? "");
  const [publishTopics, setPublishTopics] = useState<string[]>(existingTopics);
  const [publishTags, setPublishTags] = useState(
    existing
      ? existing.notetags
          .filter((tag) => !existingTopics.some((topic) => topic.toLowerCase() === tag))
          .map((tag) => `#${tag}`)
          .join(" ")
      : "",
  );

  // Slash commands popup state
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");
  const [slashSelectedIndex, setSlashSelectedIndex] = useState(0);

  const { refresh } = useInktellaStore();
  const navigate = useNavigate();

  // Process & compress uploaded or dropped image files
  const processImageFile = useCallback(
    (file: File, callback: (dataUrl: string, alt: string) => void) => {
      if (!file || !file.type.startsWith("image/")) return;
      setIsAddingImage(true);
      const imageUrl = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        // Retain natural aspect ratio, scale down if extremely large
        const scale = Math.min(1, 1600 / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
        const isGif = file.type === "image/gif";
        // If GIF, keep original blob if under 3MB, else fallback to compressed
        if (isGif && file.size < 3 * 1024 * 1024) {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === "string") {
              callback(reader.result, file.name.replace(/\.[^.]+$/, ""));
            }
            URL.revokeObjectURL(imageUrl);
            setIsAddingImage(false);
          };
          reader.readAsDataURL(file);
          return;
        }
        const dataUrl = canvas.toDataURL(
          file.type === "image/png" ? "image/png" : "image/jpeg",
          0.82,
        );
        URL.revokeObjectURL(imageUrl);
        const alt = file.name.replace(/\.[^.]+$/, "").replace(/["<>&]/g, "");
        callback(dataUrl, alt);
        setIsAddingImage(false);
      };
      image.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        setIsAddingImage(false);
        setStatus("Failed to load image.");
      };
      image.src = imageUrl;
    },
    [],
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CustomImage,
      CharacterCount,
      BubbleMenuExtension,
      Placeholder.configure({
        placeholder: "Write something or type / for commands…",
      }),
    ],
    content: existing?.html ?? "",
    onUpdate: ({ editor }) => {
      setHasUnsavedChanges(true);
      const { selection } = editor.state;
      const { $from } = selection;
      const currentLineText = $from.nodeBefore?.text ?? "";
      if (currentLineText.startsWith("/")) {
        setSlashQuery(currentLineText.slice(1));
        setSlashSelectedIndex(0);
        setSlashMenuOpen(true);
      } else {
        setSlashMenuOpen(false);
      }
    },
  });

  // Handle slash command execution
  const executeSlashAction = useCallback(
    (action: () => void) => {
      if (!editor) return;
      const { selection } = editor.state;
      const { $from } = selection;
      const currentLineText = $from.nodeBefore?.text ?? "";
      if (currentLineText.startsWith("/")) {
        editor.commands.deleteRange({
          from: $from.pos - currentLineText.length,
          to: $from.pos,
        });
      }
      action();
      setSlashMenuOpen(false);
      setSlashQuery("");
    },
    [editor],
  );

  const openImagePicker = () => imageInputRef.current?.click();

  const handleImageSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    processImageFile(file, (src, alt) => {
      editor?.chain().focus().setImage({ src, alt }).run();
    });
  };

  const slashOptions: SlashOption[] = [
    {
      id: "h1",
      title: "Heading 1",
      description: "Big title heading",
      icon: <Heading1 className="h-4 w-4" />,
      action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      id: "h2",
      title: "Heading 2",
      description: "Medium section heading",
      icon: <Heading2 className="h-4 w-4" />,
      action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      id: "h3",
      title: "Heading 3",
      description: "Small subsection heading",
      icon: <Heading3 className="h-4 w-4" />,
      action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      id: "image",
      title: "Image",
      description: "Upload or embed an image with captions",
      icon: <ImageIcon className="h-4 w-4" />,
      action: openImagePicker,
    },
    {
      id: "bulletList",
      title: "Bullet List",
      description: "Create a simple bulleted list",
      icon: <List className="h-4 w-4" />,
      action: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      id: "orderedList",
      title: "Numbered List",
      description: "Create a numbered list",
      icon: <ListOrdered className="h-4 w-4" />,
      action: () => editor?.chain().focus().toggleOrderedList().run(),
    },
    {
      id: "blockquote",
      title: "Quote",
      description: "Highlight a quote or passage",
      icon: <Quote className="h-4 w-4" />,
      action: () => editor?.chain().focus().toggleBlockquote().run(),
    },
    {
      id: "divider",
      title: "Divider",
      description: "Visually separate sections",
      icon: <Minus className="h-4 w-4" />,
      action: () => editor?.chain().focus().setHorizontalRule().run(),
    },
    {
      id: "codeBlock",
      title: "Code Block",
      description: "Display code with preformatted styling",
      icon: <Code className="h-4 w-4" />,
      action: () => editor?.chain().focus().toggleCodeBlock().run(),
    },
  ];

  const filteredSlashOptions = slashOptions.filter(
    (opt) =>
      opt.title.toLowerCase().includes(slashQuery.toLowerCase()) ||
      opt.description.toLowerCase().includes(slashQuery.toLowerCase()),
  );

  // Keyboard navigation for slash menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!slashMenuOpen) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSlashSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredSlashOptions.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSlashSelectedIndex((prev) =>
          prev === 0 ? Math.max(0, filteredSlashOptions.length - 1) : prev - 1,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredSlashOptions[slashSelectedIndex];
        if (selected) executeSlashAction(selected.action);
      } else if (e.key === "Escape") {
        setSlashMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slashMenuOpen, slashSelectedIndex, filteredSlashOptions, executeSlashAction]);

  // Unsaved changes window listener
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Save / Publish submit logic
  const submit = useCallback(
    async (publish: boolean) => {
      if (!editor) return;
      const html = editor.getHTML();
      const text = editor.getText().trim();
      if (!text && !html.includes("<img")) {
        setStatus("Write something first — even one line counts.");
        return;
      }
      if (publish && (!publishNotepage || !publishTopics.length)) {
        setStatus("Choose a Notepage and at least one topic before publishing.");
        return;
      }
      if (!publishNotepage) {
        setStatus(`Choose a Notepage before ${publish ? "publishing" : "saving a draft"}.`);
        return;
      }
      const tagList = [...publishTopics.map((t) => t.toLowerCase()), ...publishTags.split(/[\s,]+/)]
        .map((t) =>
          t
            .replace(/^#/, "")
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, ""),
        )
        .filter(Boolean)
        .slice(0, 12);

      const typedTitle = title.trim();
      const firstLine = (text.split("\n")[0] ?? "").replace(/^#+\s*/, "");
      const finalTitle = (typedTitle || existing?.title || firstLine || "Untitled").slice(0, 120);
      const preview = text
        .replace(/^#+\s*/gm, "")
        .replace(/\*\*/g, "")
        .slice(0, 220);

      setSaveState("saving");
      setStatus("Saving…");
      try {
        const payload = { title: finalTitle, html, preview, notetags: tagList, publish };
        const { id } = existing
          ? await updateNote({ data: { ...payload, noteId: existing.id } })
          : await saveNote({ data: { ...payload, notepageSlug: publishNotepage } });

        setHasUnsavedChanges(false);
        setSaveState("saved");
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        if (publish) {
          setStatus(`Published at ${time}`);
          await refresh();
          await navigate({
            to: "/$notepage/notepage/$noteId",
            params: { notepage: publishNotepage, noteId: id },
          });
        } else {
          setStatus(`Saved draft at ${time}`);
        }
      } catch (e) {
        setSaveState("error");
        setStatus(e instanceof Error ? e.message : "That didn't save. Try again.");
      }
    },
    [editor, publishTopics, publishTags, publishNotepage, title, existing, refresh, navigate],
  );

  // Handle Drag & Drop Images into writing area
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((f) => f.type.startsWith("image/"));
    if (imageFile) {
      processImageFile(imageFile, (src, alt) => {
        editor?.chain().focus().setImage({ src, alt }).run();
      });
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Word count & estimated reading time calculation
  const wordCount = editor?.storage.characterCount?.words() ?? 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className={`min-h-screen transition-colors ${focusMode ? "bg-background" : ""}`}>
      {!focusMode && <SiteNav />}

      <main className={`mx-auto max-w-2xl px-5 pt-8 pb-32 ${focusMode ? "pt-16" : ""}`}>
        {/* Navigation / Notepage selector & Focus mode header */}
        <div className="mb-6 flex items-center justify-between text-sm">
          {!focusMode ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
                A blank page for your next note
              </span>
            </div>
          ) : (
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              Focus Mode
            </div>
          )}

          <div className="flex items-center gap-3">
            {/* Word count & Reading time indicator */}
            <span className="text-xs text-muted-foreground/70">
              {wordCount} {wordCount === 1 ? "word" : "words"} · {readingTime} min read
            </span>

            <button
              type="button"
              onClick={() => setFocusMode((prev) => !prev)}
              title={focusMode ? "Exit focus mode" : "Enter focus mode"}
              className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {focusMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Note Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setHasUnsavedChanges(true);
          }}
          placeholder="Untitled"
          aria-label="Note title"
          className="w-full bg-transparent font-heading text-3xl font-semibold leading-tight tracking-tight outline-none placeholder:opacity-30 focus:outline-none sm:text-4xl"
        />

        {/* Tiptap Floating Selection Toolbar */}
        <FloatingToolbar editor={editor} />

        {/* Tiptap Editor Canvas */}
        <div onDrop={handleDrop} onDragOver={handleDragOver} className="relative mt-6 min-h-[50vh]">
          <EditorContent editor={editor} className="prose-note outline-none focus:outline-none" />

          {/* Slash Commands Dropdown Menu */}
          {slashMenuOpen && filteredSlashOptions.length > 0 && (
            <div className="absolute z-30 mt-2 w-72 rounded-lg border border-border bg-popover p-1 shadow-lg backdrop-blur-md">
              <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Insert block
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredSlashOptions.map((opt, index) => (
                  <button
                    key={opt.id}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => executeSlashAction(opt.action)}
                    onMouseEnter={() => setSlashSelectedIndex(index)}
                    className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-xs transition-colors ${
                      index === slashSelectedIndex
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-popover-foreground hover:bg-accent/50"
                    }`}
                  >
                    <span className="shrink-0 text-muted-foreground">{opt.icon}</span>
                    <div>
                      <div className="font-medium">{opt.title}</div>
                      <div className="text-[11px] opacity-60">{opt.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hidden File Input for Image Selector */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelected}
          className="sr-only"
        />

        <div className="mt-8 flex items-center justify-between gap-2 border-y border-border/70 py-2">
          <button type="button" onClick={() => { editor?.commands.clearContent(); setTitle(""); setHasUnsavedChanges(false); setStatus(null); }} className="rounded px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">Clear</button>
          <div className="flex items-center gap-1">
            <button type="button" disabled={saveState === "saving"} onClick={() => setActionSheet("draft")} className="rounded px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40">Save draft</button>
            <button type="button" disabled={saveState === "saving"} onClick={() => setActionSheet("publish")} className="rounded bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">Publish</button>
          </div>
        </div>
        {status && <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">{status}</p>}

        <Sheet open={actionSheet !== null} onOpenChange={(open) => !open && setActionSheet(null)}>
          <SheetContent side="bottom" className="max-h-[88dvh] overflow-y-auto rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>{actionSheet === "draft" ? "Save this draft" : "Ready to publish?"}</SheetTitle>
              <SheetDescription>Choose where this note belongs before continuing.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-5 py-5">
              <label className="grid gap-2 text-sm font-medium">Notepage <span className="font-normal text-muted-foreground">required</span>
                <select value={publishNotepage} onChange={(event) => setPublishNotepage(event.target.value)} className="rounded-xl border border-border bg-background px-3 py-2.5">
                  <option value="">Choose a Notepage</option>
                  {myNotepages().map((page) => <option key={page.slug} value={page.slug}>{page.name}</option>)}
                </select>
              </label>
              {actionSheet === "publish" && <>
                <div><div className="text-sm font-medium">Topic <span className="font-normal text-muted-foreground">choose at least one</span></div>
                  <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Topics">
                    {interests.map((topic) => { const selected = publishTopics.includes(topic); return <button key={topic} type="button" aria-pressed={selected} onClick={() => setPublishTopics((current) => selected ? current.filter((item) => item !== topic) : [...current, topic])} className={`rounded-full border px-3 py-1.5 text-sm ${selected ? "border-primary bg-primary text-primary-foreground" : "border-border/70 hover:border-foreground"}`}>{topic}</button>; })}
                  </div>
                </div>
                <label className="grid gap-2 text-sm font-medium">Tags <span className="font-normal text-muted-foreground">optional</span><input value={publishTags} onChange={(event) => setPublishTags(event.target.value)} placeholder="#personal-project #draft" className="rounded-xl border border-border bg-transparent px-3 py-2.5 outline-none focus:border-foreground" /></label>
              </>}
            </div>
            <SheetFooter><Button variant="outline" onClick={() => setActionSheet(null)}>Cancel</Button><Button disabled={saveState === "saving"} onClick={() => { setActionSheet(null); void submit(actionSheet === "publish"); }}>{actionSheet === "draft" ? "Save draft" : "Publish note"}</Button></SheetFooter>
          </SheetContent>
        </Sheet>
      </main>

      {/* Mobile-Friendly Fixed Formatting Toolbar Above Keyboard */}
      {editor && (
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-background/95 p-1.5 shadow-md backdrop-blur-md">
          <div className="mx-auto flex max-w-2xl items-center gap-1 overflow-x-auto px-2 py-0.5 no-scrollbar">
            <button
              type="button"
              title="Add Image"
              onClick={openImagePicker}
              disabled={isAddingImage}
              className="flex shrink-0 items-center gap-1 rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Image</span>
            </button>

            <span className="mx-1 h-4 w-px shrink-0 bg-border" />

            <button
              type="button"
              title="Bold"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`shrink-0 rounded p-1.5 hover:bg-accent ${editor.isActive("bold") ? "bg-accent text-accent-foreground font-bold" : "text-muted-foreground"}`}
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Italic"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`shrink-0 rounded p-1.5 hover:bg-accent ${editor.isActive("italic") ? "bg-accent text-accent-foreground font-bold" : "text-muted-foreground"}`}
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Underline"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`shrink-0 rounded p-1.5 hover:bg-accent ${editor.isActive("underline") ? "bg-accent text-accent-foreground font-bold" : "text-muted-foreground"}`}
            >
              <UnderlineIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Strikethrough"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`shrink-0 rounded p-1.5 hover:bg-accent ${editor.isActive("strike") ? "bg-accent text-accent-foreground font-bold" : "text-muted-foreground"}`}
            >
              <Strikethrough className="h-4 w-4" />
            </button>

            <span className="mx-1 h-4 w-px shrink-0 bg-border" />

            <button
              type="button"
              title="Heading 2"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`shrink-0 rounded p-1.5 hover:bg-accent ${editor.isActive("heading", { level: 2 }) ? "bg-accent text-accent-foreground font-bold" : "text-muted-foreground"}`}
            >
              <Heading2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Heading 3"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`shrink-0 rounded p-1.5 hover:bg-accent ${editor.isActive("heading", { level: 3 }) ? "bg-accent text-accent-foreground font-bold" : "text-muted-foreground"}`}
            >
              <Heading3 className="h-4 w-4" />
            </button>

            <span className="mx-1 h-4 w-px shrink-0 bg-border" />

            <button
              type="button"
              title="Bullet list"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`shrink-0 rounded p-1.5 hover:bg-accent ${editor.isActive("bulletList") ? "bg-accent text-accent-foreground font-bold" : "text-muted-foreground"}`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Numbered list"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`shrink-0 rounded p-1.5 hover:bg-accent ${editor.isActive("orderedList") ? "bg-accent text-accent-foreground font-bold" : "text-muted-foreground"}`}
            >
              <ListOrdered className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Blockquote"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`shrink-0 rounded p-1.5 hover:bg-accent ${editor.isActive("blockquote") ? "bg-accent text-accent-foreground font-bold" : "text-muted-foreground"}`}
            >
              <Quote className="h-4 w-4" />
            </button>

            <span className="mx-1 h-4 w-px shrink-0 bg-border" />

            <button
              type="button"
              title="Undo"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="shrink-0 rounded p-1.5 text-muted-foreground hover:bg-accent disabled:opacity-30"
            >
              <Undo className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Redo"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="shrink-0 rounded p-1.5 text-muted-foreground hover:bg-accent disabled:opacity-30"
            >
              <Redo className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
