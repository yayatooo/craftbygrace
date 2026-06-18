import MoviesAdmin from "#/pages/_platform/movies";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(platform)/admin/movies")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MoviesAdmin />;
}
