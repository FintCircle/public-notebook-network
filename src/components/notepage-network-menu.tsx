import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "@tanstack/react-router";
import { BookOpen, Compass, Hash, PenLine, Search, X } from "lucide-react";
import type { Notepage } from "@/data/inktella";
import { themeStyle } from "@/data/inktella";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/write", label: "Note down", note: "", icon: PenLine },
  { to: "/notella", label: "Notella", note: "read around", icon: Compass },
  { to: "/notetags", label: "Notetags", note: "", icon: Hash },
  { to: "/notepages", label: "My Notepages", note: "", icon: BookOpen },
  { to: "/explore", label: "Find", note: "", icon: Search },
] as const;

export function NotepageNetworkMenu({ notepage }: { notepage: Notepage }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          variant="ghost"
          aria-label="Open Inktella network menu"
          className="fixed bottom-4 right-4 z-30 h-9 border border-current/15 bg-[var(--np-bg)] px-3 font-heading text-xs text-[var(--np-ink)] shadow-sm hover:bg-[var(--np-bg)] hover:opacity-100"
        >
          inktella ↗
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-foreground/25 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out data-[state=open]:fade-in motion-reduce:animate-none" />
        <Dialog.Content
          className="notepage-theme fixed inset-x-0 bottom-0 z-50 rounded-t-[8px] border-x border-t border-current/15 bg-[var(--np-bg)] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 text-[var(--np-ink)] shadow-2xl outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom motion-reduce:animate-none sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-72 sm:rounded-[8px] sm:border"
          style={themeStyle(notepage)}
        >
          <Dialog.Title className="font-heading text-lg font-medium">inktella</Dialog.Title>
          <Dialog.Description className="sr-only">
            Leave this Notepage and move around the Inktella network.
          </Dialog.Description>
          <Dialog.Close asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 text-current hover:bg-current/10" aria-label="Close network menu">
              <X aria-hidden />
            </Button>
          </Dialog.Close>
          <nav className="mt-7 space-y-1" aria-label="Inktella network">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <Dialog.Close asChild key={item.to}>
                  <Link to={item.to} search={item.to === "/write" ? {} : undefined} className="flex min-h-12 items-center gap-3 border-t border-current/10 py-3 first:border-0">
                    <Icon aria-hidden className="size-4 shrink-0 opacity-60" />
                    <span>
                      <span className="block text-sm">{item.label}</span>
                      {item.note && <span className="block text-xs opacity-50">{item.note}</span>}
                    </span>
                  </Link>
                </Dialog.Close>
              );
            })}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}