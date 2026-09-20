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

  return (
    <div className="notepage-theme min-h-screen" style={themeStyle(np)}>
      {/* Required: the Notepage home, notes and local Notetag pages render here. */}
      <Outlet />
      {!isCover && <NotepageNetworkMenu notepage={np} />}
    </div>
  );
}
