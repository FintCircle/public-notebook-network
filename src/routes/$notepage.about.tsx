import { createFileRoute, Link } from "@tanstack/react-router";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useState } from "react";
import { ArrowLeft, Bold, Italic, Underline as UnderlineIcon, Check, Pencil } from "lucide-react";
import { getNotepage } from "@/data/inktella";

export const Route = createFileRoute("/$notepage/about")({
  head: ({ params }) => {
    const page = getNotepage(params.notepage);
    return { meta: [{ title: page ? `About ${page.name} — Inktella` : "About | Inktella" }] };
  },
  component: NotepageAbout,
});

function NotepageAbout() {
  const { notepage: slug } = Route.useParams();
  const page = getNotepage(slug);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(`<p>${page?.description ?? "A public notebook for ideas worth keeping."}</p>`);
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content,
    editable: editing,
    onUpdate: ({ editor: instance }) => setContent(instance.getHTML()),
  }, [editing]);
  if (!page) return null;

  return (
    <main className="min-h-screen bg-background px-5 py-8 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <Link to="/$notepage" params={{ notepage: slug }} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft aria-hidden /> {page.name}</Link>
          <button type="button" onClick={() => setEditing((value) => !value)} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm hover:bg-muted">
            {editing ? <><Check aria-hidden /> Done</> : <><Pencil aria-hidden /> Edit about</>}
          </button>
        </div>
        <section className="mt-12">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">About this Notepage</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{page.name}</h1>
          <p className="mt-5 text-xl leading-relaxed text-muted-foreground">{page.description}</p>
          {editing && (
            <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex items-center gap-1 border-b border-border p-2">
                <button type="button" aria-label="Bold" onClick={() => editor?.chain().focus().toggleBold().run()} className="rounded p-2 hover:bg-muted"><Bold aria-hidden /></button>
                <button type="button" aria-label="Italic" onClick={() => editor?.chain().focus().toggleItalic().run()} className="rounded p-2 hover:bg-muted"><Italic aria-hidden /></button>
                <button type="button" aria-label="Underline" onClick={() => editor?.chain().focus().toggleUnderline().run()} className="rounded p-2 hover:bg-muted"><UnderlineIcon aria-hidden /></button>
              </div>
              <EditorContent editor={editor} className="prose-note min-h-64 p-5 text-lg" />
            </div>
          )}
          {!editing && <article className="prose-note mt-10 text-lg" dangerouslySetInnerHTML={{ __html: content }} />}
          <p className="mt-12 border-t border-border pt-6 text-muted-foreground">Created by <Link to="/profile" className="font-medium text-foreground underline underline-offset-4">{page.owner}</Link>.</p>
        </section>
      </div>
    </main>
  );
}
