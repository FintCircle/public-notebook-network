import { createFileRoute, notFound, Outlet, useLocation } from "@tanstack/react-router";
import { NotepageNetworkMenu } from "@/components/notepage-network-menu";
import { getNotepage, themeStyle } from "@/data/inktella";

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

  const backgroundStyle = np.appearance.backgroundType === "image" && np.appearance.backgroundImage
    ? { backgroundImage: `url(${np.appearance.backgroundImage})` }
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
