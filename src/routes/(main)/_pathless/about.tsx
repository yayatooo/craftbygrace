import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "#/pages/_main/about-section";
import { CardProfile } from "#/pages/_main/components/card-profile";
import { MotionReveal } from "#/pages/_main/components/motion-reveal";

export const Route = createFileRoute("/(main)/_pathless/about")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<main>
				<MotionReveal>
					<CardProfile />
				</MotionReveal>
				<MotionReveal>
					<AboutSection />
				</MotionReveal>
			</main>
		</div>
	);
}
