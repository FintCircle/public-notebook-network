import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Compass, Menu, PenLine, Search, Tags, X } from "lucide-react";
import type { Notepage } from "@/data/inktella";
import { themeStyle } from "@/data/inktella";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/write", label: "Note down", note: "write something", icon: PenLine },
  { to: "/notella", label: "Notella", note: "read around", icon: Compass },
  { to: "/topics", label: "Topics", note: "browse themes", icon: Tags },
  { to: "/notifications", label: "Notifications", note: "see what happened", icon: Bell },
  { to: "/explore", label: "Find", note: "discover people", icon: Search },
] as const;

export function NotepageNetworkMenu({
  notepage,
  side = "right",
}: {
  notepage: Notepage;
  side?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [accent, setAccent] = useState(notepage.theme.accent ?? "#c2410c");

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? window.localStorage.getItem(`notepage-accent:${notepage.slug}`)
        : null;
    setAccent(saved || notepage.theme.accent || "#c2410c");
  }, [notepage.slug, notepage.theme.accent]);

  const linkClassName =
    "flex size-10 items-center justify-center rounded-full border border-transparent bg-[var(--np-accent)] text-white shadow-md transition-transform hover:scale-105 hover:bg-[var(--np-accent)]/90";

  return (
    <div
      className={`fixed bottom-5 z-30 flex flex-col gap-3 text-[var(--np-ink)] ${side === "left" ? "left-5 items-start" : "right-5 items-end"}`}
      style={
        {
          ...themeStyle(notepage),
          "--np-accent": accent,
        } as React.CSSProperties
      }
    >
      {open && (
        <nav
          aria-label="Inktella network"
          className={`flex flex-col gap-2 ${side === "left" ? "items-start" : "items-end"}`}
        >
          {links.map((item) => {
            const Icon = item.icon;
            const link =
              item.to === "/write" ? (
                <Link
                  to="/write"
                  search={{ notepage: undefined }}
                  className={linkClassName}
                  aria-label={item.label}
                  title={item.label}
                >
                  <Icon aria-hidden />
                </Link>
              ) : (
                <Link
                  to={item.to}
                  className={linkClassName}
                  aria-label={item.label}
                  title={item.label}
                >
                  <Icon aria-hidden />
                </Link>
              );

            return (
              <div
                key={item.to}
                className={`flex items-center gap-2 ${side === "left" ? "flex-row-reverse" : ""}`}
              >
                <span className="hand rounded-full bg-[var(--np-accent)] px-2.5 py-0.5 text-base leading-none text-white shadow-md backdrop-blur-sm">
                  {item.note}
                </span>
                {link}
              </div>
            );
          })}
        </nav>
      )}
      <Button
        variant="ghost"
        size="icon"
        aria-label={open ? "Close Inktella network menu" : "Open Inktella network menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="size-12 rounded-full border border-transparent bg-[var(--np-accent)] text-white shadow-md transition-transform hover:scale-105 hover:bg-[var(--np-accent)]/90"
      >
        {open ? <X aria-hidden /> : <Menu aria-hidden />}
      </Button>
    </div>
  );
}
