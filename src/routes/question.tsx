import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Flag, Heart, LockKeyhole, MessageCircle, Send, Shuffle, Sparkles } from "lucide-react";
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
};

const answers: Answer[] = [
  {
    id: 1,
    name: "Maya Chen",
    handle: "maya-chen",
    answer: "I would make more room for the people and ideas that keep surprising me.",
    likes: 84,
    avatar: "https://i.pravatar.cc/96?img=47",
  },
  {
    id: 2,
    name: "Jon Bell",
    handle: "jon-bell",
    answer: "Less rushing. More noticing the small, ordinary things that are already enough.",
    likes: 61,
    avatar: "https://i.pravatar.cc/96?img=12",
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

  const visibleAnswers = useMemo(() => {
    if (tab === "new") return [...answers].reverse();
    if (tab === "random") return [answers[1], answers[2], answers[0]];
    return answers;
  }, [tab]);

  function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (answer.trim()) setHasAnswered(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
        <header className="border-b border-border/70 pb-8">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to the home feed
          </Link>
          <div className="mt-10 flex items-start justify-between gap-5">
            <div>
              <p className="hand text-lg text-muted-foreground">a small pause for a big internet</p>
              <h1 className="mt-2 text-4xl tracking-tight sm:text-6xl">One question a day.</h1>
            </div>
            <div className="rounded-full bg-accent p-3 text-accent-foreground">
              <Sparkles aria-hidden className="size-5" />
            </div>
          </div>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Inktella asks everyone the same question. Give your point of view before you hear
            theirs.
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
                  <Link to="/profile" className="shrink-0">
                    <Avatar className="size-10">
                      <AvatarImage src={item.avatar} alt="" />
                      <AvatarFallback>{item.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                      <Link to="/profile" className="font-medium hover:underline">
                        {item.name}
                      </Link>
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
