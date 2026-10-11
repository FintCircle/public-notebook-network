import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Eye, Palette, PenLine, Plus, Trash2 } from "lucide-react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { notesOf } from "@/data/inktella";
import { myNotepages, useInktellaStore } from "@/lib/inktella-store";
import { deleteNotepage } from "@/lib/inktella.functions";
import { AuthOnly } from "@/lib/auth";

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
  const mine = myNotepages();
  const { refresh } = useInktellaStore();

  async function handleDelete(slug: string, name: string) {
    if (
      window.confirm(
        `Delete ${name} forever? All notes will be removed and this cannot be undone.`,
      )
    ) {
      try {
        await deleteNotepage({ data: { slug } });
        await refresh();
      } catch (err) {
        console.error("Failed to delete notepage", err);
        alert(err instanceof Error ? err.message : "Failed to delete Notepage.");
      }
    }
  }

  return (
    <AuthOnly message="Your notebooks are private until you tell us who you are. The public ones can wait outside.">
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
                        <p className="mt-3 text-xs opacity-45">{entries.length} published notes</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="icon" asChild aria-label="View Notepage" title="View Notepage">
                          <Link to="/$notepage" params={{ notepage: np.slug }}>
                            <Eye aria-hidden />
                          </Link>
                        </Button>
                        <Button size="icon" asChild aria-label="New note" title="New note">
                          <Link to="/write" search={{ notepage: np.slug }}>
                            <PenLine aria-hidden />
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild aria-label={`Notes (${entries.length})`} title={`Notes (${entries.length})`}>
                          <Link to="/notepages/$notepage" params={{ notepage: np.slug }}>
                            <BookOpen aria-hidden />
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild aria-label="Customize Notepage" title="Customize Notepage">
                          <a href={`/customize/${np.slug}`}>
                            <Palette aria-hidden />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          aria-label="Delete Notepage"
                          title="Delete Notepage"
                          onClick={() => handleDelete(np.slug, np.name)}
                        >
                          <Trash2 aria-hidden />
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </main>
        <SiteFooter />
      </div>
    </AuthOnly>
  );
}
