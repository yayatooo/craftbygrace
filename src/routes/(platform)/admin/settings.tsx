import SettingsAdmin from "#/pages/_platform/settings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(platform)/admin/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SettingsAdmin />;
}
