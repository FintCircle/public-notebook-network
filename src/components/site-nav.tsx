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
            item.to === "/write" ? (
              <Link key={item.to} to="/write" search={{ notepage: undefined }} activeProps={{ className: "text-foreground" }} className="hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <Link key={item.to} to={item.to} activeProps={{ className: "text-foreground" }} className="hover:text-foreground">
                {item.label}
              </Link>
            )
          ))}
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-5 py-12 text-sm text-muted-foreground sm:flex-row sm:items-end sm:justify-between sm:gap-10 sm:py-14">
        <div className="flex flex-col gap-2">
          <Link to="/" className="hand text-lg text-foreground hover:opacity-70">
            the public notebook network
          </Link>
          <span>$10 / year / Notepage</span>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-3 sm:justify-end">
          <Link to="/about" className="hover:text-foreground">About</Link>
          <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/guidelines" className="hover:text-foreground">Guidelines</Link>
        </nav>
      </div>
    </footer>
  );
}
