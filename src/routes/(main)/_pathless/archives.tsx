import { createFileRoute } from "@tanstack/react-router";
import { ArchivesPath } from "#/pages/_main/archives-path";
// import { ArchivesProfileSkills } from "#/pages/_main/archives-profile-skills";
import { ArchivesProject } from "#/pages/_main/archives-project";

export const Route = createFileRoute("/(main)/_pathless/archives")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div id="archives">
			<main>
				{/* <ArchivesProfileSkills /> */}
				<ArchivesProject />
				<ArchivesPath />
			</main>
		</div>
	);
}
