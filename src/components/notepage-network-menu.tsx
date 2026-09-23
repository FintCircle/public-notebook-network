import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, Compass, Menu, PenLine, Search, Tags, X } from "lucide-react";
import type { Notepage } from "@/data/inktella";
import { themeStyle } from "@/data/inktella";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/write", label: "Note down", note: "", icon: PenLine },
  { to: "/notella", label: "Notella", note: "read around", icon: Compass },
  { to: "/topics", label: "Topics", note: "", icon: Tags },
  { to: "/notepages", label: "My Notepages", note: "", icon: BookOpen },
  { to: "/explore", label: "Find", note: "", icon: Search },
] as const;

export function NotepageNetworkMenu({ notepage }: { notepage: Notepage }) {
  const [open, setOpen] = useState(false);
  const linkClassName =
    "flex size-10 items-center justify-center rounded-full border border-current/15 bg-[var(--np-bg)] text-[var(--np-ink)] shadow-sm transition-transform hover:scale-105";

  return (
    <div
      className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-3 text-[var(--np-ink)]"
      style={themeStyle(notepage)}
    >
      {open && (
        <nav aria-label="Inktella network" className="flex flex-col items-end gap-2">
          {links.map((item) => {
            const Icon = item.icon;
            return item.to === "/write" ? (
              <Link
                key={item.to}
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
                key={item.to}
                to={item.to}
                className={linkClassName}
                aria-label={item.label}
                title={item.label}
              >
                <Icon aria-hidden />
              </Link>
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
        className="size-12 rounded-full border border-current/15 bg-[var(--np-bg)] text-[var(--np-ink)] shadow-sm transition-transform hover:scale-105 hover:bg-[var(--np-bg)]"
      >
        {open ? <X aria-hidden /> : <Menu aria-hidden />}
      </Button>
    </div>
  );
}
