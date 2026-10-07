import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowUpRight,
  Flag,
  Heart,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Send,
  Shuffle,
  X,
} from "lucide-react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/question")({ component: QuestionPage });

type Answer = {
  id: number;
  name: string;
  handle: string;
  answer: string;
  likes: number;
  avatar: string;
  bio?: string;
  country?: string;
  countryCode?: string;
  answers?: number;
  joined?: number;
  notepage?: { name: string; description: string; href: string };
};

const answers: Answer[] = [
  {
    id: 1,
    name: "Maya Chen",
    handle: "maya-chen",
    answer: "I would make more room for the people and ideas that keep surprising me.",
    likes: 84,
    avatar: "https://i.pravatar.cc/96?img=47",
    bio: "Building things, writing things.",
    country: "Uganda",
    countryCode: "ug",
    answers: 126,
    joined: 2026,
    notepage: {
      name: "Thoughts While Building",
      description: "Notes on making, learning, and staying curious.",
      href: "/derrick",
    },
  },
  {
    id: 2,
    name: "Jon Bell",
    handle: "jon-bell",
    answer: "Less rushing. More noticing the small, ordinary things that are already enough.",
    likes: 61,
    avatar: "https://i.pravatar.cc/96?img=12",
    bio: "Learning to notice what matters.",
    country: "United States",
    countryCode: "us",
    answers: 89,
    joined: 2025,
  },
  {
    id: 3,
    name: "Amina Yusuf",
    handle: "amina-yusuf",
    answer: "I would choose the honest version, even when it is not the easiest one to explain.",
    likes: 43,
    avatar: "https://i.pravatar.cc/96?img=32",
  },
];

const archive = [
  { date: "Yesterday", question: "What are you making space for?", replies: 128 },
  { date: "Sep 26", question: "What is worth doing slowly?", replies: 204 },
  { date: "Sep 25", question: "What did you learn from someone unlike you?", replies: 176 },
];

function QuestionPage() {
  const [answer, setAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [tab, setTab] = useState<"top" | "new" | "random">("top");
  const [liked, setLiked] = useState<number[]>([]);
  const [shared, setShared] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Answer | null>(null);
  const [suggestion, setSuggestion] = useState("");
  const [suggestionSent, setSuggestionSent] = useState(false);

  const visibleAnswers = useMemo(() => {
    if (tab === "new") return [...answers].reverse();
    if (tab === "random")
      return [answers[1], answers[2], answers[0]].filter((a): a is Answer => !!a);
    return answers;
  }, [tab]);

  function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (answer.trim()) setHasAnswered(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-5 py-5 sm:py-8">
        <header className="border-b border-border/70 pb-5">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Home
            </Link>
            <p className="hand text-base text-muted-foreground">think first, then read the room</p>
          </div>
          <h1 className="mt-5 text-3xl tracking-tight sm:text-4xl">Question of the day.</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Everyone sees the same question. Give your point of view before you hear theirs.
          </p>
        </header>

        <section className="border-b border-border/70 py-9" aria-labelledby="today-question">
          <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span>Today · Sep 28, 2026</span>
            <span>Question 01</span>
          </div>
          <h2 id="today-question" className="mt-5 text-3xl leading-tight sm:text-5xl">
            What would you make more room for in your life?
          </h2>
          {!hasAnswered ? (
            <form
              onSubmit={submitAnswer}
              className="mt-7 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"
            >
              <label htmlFor="answer" className="sr-only">
                Your answer
              </label>
              <textarea
                id="answer"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Write your answer before reading the crowd..."
                rows={4}
                className="w-full resize-none bg-transparent text-lg outline-none placeholder:text-muted-foreground/60"
              />
              <div className="mt-3 flex items-center justify-between gap-4 border-t border-border/70 pt-3">
                <span className="text-xs text-muted-foreground">
                  Your first thought is the point.
                </span>
                <Button type="submit" disabled={!answer.trim()}>
                  Unlock the answers <Send aria-hidden />
                </Button>
              </div>
            </form>
          ) : (
            <div className="mt-7 flex items-center gap-3 rounded-xl bg-accent/60 p-4 text-sm">
              <LockKeyhole aria-hidden className="size-4" /> Your answer is in. The crowd is
              unlocked.
            </div>
          )}
        </section>

        <section className="py-8" aria-labelledby="answers-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="hand text-lg text-muted-foreground">after your answer</p>
              <h2 id="answers-heading" className="mt-1 text-3xl">
                The room
              </h2>
            </div>
            {hasAnswered && (
              <div
                className="flex rounded-full bg-muted p-1 text-sm"
                role="tablist"
                aria-label="Answer sorting"
              >
                <button
                  type="button"
                  onClick={() => setTab("top")}
                  className={`rounded-full px-3 py-1.5 ${tab === "top" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                  role="tab"
                  aria-selected={tab === "top"}
                >
                  Top
                </button>
                <button
                  type="button"
                  onClick={() => setTab("new")}
                  className={`rounded-full px-3 py-1.5 ${tab === "new" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                  role="tab"
                  aria-selected={tab === "new"}
                >
                  Just in
                </button>
                <button
                  type="button"
                  onClick={() => setTab("random")}
                  className={`rounded-full px-3 py-1.5 ${tab === "random" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                  role="tab"
                  aria-selected={tab === "random"}
                >
                  Random
                </button>
              </div>
            )}
          </div>
          {!hasAnswered ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
              <LockKeyhole aria-hidden className="mx-auto size-5" />
              <p className="mt-3">Answer first. Then the room opens.</p>
            </div>
          ) : (
            <div className="mt-5 divide-y divide-border/70">
              {visibleAnswers.map((item) => (
                <article key={item.id} className="flex gap-4 py-5">
                  <button
                    type="button"
                    className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => setSelectedProfile(item)}
                    aria-label={`View ${item.name}'s profile`}
                  >
                    <Avatar className="size-10">
                      <AvatarImage src={item.avatar} alt="" />
                      <AvatarFallback>{item.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                      <button
                        type="button"
                        onClick={() => setSelectedProfile(item)}
                        className="font-medium hover:underline"
                      >
                        {item.name}
                      </button>
                      <span className="text-muted-foreground">@{item.handle} · 2h</span>
                    </div>
                    <p className="mt-2 text-base leading-relaxed">{item.answer}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <button
                        type="button"
                        onClick={() =>
                          setLiked((current) =>
                            current.includes(item.id)
                              ? current.filter((id) => id !== item.id)
                              : [...current, item.id],
                          )
                        }
                        className="inline-flex items-center gap-1.5 hover:text-foreground"
                        aria-label={`Like ${item.name}'s answer`}
                      >
                        <Heart
                          aria-hidden
                          className={`size-4 ${liked.includes(item.id) ? "fill-current text-rose-500" : ""}`}
                        />{" "}
                        {item.likes + (liked.includes(item.id) ? 1 : 0)}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShared(true)}
                        className="inline-flex items-center gap-1.5 hover:text-foreground"
                      >
                        <MessageCircle aria-hidden className="size-4" /> Share
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 hover:text-foreground"
                      >
                        <Flag aria-hidden className="size-4" /> Report
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          {shared && (
            <p className="mt-3 text-xs text-muted-foreground" role="status">
              Answer link copied to your clipboard.
            </p>
          )}
        </section>

        {selectedProfile && (
          <div
            className="fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedProfile.name}'s profile`}
          >
            <button
              type="button"
              className="absolute inset-0 bg-foreground/20"
              aria-label="Close profile"
              onClick={() => setSelectedProfile(null)}
            />
            <section
              className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl border-t border-border bg-background p-6 shadow-2xl sm:left-1/2 sm:max-w-lg sm:-translate-x-1/2 sm:rounded-3xl sm:border"
              aria-labelledby="profile-sheet-title"
            >
              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-muted-foreground/30 sm:hidden" />
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="size-16">
                    <AvatarImage
                      src={selectedProfile.avatar}
                      alt={`${selectedProfile.name} profile photo`}
                    />
                    <AvatarFallback>{selectedProfile.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 id="profile-sheet-title" className="text-xl font-semibold">
                      {selectedProfile.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">@{selectedProfile.handle}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProfile(null)}
                  className="rounded-full p-2 hover:bg-muted"
                  aria-label="Close profile"
                >
                  <X aria-hidden className="size-5" />
                </button>
              </div>
              <p className="mt-5 text-base">{selectedProfile.bio}</p>
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {selectedProfile.country && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin aria-hidden className="size-4" />
                    {selectedProfile.country}
                  </span>
                )}
                <span>{selectedProfile.answers} points of view (answers)</span>
                <span>Joined {selectedProfile.joined}</span>
              </div>
              {selectedProfile.notepage && (
                <Link
                  to={selectedProfile.notepage.href}
                  onClick={() => setSelectedProfile(null)}
                  className="mt-6 flex items-center justify-between rounded-2xl border border-border/70 p-4 transition-colors hover:bg-muted"
                >
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                      Notepage
                    </span>
                    <span className="mt-1 block font-medium">{selectedProfile.notepage.name}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {selectedProfile.notepage.description}
                    </span>
                  </span>
                  <ArrowUpRight aria-hidden className="size-5 shrink-0" />
                </Link>
              )}
            </section>
          </div>
        )}

        <section
          className="border-t border-border/70 py-8"
          aria-labelledby="suggest-question-heading"
        >
          <p className="hand text-lg text-muted-foreground">help shape tomorrow</p>
          <h2 id="suggest-question-heading" className="mt-1 text-2xl">
            Suggest a question
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Have a question everyone should sit with? Send it to the Inktella team.
          </p>
          {suggestionSent ? (
            <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-sm">
              Thanks — your suggestion is with the team.
            </p>
          ) : (
            <form
              className="mt-4 flex flex-col gap-2 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                if (suggestion.trim()) {
                  setSuggestionSent(true);
                  setSuggestion("");
                }
              }}
            >
              <input
                value={suggestion}
                onChange={(event) => setSuggestion(event.target.value)}
                placeholder="What should we ask?"
                className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <Button type="submit">Send suggestion</Button>
            </form>
          )}
        </section>

        <section className="border-t border-border/70 pt-8" aria-labelledby="archive-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="hand text-lg text-muted-foreground">the questions we have asked</p>
              <h2 id="archive-heading" className="mt-1 text-3xl">
                Archive
              </h2>
            </div>
            <span className="text-sm text-muted-foreground">Browse only</span>
          </div>
          <div className="mt-5 divide-y divide-border/70">
            {archive.map((item) => (
              <article
                key={item.date}
                className="flex flex-wrap items-baseline justify-between gap-3 py-4"
              >
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {item.date}
                  </p>
                  <h3 className="mt-1 text-lg">{item.question}</h3>
                </div>
                <span className="text-sm text-muted-foreground">{item.replies} answers</span>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
