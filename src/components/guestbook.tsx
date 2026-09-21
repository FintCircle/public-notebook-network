import { ArrowDownUp, MessageSquare, Send, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { Notepage } from "@/data/inktella";

type GuestbookEntry = {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  message: string;
  createdAt: string;
  reply?: string;
};

const initialEntries: GuestbookEntry[] = [
  {
    id: "reader-1",
    name: "A curious reader",
    country: "Kenya",
    countryCode: "KE",
    message: "Loved reading this. I am looking forward to what you write next.",
    createdAt: "2026-09-18T09:00:00.000Z",
  },
  {
    id: "reader-2",
    name: "Maya Chen",
    country: "Singapore",
    countryCode: "SG",
    message: "The way you frame this is so generous. Thank you for sharing it.",
    createdAt: "2026-09-15T09:00:00.000Z",
    reply: "Thank you, Maya. I am glad it found you.",
  },
];

export function Guestbook({ notepage }: { notepage: Notepage }) {
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState(initialEntries);
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const sortedEntries = [...entries].sort((a, b) =>
    sort === "newest"
      ? b.createdAt.localeCompare(a.createdAt)
      : a.createdAt.localeCompare(b.createdAt),
  );

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    setEntries((current) => [
      ...current,
      {
        id: `reader-${Date.now()}`,
        name: "You",
        country: "Your country",
        countryCode: "",
        message: trimmed,
        createdAt: new Date().toISOString(),
      },
    ]);
    setMessage("");
    setIsSheetOpen(false);
  }

  return (
    <section
      id="guestbook"
      className="mt-16 border-t border-current/15 pt-10"
      aria-labelledby="guestbook-heading"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] opacity-55">A note for the owner</p>
          <h2 id="guestbook-heading" className="mt-2 font-heading text-3xl tracking-tight">
            Guestbook
          </h2>
          <p className="mt-2 max-w-[38ch] text-sm leading-6 opacity-65">
            Leave {notepage.owner} a short message about what you found here.
          </p>
        </div>
        <MessageSquare aria-hidden className="mt-1 shrink-0 opacity-45" />
      </div>

      <div className="mt-8 flex items-center justify-between border-y border-current/10 py-3">
        <p className="text-xs uppercase tracking-[0.16em] opacity-55">
          {entries.length} guest notes
        </p>
        <label className="inline-flex items-center gap-2 text-xs opacity-70">
          <ArrowDownUp aria-hidden />
          <span className="sr-only">Sort guest notes</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as "newest" | "oldest")}
            className="bg-transparent outline-none"
          >
            <option value="newest">New</option>
            <option value="oldest">Old</option>
          </select>
        </label>
      </div>

      <div className="divide-y divide-current/10">
        {sortedEntries.map((entry) => (
          <article key={entry.id} className="py-5 first:pt-6">
            <div className="flex gap-3">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-current/15 text-sm font-medium"
                aria-hidden
              >
                {entry.name.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="text-sm font-medium">{entry.name}</p>
                  <time dateTime={entry.createdAt} className="text-xs opacity-45">
                    {new Date(entry.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <p className="mt-0.5 text-xs opacity-55">
                  {entry.country} {entry.countryCode ? `· ${entry.countryCode}` : ""}
                </p>
                <p className="mt-2 text-sm leading-6 opacity-80">{entry.message}</p>
                {entry.reply ? (
                  <div className="mt-3 border-l-2 border-current/15 pl-3 text-sm leading-6 opacity-65">
                    <span className="font-medium">{notepage.owner} replied</span>
                    <p>{entry.reply}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="sticky bottom-3 z-10 mt-5 flex justify-center sm:static sm:justify-start">
        <button
          type="button"
          onClick={() => setIsSheetOpen(true)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-current/20 bg-background px-5 text-sm font-medium shadow-sm transition-opacity hover:opacity-70"
        >
          <MessageSquare aria-hidden /> Leave a guest note
        </button>
      </div>
      <p className="mt-3 text-center text-xs opacity-45 sm:text-left">
        Signed-in readers can leave one note. Publishing costs $0.25.
      </p>

      {isSheetOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/25 sm:items-center sm:justify-center"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsSheetOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="guest-note-title"
            className="w-full rounded-t-2xl bg-background p-5 shadow-xl sm:max-w-lg sm:rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] opacity-55">Guestbook</p>
                <h3 id="guest-note-title" className="mt-1 text-xl">
                  Leave a guest note
                </h3>
              </div>
              <button type="button" onClick={() => setIsSheetOpen(false)} aria-label="Close">
                <X aria-hidden />
              </button>
            </div>
            <form onSubmit={submitMessage} className="mt-5 flex flex-col gap-3">
              <textarea
                autoFocus
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write something kind..."
                maxLength={500}
                rows={5}
                className="w-full resize-none rounded-xl border border-current/15 bg-transparent px-4 py-3 text-sm outline-none placeholder:opacity-45 focus:border-current/35"
              />
              <p className="text-xs opacity-55">
                Publishing costs $0.25. Payment is currently represented as a preview step until
                checkout is connected.
              </p>
              <button
                type="submit"
                disabled={!message.trim()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-current/20 px-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-35"
              >
                <Send aria-hidden /> Continue to publish — $0.25
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
