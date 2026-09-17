import { Link } from "@tanstack/react-router";

const items = [
  { to: "/notella", label: "Notella" },
  { to: "/explore", label: "Explore" },
  { to: "/write", label: "Note down" },
  { to: "/profile", label: "Profile" },
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
    <footer className="mx-auto max-w-5xl px-5 py-16 text-sm text-muted-foreground">
      <span className="hand text-base">the public notebook network</span>
      <span className="px-2 opacity-40">·</span>
      $10 / year / Notepage
    </footer>
  );
}
