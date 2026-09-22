import { createFileRoute, notFound, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useRef } from "react";
import { NotepageNetworkMenu } from "@/components/notepage-network-menu";
import { getNotepage, notepages, themeStyle } from "@/data/inktella";

export const Route = createFileRoute("/$notepage")({
  beforeLoad: ({ params }) => {
    if (!getNotepage(params.notepage)) throw notFound();
  },
  component: NotepageShell,
});

function NotepageShell() {
  const { notepage } = Route.useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const touchStartX = useRef<number | null>(null);
  const np = getNotepage(notepage);
  if (!np) return null;
  const isCover = location.pathname === `/${notepage}`;

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    if (isCover) touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (!isCover || touchStartX.current === null) return;
    const distance = event.changedTouches[0]?.clientX - touchStartX.current;
    touchStartX.current = null;
    if (distance > 70) {
      const choices = notepages.filter((page) => page.slug !== notepage);
      const next = choices[Math.floor(Math.random() * choices.length)];
      if (next) navigate({ to: "/$notepage", params: { notepage: next.slug } });
    }
  }

  return (
    <div className={`notepage-theme relative min-h-screen ${isCover ? "notepage-cover-page" : "notepage-content-page"}`} style={themeStyle(np)} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Required: the Notepage home, notes and local Notetag pages render here. */}
      <div className="relative z-10"><Outlet /></div>
      {!isCover && <NotepageNetworkMenu notepage={np} />}
    </div>
  );
}
