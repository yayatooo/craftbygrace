import { createFileRoute } from "@tanstack/react-router";
import Connect from "#/pages/_main/components/connect";
import { Banner } from "#/pages/_main/home-banner";
import { ProjectCard } from "#/pages/_main/home-project-card";
import TimelineWorkflow from "#/pages/_main/home-timeline-workflow";
import { TrustedBy } from "#/pages/_main/home-trusted-by";

export const Route = createFileRoute("/(main)/_pathless/")({ component: Home });

function Home() {
	return (
		<div>
			<main>
				<Banner />
				<ProjectCard />
				<TrustedBy />
				<TimelineWorkflow />
				<Connect />
			</main>
		</div>
	);
}
