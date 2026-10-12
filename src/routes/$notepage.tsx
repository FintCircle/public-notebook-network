import {
  createFileRoute,
  notFound,
  Outlet,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { NotepageNetworkMenu } from "@/components/notepage-network-menu";
import { getNotepage, notepages, themeStyle } from "@/data/inktella";

export const Route = createFileRoute("/$notepage")({
  component: NotepageShell,
});

function NotepageShell() {
  const { notepage } = Route.useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const touchStartX = useRef<number | null>(null);
  const np = getNotepage(notepage);
  const [accent, setAccent] = useState(np?.theme.accent ?? "#c2410c");
  const [coverBackground, setCoverBackground] = useState<"ruled" | "white" | "custom">("white");
  const [customCover, setCustomCover] = useState("");

  const [focalDesktop, setFocalDesktop] = useState(np?.appearance?.backgroundPosition ?? "50% 35%");
  const [focalMobile, setFocalMobile] = useState(
    np?.appearance?.mobileBackgroundPosition ?? np?.appearance?.backgroundPosition ?? "50% 35%",
  );
  const [textColor, setTextColor] = useState<"light" | "dark" | "auto">(
    np?.appearance?.textColor ?? "auto",
  );
  const [overlayOpacity, setOverlayOpacity] = useState<number>(
    np?.appearance?.overlayOpacity ?? 0.45,
  );

  useEffect(() => {
    const saved = window.localStorage.getItem(`notepage-accent:${notepage}`);
    setAccent(saved || np?.theme.accent || "#c2410c");

    const savedBackground = window.localStorage.getItem(`notepage-background:${notepage}`) as
      "ruled" | "white" | "custom" | null;
    setCoverBackground(savedBackground || "white");

    const savedCustom = window.localStorage.getItem(`notepage-custom-background:${notepage}`);
    setCustomCover(savedCustom || "");

    const savedFocalDesk = window.localStorage.getItem(`notepage-focal-desktop:${notepage}`);
    setFocalDesktop(savedFocalDesk || np?.appearance?.backgroundPosition || "50% 35%");

    const savedFocalMob = window.localStorage.getItem(`notepage-focal-mobile:${notepage}`);
    setFocalMobile(
      savedFocalMob ||
        np?.appearance?.mobileBackgroundPosition ||
        np?.appearance?.backgroundPosition ||
        "50% 35%",
    );

    const savedTextColor = window.localStorage.getItem(`notepage-text-color:${notepage}`) as
      "light" | "dark" | "auto" | null;
    setTextColor(savedTextColor || np?.appearance?.textColor || "auto");

    const savedOverlayOpacity = window.localStorage.getItem(
      `notepage-overlay-opacity:${notepage}`,
    );
    setOverlayOpacity(
      savedOverlayOpacity ? parseFloat(savedOverlayOpacity) : np?.appearance?.overlayOpacity ?? 0.45,
    );
  }, [notepage, np]);

  if (!np)
    return (
      <div className="flex min-h-screen items-center justify-center px-5 text-center">
        <div>
          <p className="hand text-3xl opacity-60">nothing written here</p>
          <p className="mt-3 text-sm opacity-70">This Notepage doesn&apos;t exist yet.</p>
          <a href="/" className="mt-5 inline-block text-sm underline underline-offset-4">
            Back to Inktella
          </a>
        </div>
      </div>
    );
  const isCover = location.pathname === `/${notepage}`;

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    if (isCover) touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (!isCover || touchStartX.current === null) return;
    const distance = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;
    if (distance > 70) {
      const choices = notepages.filter((page) => page.slug !== notepage);
      const next = choices[Math.floor(Math.random() * choices.length)];
      if (next) navigate({ to: "/$notepage", params: { notepage: next.slug } });
    }
  }

  return (
    <div
      className={`notepage-theme relative min-h-screen ${isCover ? "notepage-cover-page" : "notepage-content-page"}`}
      style={
        {
          ...themeStyle({
            ...np,
            theme: {
              ...np.theme,
              accent: accent,
            },
            appearance: {
              ...np.appearance,
              backgroundPosition: focalDesktop,
              mobileBackgroundPosition: focalMobile,
              textColor: textColor,
              overlayOpacity: overlayOpacity,
            },
          }),
          "--np-accent": accent,
          "--np-cover-background-image":
            coverBackground === "custom" && customCover ? `url(${customCover})` : "none",
        } as React.CSSProperties
      }
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Required: the Notepage home, notes and local Notetag pages render here. */}
      <div className="relative z-10">
        <Outlet />
      </div>
      <NotepageNetworkMenu
        notepage={np}
        side={location.pathname.includes("/notepage/") ? "left" : "right"}
      />
    </div>
  );
}
