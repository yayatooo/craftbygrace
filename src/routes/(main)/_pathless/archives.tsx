import { createFileRoute } from "@tanstack/react-router";
import { ArchivesPath } from "#/pages/_main/archives-path";
// import { ArchivesProfileSkills } from "#/pages/_main/archives-profile-skills";
import { ArchivesProject } from "#/pages/_main/archives-project";
import { MotionReveal } from "#/pages/_main/components/motion-reveal";

export const Route = createFileRoute("/(main)/_pathless/archives")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div id="archives">
			<main>
				{/* <ArchivesProfileSkills /> */}
				<MotionReveal>
					<ArchivesProject />
				</MotionReveal>
				<MotionReveal delay={0.05}>
					<ArchivesPath />
				</MotionReveal>
			</main>
		</div>
	);
}
