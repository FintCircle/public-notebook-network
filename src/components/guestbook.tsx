import { MessageSquare, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { Notepage } from "@/data/inktella";

type GuestbookEntry = {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  message: string;
};

const initialEntries: GuestbookEntry[] = [
  {
    id: "reader-1",
    name: "A curious reader",
    country: "Kenya",
    countryCode: "KE",
    message: "Loved reading this. I am looking forward to what you write next.",
  },
];

export function Guestbook({ notepage }: { notepage: Notepage }) {
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState(initialEntries);

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
      },
    ]);
    setMessage("");
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

      <div className="mt-8 divide-y divide-current/10">
        {entries.map((entry) => (
          <article key={entry.id} className="flex gap-3 py-5 first:pt-0">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-current/15 text-sm font-medium"
              aria-hidden
            >
              {entry.name.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium">{entry.name}</p>
              <p className="mt-0.5 text-xs opacity-55">
                {entry.country} {entry.countryCode ? `· ${entry.countryCode}` : ""}
              </p>
              <p className="mt-2 text-sm leading-6 opacity-80">{entry.message}</p>
            </div>
          </article>
        ))}
      </div>

      <form onSubmit={submitMessage} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="sr-only">Guestbook message</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write a message..."
            maxLength={500}
            rows={3}
            className="w-full resize-none rounded-xl border border-current/15 bg-transparent px-4 py-3 text-sm outline-none placeholder:opacity-45 focus:border-current/35"
          />
        </label>
        <button
          type="submit"
          disabled={!message.trim()}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-current/20 px-4 text-sm transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Send aria-hidden />
          Sign guestbook
        </button>
      </form>
      <p className="mt-2 text-xs opacity-45">
        Signed-in readers can leave one message for this Notepage.
      </p>
    </section>
  );
}
