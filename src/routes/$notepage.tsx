import { createFileRoute, notFound, Outlet, useLocation } from "@tanstack/react-router";
import { NotepageNetworkMenu } from "@/components/notepage-network-menu";
import { getNotepage, notepageAppearance, themeStyle } from "@/data/inktella";

export const Route = createFileRoute("/$notepage")({
  beforeLoad: ({ params }) => {
    if (!getNotepage(params.notepage)) throw notFound();
  },
  component: NotepageShell,
});

function NotepageShell() {
  const { notepage } = Route.useParams();
  const location = useLocation();
  const np = getNotepage(notepage);
  if (!np) return null;
  const isCover = location.pathname === `/${notepage}`;

  const appearance = notepageAppearance(np);
  const backgroundStyle = appearance.backgroundType === "image" && appearance.backgroundImage
    ? { backgroundImage: `url(${appearance.backgroundImage})` }
    : undefined;

  return (
    <div className="notepage-theme relative min-h-screen" style={themeStyle(np)}>
      <div className="notepage-background" aria-hidden="true" style={backgroundStyle} />
      <div className="notepage-background-overlay" aria-hidden="true" />
      {/* Required: the Notepage home, notes and local Notetag pages render here. */}
      <div className="relative z-10"><Outlet /></div>
      {!isCover && <NotepageNetworkMenu notepage={np} />}
    </div>
  );
}
