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
      <main className="mx-auto max-w-4xl px-5 py-10 sm:py-16">
        <Link
          to="/notepages"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft aria-hidden /> Back to Notepages
        </Link>
        <section className="mt-8 overflow-hidden rounded-2xl border border-border/70 bg-card">
          <div className="flex flex-wrap items-start justify-between gap-5 border-b border-border/70 p-5 sm:p-8">
            <div>
              <p className="text-sm text-muted-foreground">{notepage.owner}&apos;s Notepage</p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-5xl">Posts</h1>
              <p className="mt-3 max-w-xl text-muted-foreground">{notepage.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/write" search={{ notepage: notepage.slug }}>
                  <PenLine aria-hidden />
                  New Post
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/$notepage" params={{ notepage: notepage.slug }}>
                  <ExternalLink aria-hidden />
                  View
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-1 border-b border-border/70 bg-muted/40 p-2 text-sm">
            <span className="rounded-lg bg-background px-4 py-2 font-medium shadow-sm">
              Published <span className="ml-1 opacity-50">{notes.length}</span>
            </span>
            <span className="px-4 py-2 text-muted-foreground">
              Drafts <span className="ml-1 opacity-50">0</span>
            </span>
          </div>
          <div className="p-5 sm:p-8">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold">{new Date().getFullYear()}</h2>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={exportNotes}>
                  <Download aria-hidden />
                  Export notes
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={deleteNotepage}
                >
                  <Trash2 aria-hidden />
                  Delete
                </Button>
              </div>
            </div>
            <div className="flex flex-col divide-y divide-border/60">
              {notes.map((note) => (
                <Link
                  key={note.id}
                  to="/$notepage/notepage/$noteId"
                  params={{ notepage: notepage.slug, noteId: note.id }}
                  className="flex gap-4 py-4 transition-colors hover:bg-muted/50"
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
