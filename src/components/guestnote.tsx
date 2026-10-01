import { Heart, MapPin, MessageCirclePlus, Send } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Notepage } from "@/data/inktella";
import { guestnotes, useInktellaStore } from "@/lib/inktella-store";
import { addGuestnote } from "@/lib/inktella.functions";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";

type GuestbookEntry = {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  message: string;
  portrait?: string;
  reply?: string;
};

function Avatar({ entry, notepage }: { entry: GuestbookEntry; notepage: Notepage }) {
  return entry.portrait ? (
    <img
      src={entry.portrait}
      alt=""
      className="size-12 shrink-0 rounded-full object-cover ring-4 ring-[var(--np-bg)] sm:size-16"
    />
  ) : (
    <div
      className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--np-ink)] text-[var(--np-bg)] ring-4 ring-[var(--np-bg)] sm:size-16"
      aria-hidden
    >
      {notepage.avatarInitial}
    </div>
  );
}

export function Guestnote({ notepage }: { notepage: Notepage }) {
  const [message, setMessage] = useState("");
  const entries: GuestbookEntry[] = guestnotes
    .filter((g) => g.notepageId === notepage.id)
    .map((g) => ({ id: g.id, name: g.name, country: "", countryCode: "", message: g.body, ...(g.portrait ? { portrait: g.portrait } : {}) }));
  const { refresh } = useInktellaStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sendError, setSendError] = useState("");
  const [showComposer, setShowComposer] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowComposer(currentScrollY < 24 || currentScrollY < lastScrollY.current || currentScrollY < 120);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    if (!isAuthenticated) { navigate({ to: "/sign-in" }); return; }
    try {
      await addGuestnote({ data: { notepageId: notepage.id, body: trimmed } });
      setMessage("");
      await refresh();
    } catch {
      setSendError("That guestnote didn't send. Try again.");
    }
  }

  return (
    <section id="guestnote" className="mt-12 pt-16 sm:mt-16 sm:pt-0" aria-labelledby="guestnote-heading">
      <h2 id="guestnote-heading" className="sr-only">
        Guestnotes from visitors
      </h2>
      <div className="relative max-w-4xl">
        <div className="absolute bottom-10 left-6 top-7 w-px bg-current/25 sm:left-8" aria-hidden />
        <div className="flex flex-col gap-11 sm:gap-14">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="relative grid grid-cols-[3rem_1fr] gap-4 sm:grid-cols-[4rem_1fr] sm:gap-6"
            >
              <Avatar entry={entry} notepage={notepage} />
              <div className="min-w-0 pt-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <strong className="text-base sm:text-lg">{entry.name}</strong>
                  {false && (
                    <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs text-white">
                      Inker
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 opacity-60">
                    <MapPin aria-hidden className="size-3.5" />
                    {entry.country}
                  </span>
                  <span className="opacity-55">8mo ago</span>
                </div>
                <p className="mt-2 max-w-3xl text-[1.05rem] leading-7 sm:text-xl sm:leading-8">
                  {entry.message}
                </p>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100"
                  aria-label={`Like ${entry.name}'s guestnote`}
                >
                  <Heart aria-hidden className="size-5" /> {entry.id === "reader-1" ? 4 : 1}
                </button>
                {entry.reply && (
                  <div className="relative mt-9 ml-[-1rem] border-l border-b border-current/35 pb-2 pl-5 sm:ml-[-2rem] sm:pl-8">
                    <div
                      className="absolute -left-1 bottom-[-1px] size-2 rounded-full bg-current/60"
                      aria-hidden
                    />
                    <div className="flex items-center gap-3">
                      <Avatar
                        entry={{ ...entry, name: notepage.owner, portrait: notepage.portrait }}
                        notepage={notepage}
                      />
                      <strong className="text-base sm:text-lg">{notepage.owner}</strong>
                      <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs text-white">
                        Inker
                      </span>
                    </div>
                    <p className="mt-2 pl-1 text-[1.05rem] leading-7 sm:text-lg sm:leading-8">
                      {entry.reply}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-2 text-sm opacity-60">
                      <Heart aria-hidden className="size-5" /> 2
                    </span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <form
        onSubmit={submitMessage}
        className="mt-14 hidden items-center gap-5 rounded-2xl border border-current/15 bg-white/25 p-5 shadow-sm backdrop-blur-sm sm:flex"
      >
        <img
          src={notepage.portrait}
          alt={`${notepage.owner}`}
          className="size-12 rounded-full object-cover"
        />
        <label className="flex-1">
          <span className="sr-only">Guestnote message</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Leave a guestnote..."
            maxLength={500}
            rows={1}
            className="w-full resize-none rounded-xl border border-current/15 bg-transparent px-4 py-3 text-base outline-none placeholder:opacity-50 focus:border-current/35"
          />
        </label>
        <button
          type="submit"
          disabled={!message.trim()}
          className="inline-flex h-12 items-center gap-3 rounded-xl bg-[var(--np-ink)] px-6 text-base text-[var(--np-bg)] transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-35"
        >
          Post <Send aria-hidden className="size-4" />
        </button>
      </form>
      {sendError && <p role="alert" className="mt-3 text-sm opacity-80">{sendError}</p>}
      <div className={`fixed inset-x-4 top-4 z-20 transition-all duration-300 sm:hidden ${showComposer ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-5 opacity-0"}`}>
        <form
          onSubmit={submitMessage}
          className="flex items-center gap-3 rounded-full bg-[var(--np-ink)] p-2 pl-5 pr-3 text-[var(--np-bg)] shadow-xl shadow-black/15"
        >
          <label className="min-w-0 flex-1">
            <span className="sr-only">Guestnote message</span>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Leave a guestnote..."
              maxLength={500}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--np-bg)]/65"
            />
          </label>
          <button
            type="submit"
            disabled={!message.trim()}
            className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--np-bg)] text-[var(--np-ink)] shadow-sm transition-transform hover:scale-105 disabled:opacity-40"
            aria-label="Post guestnote"
          >
            <MessageCirclePlus aria-hidden className="size-5" />
          </button>
        </form>
      </div>
    </section>
  );
}
