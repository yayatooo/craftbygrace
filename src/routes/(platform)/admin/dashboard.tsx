import DashboardAdmin from "#/pages/_platform/dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(platform)/admin/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return <DashboardAdmin />;
}
