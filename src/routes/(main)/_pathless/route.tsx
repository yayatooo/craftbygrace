import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DockNav } from "#/pages/_main/components/dock-nav";

export const Route = createFileRoute("/(main)/_pathless")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="bg-background">
			<div id="about" className="min-h-svh scroll-mt-8">
				<main className="container mx-auto max-w-xl px-4 py-12 pb-28">
					<Outlet />
					<DockNav />
				</main>
			</div>
		</div>
	);
}
