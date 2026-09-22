import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Download, Eye, FileText, PenLine, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { notepages, notesOf } from "@/data/inktella";

export const Route = createFileRoute("/notepages/")({
  head: () => ({
    meta: [
      { title: "My Notepages | Inktella" },
      {
        name: "description",
        content: "Open your notebooks, add notes, and manage your Notepages.",
      },
      { property: "og:title", content: "My Notepages | Inktella" },
      { property: "og:description", content: "Open your notebooks and add notes on Inktella." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MyNotepages,
});

function MyNotepages() {
  const [removed, setRemoved] = useState<string[]>([]);
  const mine = notepages.slice(0, 2).filter((np) => !removed.includes(np.slug));

  function exportNotes(np: (typeof notepages)[number]) {
    const payload = JSON.stringify({ notepage: np, notes: notesOf(np.slug) }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${np.slug}-notes.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function deleteNotepage(np: (typeof notepages)[number]) {
    if (window.confirm(`Delete ${np.name} forever? This cannot be undone.`))
      setRemoved((current) => [...current, np.slug]);
  }

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-3xl sm:text-4xl">My Notepages</h1>
            <p className="hand mt-2 text-xl opacity-60">your notebooks, all in one place</p>
          </div>
          <Button asChild>
            <Link to="/notepages/new">
              <Plus aria-hidden />
              New Notepage
            </Link>
          </Button>
        </div>
        <div className="mt-10 flex flex-col gap-8">
          {mine.map((np) => {
            const entries = notesOf(np.slug);
            return (
              <article
                key={np.slug}
                className="overflow-hidden rounded-2xl border border-border/70 bg-card"
              >
                <div className="border-b border-border/70 p-5 sm:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <BookOpen aria-hidden className="size-4 opacity-45" />
                        <h2 className="text-xl sm:text-2xl">{np.name}</h2>
                      </div>
                      <p className="mt-2 max-w-[52ch] text-sm leading-relaxed opacity-65">
                        {np.description}
                      </p>
                      <p className="mt-3 text-xs opacity-45">
                        {entries.length} notes · renews Sep 2027
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" asChild>
                        <Link to="/$notepage" params={{ notepage: np.slug }}>
                          <Eye aria-hidden />
                          View
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link to="/write" search={{ notepage: np.slug }}>
                          <PenLine aria-hidden />
                          New note
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="mt-7 flex items-center gap-1 rounded-xl bg-muted p-1 text-sm">
                    <span className="rounded-lg bg-background px-4 py-2 font-medium shadow-sm">
                      Notes <span className="ml-1 opacity-50">{entries.length}</span>
                    </span>
                    <span className="px-4 py-2 opacity-55">Pages</span>
                    <span className="px-4 py-2 opacity-55">Comments</span>
                  </div>
                </div>
                <div className="p-5 sm:p-7">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-2xl font-semibold">Notes</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => exportNotes(np)}>
                        <Download aria-hidden />
                        Export notes
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteNotepage(np)}
                      >
                        <Trash2 aria-hidden />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col divide-y divide-border/60">
                    {entries.map((note) => (
                      <Link
                        key={note.id}
                        to="/$notepage/notepage/$noteId"
                        params={{ notepage: np.slug, noteId: note.id }}
                        className="flex gap-4 py-3 transition-colors hover:bg-muted/50"
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
              </article>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
