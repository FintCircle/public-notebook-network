import * as Dialog from "@radix-ui/react-dialog";
import { ExternalLink, X } from "lucide-react";
import type { Notepage } from "@/data/inktella";
import { themeStyle } from "@/data/inktella";
import { Button } from "@/components/ui/button";

function UgandaStamp() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute -right-5 top-12 h-64 w-auto opacity-[0.065] sm:-right-3 sm:top-9 sm:h-72"
      viewBox="0 0 180 220"
    >
      <title>Uganda boundary silhouette sourced from GeoJSON geographic data</title>
      <path
        d="M76.08 170.35 41.52 169.94 30.47 173.73 11.63 183.46 4 180.25 4.26 156.48 11.57 144.44 13.34 119.13 19.97 104.48 32.02 88.04 44.13 79.67 54.27 68.48 41.63 64.21 43.54 27.35 56.52 18.75 76.56 25.8 101.94 18.42 124.12 18.5 143.5 4 158.45 25.89 162.13 41.7 176 77.89 164.53 100.87 149.02 121.73 139.99 134.5 140.31 167.91 76.08 170.35Z"
        fill="currentColor"
      />
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
          <UgandaStamp />
          <div className="relative z-10 mx-auto mb-5 h-1 w-10 rounded-full bg-current/20 sm:hidden" />
          <Dialog.Close asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close About"
              className="absolute right-4 top-4 z-20 text-current hover:bg-current/10 hover:text-current"
            >
              <X aria-hidden />
            </Button>
          </Dialog.Close>

          <div className="relative z-10">
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
              <div>
                <p className="text-lg font-medium">{notepage.owner}</p>
                <p className="mt-1 text-sm opacity-55">
                  noting down from {notepage.countryCode}
                </p>
              </div>
            </div>

            <p id="about-biography" className="mt-7 text-[1.02rem] leading-relaxed">
              {notepage.ownerBio}
            </p>
          </div>

          <section className="relative z-10 mt-9" aria-labelledby="interests-heading">
            <h2 id="interests-heading" className="text-sm opacity-55">
              interests
            </h2>
            <p className="mt-2 leading-relaxed">{notepage.interests.join(" · ")}</p>
          </section>

          <section className="relative z-10 mt-8" aria-labelledby="elsewhere-heading">
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

          <p aria-hidden className="hand relative z-10 mt-10 text-center text-xl opacity-45">
            ~ ✎ ~
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}