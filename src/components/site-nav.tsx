import { Link } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  Compass,
  Menu,
  MessageCircle,
  Newspaper,
  PenLine,
  Search,
  Users,
} from "lucide-react";

const items = [
  { to: "/notella", label: "Notella", icon: Newspaper },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/write", label: "Note down", icon: PenLine },
  { to: "/notepages", label: "My Notepages", icon: BookOpen },
];

const iconLinkClass =
  "inline-flex size-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground";

const utilityLinkClass =
  "inline-flex size-10 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-accent";

export function SiteNav() {
  return (
    <header className="border-b border-border/70 bg-background">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between px-5 py-3">
          <Link to="/" className="font-heading text-2xl font-semibold tracking-tight text-primary">
            Inktella
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/explore" className={utilityLinkClass} aria-label="Search" title="Search">
              <Search aria-hidden />
            </Link>
            <button type="button" className={utilityLinkClass} aria-label="Menu" title="Menu">
              <Menu aria-hidden />
            </button>
          </div>
        </div>
        <nav
          className="grid grid-cols-6 border-t border-border/60 px-2"
          aria-label="Primary navigation"
        >
          {[
            ...items,
            { to: "/explore", label: "Messages", icon: MessageCircle },
            { to: "/notepages", label: "People", icon: Users },
          ].map((item, index) => {
            const Icon = item.icon;
            const href = item.to === "/write" ? "/write" : item.to;
            return (
              <Link
                key={`${item.label}-${index}`}
                to={href}
                {...(item.to === "/write" ? { search: { notepage: undefined } } : {})}
                activeProps={{ className: "text-primary" }}
                className={iconLinkClass}
                aria-label={item.label}
                title={item.label}
              >
                <Icon aria-hidden />
                <span className="sr-only">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
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
