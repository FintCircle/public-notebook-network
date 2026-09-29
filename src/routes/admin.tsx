import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ExternalLink,
  Flag,
  FolderOpen,
  Hash,
  Image,
  LayoutDashboard,
  Plus,
  Search,
  Trash2,
  ShieldCheck,
  Tags,
  Upload,
  Users,
} from "lucide-react";
import { useState } from "react";
import type { ComponentType } from "react";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

type AdminItem = { label: string; path: string; icon: ComponentType<{ className?: string }> };

const adminItems: AdminItem[] = [
  { label: "Overview", path: "/admin", icon: LayoutDashboard },
  { label: "Notepages", path: "/admin/notepages", icon: BookOpen },
  { label: "Questions", path: "/admin/questions", icon: CircleHelp },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Reports", path: "/admin/reports", icon: Flag },
  { label: "Topics", path: "/admin/topics", icon: Hash },
  { label: "Tags", path: "/admin/tags", icon: Tags },
  { label: "Uploads", path: "/admin/uploads", icon: Upload },
];

const stats = [
  ["Notepages", "248", "+12 this month", BookOpen],
  ["People", "3,106", "+47 this week", Users],
  ["Open reports", "14", "Needs attention", Flag],
] as const;

function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-background lg:flex lg:flex-col">
        <div className="border-b border-border px-6 py-5">
          <Link to="/" className="font-heading text-2xl font-semibold text-primary">
            Inktella
          </Link>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Admin area
          </p>
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label="Admin navigation">
          {adminItems.map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              activeProps={{ className: "bg-primary/10 text-primary" }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" /> Admin session
          </div>
          <Link to="/" className="mt-3 block hover:text-foreground">
            Back to Inktella
          </Link>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Control center
              </p>
              <h1 className="font-heading text-xl">Good morning, Derrick</h1>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              <Search className="size-4" aria-hidden />
              <span className="hidden sm:inline">Search anything</span>
              <kbd className="hidden rounded bg-background px-1.5 py-0.5 text-[10px] sm:inline">
                ⌘K
              </kbd>
            </div>
          </div>
          <nav
            className="flex gap-1 overflow-x-auto border-t border-border px-3 py-2 lg:hidden"
            aria-label="Admin sections"
          >
            {adminItems.map(({ label, path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className="flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted"
              >
                <Icon className="size-3.5" aria-hidden />
                {label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AdminOverview() {
  return (
    <div className="space-y-8">
      <div>
        <p className="hand text-lg text-muted-foreground">the whole notebook, at a glance</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">Overview</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, detail, Icon]) => (
          <div key={label} className="rounded-xl border border-border bg-background p-5">
            <Icon className="size-5 text-primary" aria-hidden />
            <p className="mt-5 text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-3xl font-semibold">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <section className="rounded-xl border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h3 className="font-semibold">Needs your attention</h3>
              <p className="mt-1 text-sm text-muted-foreground">The queue for today</p>
            </div>
            <Flag className="size-5 text-primary" aria-hidden />
          </div>
          {[
            "Report on ‘A quiet place to begin’",
            "New Notepage awaiting review",
            "Upload flagged for moderation",
          ].map((item, index) => (
            <Link
              key={item}
              to={index === 0 ? "/admin/reports" : "/admin/notepages"}
              className="flex items-center justify-between border-b border-border px-5 py-4 text-sm last:border-0 hover:bg-muted/50"
            >
              <span>{item}</span>
              <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
            </Link>
          ))}
        </section>
        <section className="rounded-xl border border-border bg-background">
          <div className="border-b border-border p-5">
            <h3 className="font-semibold">Quick actions</h3>
            <p className="mt-1 text-sm text-muted-foreground">Common publishing tasks</p>
          </div>
          <div className="grid grid-cols-2 gap-2 p-4">
            {[
              ["Schedule question", "/admin/questions", CircleHelp],
              ["Review reports", "/admin/reports", Flag],
              ["Manage uploads", "/admin/uploads", Image],
              ["Browse users", "/admin/users", Users],
            ].map(([label, path, Icon]) => (
              <Link
                key={String(label)}
                to={String(path)}
                className="rounded-lg border border-border p-3 text-sm hover:bg-muted"
              >
                <Icon className="mb-5 size-4 text-primary" aria-hidden />
                {String(label)}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export const adminSections: Record<
  string,
  {
    title: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    rows: [string, string, string][];
  }
> = {
  notepages: {
    title: "Notepages",
    description: "Manage public notebooks and the notes inside each one.",
    icon: BookOpen,
    rows: [
      ["Derrick's Notes", "Derrick Mbabazi · 24 notes", "Published"],
      ["Small Experiments", "Maya Okafor · 18 notes", "Published"],
      ["Field Notes", "Jon Bell · 9 notes", "Published"],
    ],
  },
  questions: {
    title: "Questions",
    description: "Publish today's prompt and schedule what comes next.",
    icon: CircleHelp,
    rows: [
      ["What are you making room for?", "Today · Live", "Published"],
      ["What did you change your mind about?", "Tomorrow · Scheduled", "Scheduled"],
      ["What is worth doing slowly?", "Oct 1 · Scheduled", "Scheduled"],
    ],
  },
  users: {
    title: "Users",
    description: "Manage accounts, access, and participation.",
    icon: Users,
    rows: [
      ["Derrick Mbabazi", "derrick@inktella.com", "Active"],
      ["Maya Okafor", "maya@inktella.com", "Active"],
      ["Jon Bell", "jon@inktella.com", "Review"],
    ],
  },
  reports: {
    title: "Reports",
    description: "Review reports made on answers and comments from Questions.",
    icon: Flag,
    rows: [
      ["Maya Okafor's answer", "Harassment · 2 reports · hidden", "Open"],
      ["Jon Bell's answer", "Spam · 1 report · hidden", "Open"],
      ["Derrick Mbabazi's comment", "Off-topic · resolved", "Resolved"],
    ],
  },
  topics: {
    title: "Topics",
    description: "Curate the subjects people gather around.",
    icon: Hash,
    rows: [
      ["Building in public", "842 notes", "Featured"],
      ["Personal growth", "531 notes", "Active"],
      ["Photography", "298 notes", "Active"],
    ],
  },
  tags: {
    title: "User tags",
    description: "Review tags created by the community.",
    icon: Tags,
    rows: [
      ["#slow-work", "Created by Derrick", "Approved"],
      ["#tiny-habits", "Created by Maya", "Pending"],
      ["#street-notes", "Created by Jon", "Approved"],
    ],
  },
  uploads: {
    title: "Uploads",
    description: "Review images and files added to Inktella.",
    icon: Upload,
    rows: [
      ["derrick-portrait.jpg", "Derrick Mbabazi · 2.4 MB", "Approved"],
      ["field-notes-cover.png", "Jon Bell · 1.1 MB", "Pending"],
      ["street-study.jpg", "Maya Okafor · 4.8 MB", "Approved"],
    ],
  },
};

export function AdminSection({ section }: { section: string }) {
  const config = adminSections[section] ?? adminSections.notepages;
  const Icon = config.icon;
  const [expandedNotepage, setExpandedNotepage] = useState<string | null>(null);
  const [questionItems, setQuestionItems] = useState([
    {
      id: 1,
      title: "What are you making room for?",
      detail: "Today · Live",
      status: "Published",
      suggestedBy: null as string | null,
      suggestedByHref: null as string | null,
    },
    {
      id: 2,
      title: "What did you change your mind about?",
      detail: "Tomorrow · Scheduled",
      status: "Scheduled",
    },
    {
      id: 3,
      title: "What is worth doing slowly?",
      detail: "Oct 1 · Scheduled",
      status: "Scheduled",
    },
  ]);
  const [suggestions, setSuggestions] = useState([
    {
      id: 4,
      title: "What are you learning to leave unfinished?",
      author: "Maya Chen",
      detail: "Suggested Sep 28",
      status: "Pending",
    },
    {
      id: 5,
      title: "What do you return to when you need clarity?",
      author: "Jon Bell",
      detail: "Suggested Sep 27",
      status: "Pending",
    },
  ]);
  const [questionDraft, setQuestionDraft] = useState("");
  const [questionDate, setQuestionDate] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <Icon className="size-5" aria-hidden />
            <span className="text-xs uppercase tracking-[0.18em]">Admin / {config.title}</span>
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">{config.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{config.description}</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          <Plus className="size-4" aria-hidden />
          {section === "questions"
            ? "Schedule question"
            : section === "notepages"
              ? "Add Notepage"
              : `Add ${config.title.replace("User ", "")}`}
        </button>
      </div>
      {section === "questions" ? (
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-background p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold">Add or schedule a question</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Write the shared prompt, then publish it now or choose its day.
                </p>
              </div>
              <CircleHelp className="size-5 text-primary" aria-hidden />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_12rem_auto]">
              <input
                value={questionDraft}
                onChange={(event) => setQuestionDraft(event.target.value)}
                placeholder="What would you like everyone to consider?"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                type="date"
                value={questionDate}
                onChange={(event) => setQuestionDate(event.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                aria-label="Publish date"
              />
              <button
                type="button"
                onClick={() => {
                  if (!questionDraft.trim()) return;
                  setQuestionItems((items) => [
                    {
                      id: Date.now(),
                      title: questionDraft.trim(),
                      detail: questionDate || "Today · Live",
                      status: questionDate ? "Scheduled" : "Published",
                    },
                    ...items,
                  ]);
                  setQuestionDraft("");
                  setQuestionDate("");
                }}
                className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
              >
                Add question
              </button>
            </div>
          </section>
          <section className="rounded-xl border border-border bg-background">
            <div className="border-b border-border p-5">
              <h3 className="font-semibold">Published and scheduled</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage the questions that appear on the public page.
              </p>
            </div>
            {questionItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 last:border-0"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                  {item.suggestedBy && item.suggestedByHref && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Suggested by{" "}
                      <a
                        href={item.suggestedByHref}
                        className="font-medium text-foreground underline-offset-2 hover:underline"
                      >
                        {item.suggestedBy}
                      </a>
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-800">
                    {item.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                    className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setQuestionItems((items) =>
                        items.filter((question) => question.id !== item.id),
                      )
                    }
                    className="rounded-md p-1 text-destructive hover:bg-destructive/10"
                    aria-label={`Remove ${item.title}`}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>
                {editingId === item.id && (
                  <div className="basis-full border-t border-border pt-3">
                    <input
                      defaultValue={item.title}
                      onBlur={(event) =>
                        setQuestionItems((items) =>
                          items.map((question) =>
                            question.id === item.id
                              ? { ...question, title: event.target.value }
                              : question,
                          ),
                        )
                      }
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                      aria-label="Edit question"
                    />
                  </div>
                )}
              </div>
            ))}
          </section>
          <section className="rounded-xl border border-border bg-background">
            <div className="border-b border-border p-5">
              <h3 className="font-semibold">User suggestions</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Review, edit, publish, schedule, or remove questions suggested from the public
                Questions page.
              </p>
            </div>
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 last:border-0"
              >
                <div>
                  <p className="font-medium">{suggestion.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {suggestion.author} · {suggestion.detail}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setQuestionItems((items) => [
                        {
                          id: suggestion.id,
                          title: suggestion.title,
                          detail: "Today · Live",
                          status: "Published",
                          suggestedBy: suggestion.author,
                          suggestedByHref: `/profile/${suggestion.author.toLowerCase().replaceAll(" ", "-")}`,
                        },
                        ...items,
                      ]);
                      setSuggestions((items) => items.filter((item) => item.id !== suggestion.id));
                    }}
                    className="rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground"
                  >
                    Publish
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQuestionItems((items) => [
                        {
                          id: suggestion.id,
                          title: suggestion.title,
                          detail: "Upcoming · Scheduled",
                          status: "Scheduled",
                          suggestedBy: suggestion.author,
                          suggestedByHref: `/profile/${suggestion.author.toLowerCase().replaceAll(" ", "-")}`,
                        },
                        ...items,
                      ]);
                      setSuggestions((items) => items.filter((item) => item.id !== suggestion.id));
                    }}
                    className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
                  >
                    Schedule
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSuggestions((items) => items.filter((item) => item.id !== suggestion.id))
                    }
                    className="rounded-md p-1 text-destructive hover:bg-destructive/10"
                    aria-label={`Remove suggestion ${suggestion.title}`}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      ) : null}
      {section !== "questions" && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            All
          </button>
          <button
            type="button"
            className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground"
          >
            Needs review
          </button>
          <button
            type="button"
            className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground"
          >
            Recently updated
          </button>
        </div>
      )}
      {section !== "questions" && (
        <div className="overflow-hidden rounded-xl border border-border bg-background">
          <div className="hidden grid-cols-[1fr_1fr_9rem_2rem] gap-4 border-b border-border bg-muted/40 px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground sm:grid">
            <span>Item</span>
            <span>Owner / detail</span>
            <span>Status</span>
            <span />
          </div>
          {config.rows.map(([name, detail, status]) => (
            <div key={name} className="border-b border-border last:border-0">
              <div className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-center sm:gap-4">
                <div className="font-medium">{name}</div>
                <div className="text-sm text-muted-foreground">{detail}</div>
                <span
                  className={`inline-flex w-fit rounded-full px-2 py-1 text-xs ${status === "Open" || status === "Pending" || status === "Flagged" || status === "Needs review" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}
                >
                  {status}
                </span>
                {section === "notepages" ? (
                  <div className="flex flex-wrap gap-1 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setExpandedNotepage(expandedNotepage === name ? null : name)}
                      className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
                    >
                      <ChevronDown
                        className={`size-3 transition-transform ${expandedNotepage === name ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                      Notes
                    </button>
                    <Link
                      to={name === "Derrick's Notes" ? "/derrick" : "/"}
                      target="_blank"
                      className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
                    >
                      <ExternalLink className="size-3" aria-hidden />
                      View
                    </Link>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-3" aria-hidden />
                      Delete
                    </button>
                  </div>
                ) : section === "reports" ? (
                  <div className="flex gap-1 sm:justify-end">
                    <button
                      type="button"
                      className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
                    >
                      Review
                    </button>
                    <button
                      type="button"
                      className="rounded-md px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="mr-1 inline size-3" aria-hidden />
                      Remove
                    </button>
                  </div>
                ) : (
                  <ChevronRight
                    className="hidden size-4 text-muted-foreground sm:block"
                    aria-hidden
                  />
                )}
              </div>
              {section === "notepages" && expandedNotepage === name && (
                <div className="border-t border-border bg-muted/30 px-5 py-3">
                  <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                    Notes in {name}
                  </p>
                  {[
                    "I keep rebuilding things",
                    "Something I noticed today",
                    "Why I'm simplifying Pangisa",
                  ].map((note) => (
                    <div
                      key={note}
                      className="flex items-center justify-between gap-3 border-t border-border/70 py-2 text-sm"
                    >
                      <span>{note}</span>
                      <button
                        type="button"
                        className="inline-flex shrink-0 items-center gap-1 text-xs text-destructive hover:underline"
                      >
                        <Trash2 className="size-3" aria-hidden />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
