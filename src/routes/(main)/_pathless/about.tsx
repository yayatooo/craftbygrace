import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "#/pages/_main/about-section";
import { CardProfile } from "#/pages/_main/components/card-profile";

export const Route = createFileRoute("/(main)/_pathless/about")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<main>
				<CardProfile />
				<AboutSection />
			</main>
		</div>
	);
}
