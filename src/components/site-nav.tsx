import { Link } from "@tanstack/react-router";

const items = [
  { to: "/notella", label: "Notella" },
  { to: "/explore", label: "Explore" },
  { to: "/write", label: "Note down" },
  { to: "/notepages", label: "My Notepages" },
] as const;

export function SiteNav() {
  return (
    <header className="border-b border-border/70">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-5 gap-y-2 px-5 py-4 text-sm">
        <Link to="/" className="font-heading text-base tracking-tight">
          Inktella
        </Link>
        <span aria-hidden className="opacity-30">
          ·
        </span>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-muted-foreground">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              search={item.to === "/write" ? {} : undefined}
              activeProps={{ className: "text-foreground" }}
              className="hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-3 gap-y-2 px-5 py-16 text-sm text-muted-foreground">
      <span className="hand text-base">the public notebook network</span>
      <span aria-hidden className="opacity-40">·</span>
      <span>$10 / year / Notepage</span>
      <span aria-hidden className="opacity-40">·</span>
      <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
      <Link to="/terms" className="hover:text-foreground">Terms</Link>
      <Link to="/guidelines" className="hover:text-foreground">Guidelines</Link>
    </footer>
  );
}
