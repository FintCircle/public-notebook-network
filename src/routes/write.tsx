import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiteNav } from "@/components/site-nav";

export const Route = createFileRoute("/write")({
  head: () => ({
    meta: [
      { title: "Write a Note | Inktella" },
      {
        name: "description",
        content:
          "An empty sheet of paper. Write a note — short, long, unfinished, whatever it is.",
      },
      { property: "og:title", content: "Write a Note on Inktella" },
      {
        property: "og:description",
        content: "An empty sheet of paper, not a content management system.",
      },
    ],
  }),
  component: Write,
});

type ToolbarState = { top: number; left: number } | null;

export default function Write() {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [toolbar, setToolbar] = useState<ToolbarState>(null);
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const updateToolbar = useCallback(() => {
    const selection = window.getSelection();
    const surface = bodyRef.current;
    if (!selection || selection.isCollapsed || selection.rangeCount === 0 || !surface) {
      setToolbar(null);
      return;
    }
    const range = selection.getRangeAt(0);
    if (!surface.contains(range.commonAncestorContainer)) {
      setToolbar(null);
      return;
    }
    const rect = range.getBoundingClientRect();
    const host = surface.getBoundingClientRect();
    setToolbar({
      top: rect.top - host.top - 46,
      left: Math.max(0, rect.left - host.left + rect.width / 2),
    });
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", updateToolbar);
    return () => document.removeEventListener("selectionchange", updateToolbar);
  }, [updateToolbar]);

  const run = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateToolbar();
  };

  const insertBlock = (html: string) => {
    bodyRef.current?.focus();
    document.execCommand("insertHTML", false, html);
  };

  const controls: { label: string; title: string; onClick: () => void }[] = [
    { label: "B", title: "Bold", onClick: () => run("bold") },
    { label: "I", title: "Italic", onClick: () => run("italic") },
    { label: "H2", title: "Heading", onClick: () => run("formatBlock", "h2") },
    { label: "H3", title: "Subheading", onClick: () => run("formatBlock", "h3") },
    { label: "\u201C", title: "Quote", onClick: () => run("formatBlock", "blockquote") },
    { label: "•", title: "Bulleted list", onClick: () => run("insertUnorderedList") },
    { label: "1.", title: "Numbered list", onClick: () => run("insertOrderedList") },
    {
      label: "</>",
      title: "Inline code",
      onClick: () => {
        const text = window.getSelection()?.toString() ?? "";
        if (text) insertBlock(`<code>${text}</code>`);
      },
    },
    {
      label: "link",
      title: "Add a link",
      onClick: () => {
        const url = window.prompt("Link to");
        if (url) run("createLink", url);
      },
    },
  ];

  return (
    <div className="min-h-screen">
      <SiteNav />

      <main className="mx-auto max-w-2xl px-5 pt-12 pb-24">
        <h1
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Untitled"
          aria-label="Note title"
          className="font-heading text-3xl leading-tight tracking-tight outline-none empty:before:opacity-30 empty:before:content-[attr(data-placeholder)] sm:text-4xl"
        />

        <div className="relative mt-8">
          {toolbar && (
            <div
              role="toolbar"
              aria-label="Formatting"
              style={{ top: toolbar.top, left: toolbar.left }}
              className="absolute z-10 flex -translate-x-1/2 items-center gap-1 rounded-md border border-border bg-popover px-1.5 py-1 shadow-sm"
            >
              {controls.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  title={c.title}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={c.onClick}
                  className="rounded px-2 py-1 text-xs hover:bg-accent"
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          <div
            ref={bodyRef}
            contentEditable
            suppressContentEditableWarning
            aria-label="Note body"
            data-placeholder="Start writing…"
            className="prose-note min-h-[45vh] outline-none empty:before:opacity-30 empty:before:content-[attr(data-placeholder)]"
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm opacity-60">
          <button
            type="button"
            className="hover:opacity-100"
            onClick={() =>
              insertBlock(
                '<img src="https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=1200&q=70" alt="" />',
              )
            }
          >
            + image
          </button>
          <button
            type="button"
            className="hover:opacity-100"
            onClick={() => insertBlock("<pre><code>code block</code></pre>")}
          >
            + code block
          </button>
          <button
            type="button"
            className="hover:opacity-100"
            onClick={() => insertBlock("<hr />")}
          >
            + separator
          </button>
        </div>

        <hr className="rule-irregular mt-12" />

        <div className="mt-8">
          <label htmlFor="notetags" className="hand text-lg opacity-70">
            notetags (optional)
          </label>
          <input
            id="notetags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="#building #design #thoughts"
            className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm outline-none placeholder:opacity-40 focus:border-foreground"
          />
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            type="button"
            onClick={() => setStatus("Draft saved.")}
            className="text-sm underline underline-offset-4 opacity-70 hover:opacity-100"
          >
            Save draft
          </button>
          <button
            type="button"
            onClick={() => setStatus("Published. Your note now has its own link.")}
            className="rounded-md bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:opacity-90"
          >
            Publish
          </button>
          {status && (
            <span aria-live="polite" className="hand text-lg opacity-70">
              {status}
            </span>
          )}
        </div>
      </main>
    </div>
  );
}
