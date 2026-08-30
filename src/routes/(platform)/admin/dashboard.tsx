import { createFileRoute } from "@tanstack/react-router";
import DashboardAdmin from "#/pages/_platform/dashboard";

export const Route = createFileRoute("/(platform)/admin/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return <DashboardAdmin />;
}
