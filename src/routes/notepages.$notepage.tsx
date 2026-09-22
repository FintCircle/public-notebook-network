import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Download, ExternalLink, PenLine, Trash2 } from "lucide-react";
import { useState } from "react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { notepages, notesOf } from "@/data/inktella";

export const Route = createFileRoute("/notepages/$notepage")({
  loader: ({ params }) => {
    const notepage = notepages.find((item) => item.slug === params.notepage);
    if (!notepage) throw notFound();
    return { notepage };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Posts | ${loaderData?.notepage.name ?? "Notepage"}` }],
  }),
  component: PostsManagement,
});

function PostsManagement() {
  const { notepage } = Route.useLoaderData();
  const [removed, setRemoved] = useState(false);
  const notes = notesOf(notepage.slug);

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

  function deleteNotepage() {
    if (
      window.confirm(
        `Delete ${notepage.name} forever? All notes will be removed and this cannot be undone.`,
      )
    )
      setRemoved(true);
  }

  if (removed)
    return (
      <main className="grid min-h-screen place-items-center px-5 text-center">
        <div>
          <h1 className="text-3xl">Notepage removed</h1>
          <p className="mt-3 text-muted-foreground">
            This Notepage and its notes have been permanently removed.
          </p>
          <Button asChild className="mt-6">
            <Link to="/notepages">Back to Notepages</Link>
          </Button>
        </div>
      </main>
    );

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
              <h1 className="mt-1 text-3xl font-semibold">Posts</h1>
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
          <div className="flex border-b border-border/70 bg-muted/30 p-2 text-sm">
            <span className="rounded-md bg-background px-4 py-2 font-medium shadow-sm">
              Published <span className="ml-1 opacity-50">{notes.length}</span>
            </span>
            <span className="px-4 py-2 text-muted-foreground">
              Drafts <span className="ml-1 opacity-50">0</span>
            </span>
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  aria-label="Delete Notepage"
                  title="Delete Notepage"
                  onClick={deleteNotepage}
                >
                  <Trash2 aria-hidden />
                </Button>
              </div>
            </div>
            <div className="flex flex-col divide-y divide-border/60">
              {notes.map((note) => (
                <Link
                  key={note.id}
                  to="/$notepage/notepage/$noteId"
                  params={{ notepage: notepage.slug, noteId: note.id }}
                  className="flex gap-4 border-b border-border/60 py-3 transition-colors last:border-b-0 hover:bg-muted/50"
                >
                  <time
                    dateTime={note.publishedAt}
                    className="w-24 shrink-0 text-sm text-muted-foreground"
                  >
                    {new Date(note.publishedAt).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </time>
                  <span className="font-medium">{note.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
