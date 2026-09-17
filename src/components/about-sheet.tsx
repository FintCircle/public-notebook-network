import * as Dialog from "@radix-ui/react-dialog";
import { ExternalLink, X } from "lucide-react";
import type { Notepage } from "@/data/inktella";
import { themeStyle } from "@/data/inktella";
import { Button } from "@/components/ui/button";

function UgandaStamp() {
  return (
    <svg
      aria-label="Silhouette of Uganda"
      className="h-28 w-auto"
      viewBox="0 0 138 178"
      role="img"
    >
      <path
        d="M42 5 69 13l12-6 10 8 13-2 9 13 17 8-5 20 8 10-8 18 6 15-16 11-4 19-13 8-5 22-17 26-14-8-5-19-17-13-4-25-12-14 7-16-7-18 11-13-2-18 18-8 8-18Z"
        fill="currentColor"
      />
      <path d="m89 28 9 4-5 11-7-6Z" fill="var(--np-bg, var(--paper))" opacity=".9" />
    </svg>
  );
}

export function AboutSheet({ notepage }: { notepage: Notepage }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          variant="ghost"
          className="hand h-auto px-0 py-1 text-xl font-normal opacity-70 shadow-none hover:bg-transparent hover:opacity-100"
        >
          About
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-foreground/35 backdrop-blur-[1px] data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out data-[state=open]:fade-in motion-reduce:animate-none" />
        <Dialog.Content
          aria-describedby="about-biography"
          className="notepage-theme fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-y-auto rounded-t-[8px] border-x border-t border-current/15 bg-[var(--np-bg)] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-5 text-[var(--np-ink)] shadow-2xl outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom motion-reduce:animate-none sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[88vh] sm:w-[min(32rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[8px] sm:border"
          style={themeStyle(notepage)}
        >
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-current/20 sm:hidden" />
          <Dialog.Close asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close About"
              className="absolute right-4 top-4 text-current hover:bg-current/10 hover:text-current"
            >
              <X aria-hidden />
            </Button>
          </Dialog.Close>

          <Dialog.Title className="hand text-2xl font-normal">about</Dialog.Title>
          <div aria-hidden className="hand -mt-1 text-xl opacity-45">
            ~~~~~
          </div>

          <div className="mt-8 flex items-center gap-4">
            <img
              src={notepage.portrait}
              alt={`${notepage.owner} portrait`}
              width={816}
              height={816}
              className="size-20 shrink-0 rounded-[4px] object-cover grayscale-[18%]"
            />
            <p className="text-lg font-medium">{notepage.owner}</p>
          </div>

          <p id="about-biography" className="mt-7 text-[1.02rem] leading-relaxed">
            {notepage.ownerBio}
          </p>

          <section className="mt-9" aria-labelledby="country-heading">
            <h2 id="country-heading" className="text-sm opacity-55">
              noting down from
            </h2>
            <div className="mt-4 flex flex-col items-center text-center">
              <UgandaStamp />
              <p className="mt-2 text-sm">{notepage.country}</p>
            </div>
          </section>

          <section className="mt-9" aria-labelledby="interests-heading">
            <h2 id="interests-heading" className="text-sm opacity-55">
              interests
            </h2>
            <p className="mt-2 leading-relaxed">{notepage.interests.join(" · ")}</p>
          </section>

          <section className="mt-8" aria-labelledby="elsewhere-heading">
            <h2 id="elsewhere-heading" className="text-sm opacity-55">
              elsewhere
            </h2>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
              {notepage.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 underline decoration-current/30 underline-offset-4 hover:decoration-current"
                >
                  {link.label}
                  <ExternalLink aria-hidden className="size-3.5" />
                </a>
              ))}
            </div>
          </section>

          <p aria-hidden className="hand mt-10 text-center text-xl opacity-45">
            ~ ✎ ~
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}