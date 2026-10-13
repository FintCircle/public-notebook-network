import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Eye, Heart, Mail, Megaphone, Sparkles } from "lucide-react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { AuthOnly } from "@/lib/auth";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Inktella" },
      { name: "description", content: "Views, likes, guestnotes, and news from Inktella." },
    ],
  }),
  component: NotificationsPage,
});

type Kind = "view" | "like" | "guestnote" | "system";
type Item = { id: number; kind: Kind; title: string; body: string; time: string; unread: boolean };

const initialItems: Item[] = [
  {
    id: 1,
    kind: "view",
    title: "Someone wandered in",
    body: "Your note “Something I noticed today” got a new view.",
    time: "just now",
    unread: true,
  },
  {
    id: 2,
    kind: "like",
    title: "A quiet little heart",
    body: "Mara liked your note about making personal websites.",
    time: "18 min ago",
    unread: true,
  },
  {
    id: 3,
    kind: "guestnote",
    title: "A guestnote arrived",
    body: "Theo left a note in your guestbook: “This made me stop scrolling.”",
    time: "yesterday",
    unread: false,
  },
  {
    id: 4,
    kind: "system",
    title: "A note from Inktella",
    body: "Your corner of the network is looking good. Keep the unfinished things coming.",
    time: "3 days ago",
    unread: false,
  },
];

const iconFor: Record<Kind, typeof Bell> = {
  view: Eye,
  like: Heart,
  guestnote: Mail,
  system: Megaphone,
};

function NotificationsPage() {
  const [items, setItems] = useState(initialItems);
  const unread = useMemo(() => items.filter((item) => item.unread).length, [items]);

  return (
    <AuthOnly message="Notifications are where the network taps you on the shoulder.">
      <div className="min-h-screen">
        <SiteNav />
        <main className="mx-auto max-w-2xl px-5 py-8 sm:py-12">
          <div className="flex items-center justify-between gap-5 border-b border-border/70 pb-5">
            <div>
              <p className="hand text-lg text-muted-foreground">the little inbox</p>
              <h1 className="mt-1 font-heading text-3xl tracking-tight sm:text-4xl">Notifications</h1>
            </div>
            <div
              className="rounded-full border border-border/70 p-2.5 text-muted-foreground"
              aria-hidden
            >
              <Bell size={19} />
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-border/70 py-4 text-sm">
            <span>{unread ? `${unread} unread` : "All caught up"}</span>
            <button
              type="button"
              className="underline underline-offset-4 disabled:no-underline disabled:opacity-40"
              disabled={!unread}
              onClick={() =>
                setItems((current) => current.map((item) => ({ ...item, unread: false })))
              }
            >
              Mark all read
            </button>
          </div>

          <div className="divide-y divide-border/70">
            {items.map((item) => {
              const Icon = iconFor[item.kind];
              return (
                <article
                  key={item.id}
                  className={`flex gap-4 py-6 ${item.unread ? "bg-secondary/20" : ""}`}
                >
                  <div
                    className={`mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border ${item.unread ? "border-primary/30 bg-primary/10 text-primary" : "border-border/70 text-muted-foreground"}`}
                  >
                    <Icon size={18} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="font-medium">{item.title}</h2>
                      <time className="shrink-0 text-xs text-muted-foreground">{item.time}</time>
                    </div>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{item.body}</p>
                    {item.kind === "guestnote" && (
                      <Link
                        to="/profile"
                        className="mt-3 inline-block text-sm underline underline-offset-4"
                      >
                        Open your guestbook
                      </Link>
                    )}
                  </div>
                  {item.unread && (
                    <span
                      className="mt-2 size-2 shrink-0 rounded-full bg-primary"
                      aria-label="Unread"
                    />
                  )}
                </article>
              );
            })}
          </div>

          <div className="mt-12 flex items-center gap-3 text-sm text-muted-foreground">
            <Sparkles size={16} aria-hidden />
            <span>More good things happen when you leave the internet a little room.</span>
          </div>
        </main>
        <SiteFooter />
      </div>
    </AuthOnly>
  );
}
