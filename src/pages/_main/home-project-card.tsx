import { Button } from "#/components/ui/button";
import { SafariDemo } from "./components/safari-window";

export const ProjectCard = () => {
	return (
		<section id="projects" className="scroll-mt-8 py-8 flex flex-col gap-4">
			<h1 className="text-lg font-semibold">Latest Project</h1>
			<SafariDemo />
			<div className="flex">
				<Button variant="outline" className="w-full text-accent">
					View All Projects
				</Button>
			</div>
		</section>
	);
};
