import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, MessageCircle } from "lucide-react";
import { SiteFooter, SiteNav } from "@/components/site-nav";

export const Route = createFileRoute("/questions/archive")({
  head: () => ({
    meta: [
      { title: "Question archive · Inktella" },
      { name: "description", content: "Browse every question asked by Inktella and read the community's answers." },
      { property: "og:title", content: "Question archive · Inktella" },
      { property: "og:description", content: "A growing archive of thoughtful questions and community answers." },
    ],
  }),
  component: QuestionsArchivePage,
});

const archive = [
  { id: "today", date: "Today", question: "What would you make more room for in your life?", replies: 128 },
  { id: "slowly", date: "Sep 26", question: "What is worth doing slowly?", replies: 204 },
  { id: "unlike-you", date: "Sep 25", question: "What did you learn from someone unlike you?", replies: 176 },
  { id: "beginning", date: "Sep 24", question: "What are you ready to begin again?", replies: 91 },
];

function QuestionsArchivePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-5 py-8 sm:py-12">
        <header className="border-b border-border/70 pb-7">
          <Link to="/question" className="text-sm text-muted-foreground hover:text-foreground">← Question of the day</Link>
          <p className="hand mt-8 text-lg text-muted-foreground">sit with a question</p>
          <h1 className="mt-1 text-4xl tracking-tight sm:text-5xl">Question archive.</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">Every question stays open. Choose one to read the answers people left behind.</p>
        </header>
        <section className="divide-y divide-border/70" aria-label="Archived questions">
          {archive.map((item) => (
            <Link key={item.id} to="/questions/$questionId" params={{ questionId: item.id }} className="group flex items-center justify-between gap-5 py-6 hover:bg-muted/30">
              <span className="min-w-0">
                <span className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">{item.date}</span>
                <span className="mt-2 block text-xl leading-snug">{item.question}</span>
                <span className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><MessageCircle aria-hidden /> {item.replies} answers</span>
              </span>
              <ArrowUpRight aria-hidden className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </section>
        <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground"><BookOpen aria-hidden /> New questions are added as the community answers them.</div>
      </main>
      <SiteFooter />
    </div>
  );
}

export default QuestionsArchivePage;
