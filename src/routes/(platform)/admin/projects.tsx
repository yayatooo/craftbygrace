import ProjectsAdmin from "#/pages/_platform/projects";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(platform)/admin/projects")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProjectsAdmin />;
}
