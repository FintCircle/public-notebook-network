import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  CircleHelp,
  FileText,
  Flag,
  FolderOpen,
  Hash,
  Image,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Tags,
  Upload,
  Users,
} from "lucide-react";
import type { ComponentType } from "react";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

type AdminItem = { label: string; path: string; icon: ComponentType<{ className?: string }> };

const adminItems: AdminItem[] = [
  { label: "Overview", path: "/admin", icon: LayoutDashboard },
  { label: "Notepages", path: "/admin/notepages", icon: BookOpen },
  { label: "Notes", path: "/admin/notes", icon: FileText },
  { label: "Questions", path: "/admin/questions", icon: CircleHelp },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Reports", path: "/admin/reports", icon: Flag },
  { label: "Topics", path: "/admin/topics", icon: Hash },
  { label: "Tags", path: "/admin/tags", icon: Tags },
  { label: "Uploads", path: "/admin/uploads", icon: Upload },
];

const stats = [
  ["Notepages", "248", "+12 this month", BookOpen],
  ["Notes", "8,492", "+184 this week", FileText],
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
    description: "Review and manage every public notebook.",
    icon: BookOpen,
    rows: [
      ["Derrick's Notes", "Derrick Mbabazi", "Published"],
      ["Small Experiments", "Maya Okafor", "Published"],
      ["Field Notes", "Jon Bell", "Needs review"],
    ],
  },
  notes: {
    title: "Notes",
    description: "Moderate notes across the network.",
    icon: FileText,
    rows: [
      ["I keep rebuilding things", "Derrick's Notes", "Published"],
      ["A useful kind of unfinished", "Small Experiments", "Published"],
      ["The first draft is a door", "Field Notes", "Flagged"],
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
    description: "Keep the public notebook thoughtful and safe.",
    icon: Flag,
    rows: [
      ["A quiet place to begin", "Harassment · 2 reports", "Open"],
      ["Anonymous image upload", "Copyright · 1 report", "Open"],
      ["Comment on field notes", "Spam · resolved", "Resolved"],
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
  const config = adminSections[section] ?? adminSections.notes;
  const Icon = config.icon;
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
          className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          {section === "questions"
            ? "Schedule question"
            : `Add ${config.title.replace("User ", "")}`}
        </button>
      </div>
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
      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="hidden grid-cols-[1fr_1fr_9rem_2rem] gap-4 border-b border-border bg-muted/40 px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground sm:grid">
          <span>Item</span>
          <span>Owner / detail</span>
          <span>Status</span>
          <span />
        </div>
        {config.rows.map(([name, detail, status]) => (
          <div
            key={name}
            className="grid gap-3 border-b border-border px-5 py-4 last:border-0 sm:grid-cols-[1fr_1fr_9rem_2rem] sm:items-center sm:gap-4"
          >
            <div className="font-medium">{name}</div>
            <div className="text-sm text-muted-foreground">{detail}</div>
            <div>
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs ${status === "Open" || status === "Pending" || status === "Flagged" || status === "Needs review" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}
              >
                {status}
              </span>
            </div>
            <ChevronRight className="hidden size-4 text-muted-foreground sm:block" aria-hidden />
          </div>
        ))}
      </div>
    </div>
  );
}
