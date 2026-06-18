import ExperiencesAdmin from "#/pages/_platform/experiences";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(platform)/admin/experiences")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ExperiencesAdmin />;
}
