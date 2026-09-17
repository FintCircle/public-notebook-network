import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
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
    </div>
  );
}
