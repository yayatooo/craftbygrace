import SongsAdmin from "#/pages/_platform/songs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(platform)/admin/songs")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SongsAdmin />;
}
