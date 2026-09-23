import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  BadgeDollarSign,
  Bell,
  Compass,
  Newspaper,
  Tags,
  PenLine,
  Shuffle,
  Settings2,
  UserRound,
  SlidersHorizontal,
  X,
} from "lucide-react";
import derrickPortrait from "@/assets/derrick-portrait.jpg";
import { useAuth } from "@/lib/auth";
import { useRandomizer } from "@/lib/randomizer";

const items = [
  { to: "/notella", label: "Notella", icon: Newspaper },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/write", label: "Note down", icon: PenLine },
  { to: "/notifications", label: "Notifications", icon: Bell },
];

const iconLinkClass =
  "inline-flex size-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground";

const utilityLinkClass =
  "inline-flex size-10 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-accent";

export function SiteNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, signOut } = useAuth();
  const { randomize } = useRandomizer();
  const navigate = useNavigate();

  return (
    <>
      <header className="border-b border-border/70 bg-background">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between px-5 py-3">
            <Link
              to={isAuthenticated ? "/notella" : "/"}
              className="font-heading text-2xl font-semibold tracking-tight text-primary"
            >
              Inktella
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={utilityLinkClass}
                aria-label="Open a random note"
                title="Surprise me with a random note"
                onClick={randomize}
              >
                <Shuffle aria-hidden />
              </button>
              {isAuthenticated ? (
                <button
                  type="button"
                  className="size-10 overflow-hidden rounded-full ring-1 ring-border transition-transform hover:scale-105"
                  aria-label="Open your profile menu"
                  title="Profile menu"
                  onClick={() => setIsMenuOpen(true)}
                >
                  <img
                    src={derrickPortrait}
                    alt="Derrick's profile"
                    className="size-full object-cover"
                  />
                </button>
              ) : (
                <Link
                  to="/sign-in"
                  className="inline-flex items-center gap-2 rounded-full border border-primary px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  <UserRound aria-hidden className="size-4" />
                  Join
                </Link>
              )}
            </div>
          </div>
          <nav
            className="grid grid-cols-6 border-t border-border/60 px-2"
            aria-label="Primary navigation"
          >
            {[
              ...items,
              { to: "/topics", label: "Topics", icon: Tags },
              { to: "/ink-program", label: "Ink Program", icon: BadgeDollarSign },
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

      {isAuthenticated && isMenuOpen && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Profile menu"
        >
          <button
            type="button"
            className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
            aria-label="Close profile menu"
            onClick={() => setIsMenuOpen(false)}
          />
          <aside className="absolute right-0 top-0 flex h-full w-[min(22rem,calc(100%-2rem))] flex-col border-l border-border bg-background p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="hand text-xl">your corner of Inktella</span>
              <button
                type="button"
                className={iconLinkClass}
                aria-label="Close profile menu"
                onClick={() => setIsMenuOpen(false)}
              >
                <X aria-hidden />
              </button>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <img
                src={derrickPortrait}
                alt="Derrick's profile"
                className="size-14 rounded-full object-cover ring-1 ring-border"
              />
              <div>
                <p className="font-medium">{isAuthenticated ? "Derrick" : "Just browsing"}</p>
                <p className="text-sm text-muted-foreground">{isAuthenticated ? "Signed in" : "Not signed in"}</p>
              </div>
            </div>
            <nav className="mt-8 flex flex-col gap-2" aria-label="Profile settings">
              <Link
                to="/topics"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors hover:bg-muted"
              >
                <SlidersHorizontal aria-hidden className="size-4" /> Manage topics
              </Link>
              <Link
                to="/notepages"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors hover:bg-muted"
              >
                <Settings2 aria-hidden className="size-4" /> Manage Notepages
              </Link>
            </nav>
            <button
              type="button"
              className="mt-auto border-t border-border pt-5 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => { if (isAuthenticated) { signOut(); navigate({ to: "/signed-out" }); } else { navigate({ to: "/sign-in" }); } setIsMenuOpen(false); }}
            >
              {isAuthenticated ? "Sign out" : "Join / Sign in"}
            </button>
          </aside>
        </div>
      )}
    </>
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
