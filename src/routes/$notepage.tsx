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
  const [coverBackground, setCoverBackground] = useState<"ruled" | "white" | "custom">("ruled");
  const [customCover, setCustomCover] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(`notepage-accent:${notepage}`);
    if (saved) setAccent(saved);
    const savedBackground = window.localStorage.getItem(`notepage-background:${notepage}`) as
      "ruled" | "white" | "custom" | null;
    const savedCustom = window.localStorage.getItem(`notepage-custom-background:${notepage}`);
    if (savedBackground) setCoverBackground(savedBackground);
    if (savedCustom) setCustomCover(savedCustom);
  }, [notepage]);
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
          ...themeStyle(np),
          "--np-accent": accent,
          "--np-cover-background-image":
            coverBackground === "custom" && customCover
              ? `url(${customCover})`
              : coverBackground === "white"
                ? "none"
                : undefined,
        } as React.CSSProperties
      }
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Required: the Notepage home, notes and local Notetag pages render here. */}
      <div className="relative z-10">
        <Outlet />
      </div>
      {!isCover && (
        <NotepageNetworkMenu
          notepage={np}
          side={location.pathname.includes("/notepage/") ? "left" : "right"}
        />
      )}
    </div>
  );
}
