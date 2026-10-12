import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, ExternalLink, PenLine, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { notepages, notesOf, type Notepage } from "@/data/inktella";
import { drafts } from "@/lib/inktella-store";
import { useInktellaStore } from "@/lib/inktella-store";
import { deleteNote as deleteNoteFn } from "@/lib/inktella.functions";

export const Route = createFileRoute("/notepages/$notepage")({
  head: () => ({
    meta: [
      { title: "Manage notes | Inktella" },
      { name: "description", content: "Manage the notes in your Notepage." },
      { property: "og:title", content: "Manage notes | Inktella" },
      { property: "og:description", content: "Manage the notes in your Notepage." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PostsManagementRoute,
});

function PostsManagementRoute() {
  const params = Route.useParams();
  const notepage = notepages.find((item) => item.slug === params.notepage);
  if (!notepage) return <p className="p-10 text-center">This Notepage doesn&apos;t exist.</p>;
  return <PostsManagement notepage={notepage} />;
}

function PostsManagement({ notepage }: { notepage: Notepage }) {
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"published" | "drafts">("published");
  const notes = [...notesOf(notepage.slug), ...drafts.filter((note) => note.notepage === notepage.slug)].filter((note) => !deletedIds.includes(note.id));
  const visibleNotes = notes.filter((note) => note.status === activeTab);
  const { refresh } = useInktellaStore();

  function exportNotes() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify({ notepage, notes }, null, 2)], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `${notepage.slug}-notes.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleDeleteNote(noteId: string) {
    if (!window.confirm("Delete this note? This cannot be undone.")) return;
    try {
      await deleteNoteFn({ data: { noteId } });
      setDeletedIds((current) => [...current, noteId]);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete note.");
    }
  }

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="min-h-[calc(100dvh-4rem)] w-full">
        <Link
          to="/notepages"
          className="flex h-10 items-center gap-2 border-b border-border/70 px-5 text-xs text-muted-foreground transition-colors hover:text-foreground sm:px-8"
        >
          <ArrowLeft aria-hidden /> Back to Notepages
        </Link>
        <section className="overflow-hidden border-b border-border/70 bg-card">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 px-5 py-5 sm:px-8 sm:py-6">
            <div>
              <p className="text-sm text-muted-foreground">{notepage.owner}&apos;s Notepage</p>
              <h1 className="mt-1 text-3xl font-semibold">Notes</h1>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">{notepage.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2">
                <Button asChild size="icon" aria-label="New post" title="New post">
                  <Link to="/write" search={{ notepage: notepage.slug }}>
                    <PenLine aria-hidden />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  size="icon"
                  aria-label="View Notepage"
                  title="View Notepage"
                >
                  <Link to="/$notepage" params={{ notepage: notepage.slug }}>
                    <ExternalLink aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex border-b border-border/70 bg-muted/30 p-2 text-sm" role="tablist" aria-label="Note status">
            <button type="button" role="tab" aria-selected={activeTab === "published"} onClick={() => setActiveTab("published")} className={activeTab === "published" ? "rounded-md bg-background px-4 py-2 font-medium shadow-sm" : "px-4 py-2 text-muted-foreground"}>
              Published <span className="ml-1 opacity-50">{notes.filter((note) => note.status === "published").length}</span>
            </button>
            <button type="button" role="tab" aria-selected={activeTab === "drafts"} onClick={() => setActiveTab("drafts")} className={activeTab === "drafts" ? "rounded-md bg-background px-4 py-2 font-medium shadow-sm" : "px-4 py-2 text-muted-foreground"}>
              Drafts <span className="ml-1 opacity-50">{notes.filter((note) => note.status === "draft").length}</span>
            </button>
          </div>
          <div className="px-5 py-5 sm:px-8 sm:py-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">{new Date().getFullYear()}</h2>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Export notes"
                  title="Export notes"
                  onClick={exportNotes}
                >
                  <Download aria-hidden />
                </Button>

              </div>
            </div>
            <div className="flex flex-col divide-y divide-border/60">
              {visibleNotes.map((note) => (
                <div key={note.id} className="flex items-center gap-3 border-b border-border/60 py-3 last:border-b-0 hover:bg-muted/50">
                  <Link to="/$notepage/notepage/$noteId" params={{ notepage: notepage.slug, noteId: note.id }} className="flex min-w-0 flex-1 gap-4">
                    <time dateTime={note.publishedAt} className="w-24 shrink-0 text-sm text-muted-foreground">
                      {new Date(note.publishedAt || Date.now()).toLocaleDateString("en-US", { day: "2-digit", month: "short" })}
                    </time>
                    <span className="font-medium">{note.title}</span>
                    {note.status === "draft" && <span className="text-xs text-muted-foreground">Draft</span>}
                  </Link>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button variant="ghost" size="icon" asChild aria-label={`Edit ${note.title}`} title="Edit note">
                      <Link to="/write" search={{ notepage: notepage.slug, edit: note.id }}><Pencil aria-hidden /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" aria-label={`Delete ${note.title}`} title="Delete note" onClick={() => void handleDeleteNote(note.id)}><Trash2 aria-hidden /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
