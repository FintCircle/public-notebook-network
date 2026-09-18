import { createFileRoute, Link, notFound, Outlet } from "@tanstack/react-router";
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
  const np = getNotepage(notepage);
  if (!np) return null;

  return (
    <div className="notepage-theme min-h-screen" style={themeStyle(np)}>
      {/* Required: the Notepage home, notes and local Notetag pages render here. */}
      <Outlet />
      <p className="mx-auto max-w-2xl px-5 pb-20 pt-6 text-xs opacity-45">
        <Link to="/" className="hover:underline">
          part of inktella ↗
        </Link>
      </p>
      <NotepageNetworkMenu notepage={np} />
    </div>
  );
}
