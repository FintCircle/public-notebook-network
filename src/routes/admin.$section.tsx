import { createFileRoute } from "@tanstack/react-router";
import { AdminSection } from "./admin";

export const Route = createFileRoute("/admin/$section")({
  component: () => <AdminSection section={Route.useParams().section} />,
});
