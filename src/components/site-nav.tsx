import { Link } from "@tanstack/react-router";
import { BookOpen, Compass, Newspaper, PenLine } from "lucide-react";

const items = [
  { to: "/notella", label: "Notella", icon: Newspaper },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/write", label: "Note down", icon: PenLine },
  { to: "/notepages", label: "My Notepages", icon: BookOpen },
];

const iconLinkClass =
  "inline-flex size-9 items-center justify-center rounded-md hover:bg-accent hover:text-foreground";

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
        <div
          className="flex flex-wrap items-center gap-1 text-muted-foreground"
          aria-label="Primary navigation"
        >
          {items.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <Icon aria-hidden />
                <span className="sr-only">{item.label}</span>
              </>
            );

            return item.to === "/write" ? (
              <Link
                key={item.to}
                to="/write"
                search={{ notepage: undefined }}
                activeProps={{ className: "text-foreground" }}
                className={iconLinkClass}
                aria-label={item.label}
                title={item.label}
              >
                {content}
              </Link>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "text-foreground" }}
                className={iconLinkClass}
                aria-label={item.label}
                title={item.label}
              >
                {content}
              </Link>
            );
          })}
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
          <Link to="/about" className="hover:text-foreground">
            About
          </Link>
          <Link to="/pricing" className="hover:text-foreground">
            Pricing
          </Link>
          <Link to="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-foreground">
            Terms
          </Link>
          <Link to="/guidelines" className="hover:text-foreground">
            Guidelines
          </Link>
        </nav>
      </div>
    </footer>
  );
}
