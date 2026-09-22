import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Circle, ShieldCheck } from "lucide-react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { AuthOnly } from "@/lib/auth";

export const Route = createFileRoute("/ink-program")({
  head: () => ({
    meta: [
      { title: "Ink Program | Inktella" },
      {
        name: "description",
        content: "Apply to Inktella's Ink Program and earn from writing readers value.",
      },
    ],
  }),
  component: InkProgram,
});

const requirements = [
  { label: "Account is at least 3 months old", detail: "3 months", complete: true },
  { label: "Published at least 30 Notes", detail: "34 / 30", complete: true },
  { label: "Received at least 100 likes", detail: "127 / 100", complete: true },
  { label: "Backed by at least 10 people", detail: "8 / 10", complete: false },
];

function InkProgram() {
  const [status, setStatus] = useState<"eligible" | "review">("eligible");
  const complete = requirements.every((requirement) => requirement.complete);

  return (
    <AuthOnly message="The Ink Program is where notebooks get paid. First, let the notebook know your name.">
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <header className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
            Creator program
          </p>
          <h1 className="mt-3 text-4xl tracking-tight sm:text-5xl">Ink Program</h1>
          <p className="hand mt-3 text-2xl opacity-70">Let your writing earn Ink.</p>
          <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground">
            Readers receive free Ink to give to writing they value. At the end of each month,
            eligible Ink helps determine how Inktella&apos;s creator earnings pool is distributed.
          </p>
        </header>

        <section
          className="mt-12 border-y border-border/70 py-8"
          aria-labelledby="eligibility-heading"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="eligibility-heading" className="text-2xl tracking-tight">
                Your eligibility
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Reach every milestone to unlock your application.
              </p>
            </div>
            <span className="text-sm text-muted-foreground">
              {requirements.filter((item) => item.complete).length} / {requirements.length}
            </span>
          </div>
          <ul className="mt-7 divide-y divide-border/70">
            {requirements.map((requirement) => (
              <li key={requirement.label} className="flex items-center gap-3 py-4">
                {requirement.complete ? (
                  <Check className="shrink-0 text-primary" aria-hidden />
                ) : (
                  <Circle className="shrink-0 text-muted-foreground" aria-hidden />
                )}
                <span className="min-w-0 flex-1 text-sm">{requirement.label}</span>
                <span className="text-sm text-muted-foreground">{requirement.detail}</span>
              </li>
            ))}
          </ul>
          {!complete && <p className="mt-5 text-sm text-muted-foreground">2 more Backers needed</p>}
          {status === "eligible" ? (
            <div className="mt-8">
              <Button disabled={!complete} onClick={() => setStatus("review")}>
                Apply to Ink Program
              </Button>
              {!complete && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Apply is disabled until everything is complete.
                </p>
              )}
              {complete && (
                <p className="mt-3 text-sm text-muted-foreground">You&apos;re eligible to apply.</p>
              )}
            </div>
          ) : (
            <div className="mt-8 border-l-2 border-primary pl-4">
              <h3 className="font-medium">Application under review</h3>
              <p className="mt-1 text-sm text-muted-foreground">Submitted September 19, 2026</p>
            </div>
          )}
        </section>

        <section
          className="mt-10 rounded-lg border border-border/70 p-6"
          aria-labelledby="review-heading"
        >
          <div className="flex gap-4">
            <ShieldCheck className="mt-1 shrink-0 text-primary" aria-hidden />
            <div>
              <h2 id="review-heading" className="text-lg font-medium">
                Thoughtful review, human writing
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Meeting the requirements doesn&apos;t guarantee acceptance. Inktella reviews
                applications and writing for originality, manipulation or farming, spam, and rule
                violations.
              </p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Ink rewards human writing. Writing generated substantially by AI isn&apos;t eligible
                for the Ink Program. If our review finds sufficient evidence that an account&apos;s
                published writing does not meet this requirement, we may reject its application.
              </p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                If you believe we made a mistake, you can appeal the decision.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
    </AuthOnly>
  );
}
