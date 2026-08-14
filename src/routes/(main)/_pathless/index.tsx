import { createFileRoute } from "@tanstack/react-router";
import Connect from "#/pages/_main/components/connect";
import { MotionReveal } from "#/pages/_main/components/motion-reveal";
import { Banner } from "#/pages/_main/home-banner";
import { ProjectCard } from "#/pages/_main/home-project-card";
import TimelineWorkflow from "#/pages/_main/home-timeline-workflow";
import { TrustedBy } from "#/pages/_main/home-trusted-by";

export const Route = createFileRoute("/(main)/_pathless/")({ component: Home });

function Home() {
	return (
		<div>
			<main>
				<MotionReveal>
					<Banner />
				</MotionReveal>
				<MotionReveal delay={0.04}>
					<ProjectCard />
				</MotionReveal>
				<MotionReveal delay={0.04}>
					<TrustedBy />
				</MotionReveal>
				<MotionReveal delay={0.04}>
					<TimelineWorkflow />
				</MotionReveal>
				<MotionReveal delay={0.04}>
					<Connect />
				</MotionReveal>
			</main>
		</div>
	);
}
