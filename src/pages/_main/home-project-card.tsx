import { Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import type { PublicHomeData } from "#/features/home/home.services";
import { SafariDemo } from "./components/safari-window";

export const ProjectCard = ({
	project,
}: {
	project: PublicHomeData["currentProject"];
}) => {
	return (
		<section id="projects" className="flex scroll-mt-8 flex-col gap-4 py-8">
			<h1 className="text-lg font-semibold">Latest Project</h1>
			{project?.thumbnail ? (
				<div className="space-y-2">
					{project.demoLink ? (
						<a
							href={project.demoLink}
							target="_blank"
							rel="noreferrer"
							aria-label={`Open ${project.name}`}
							className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							<SafariDemo
								imageSrc={project.thumbnail}
								demoLink={project.demoLink}
							/>
						</a>
					) : (
						<SafariDemo imageSrc={project.thumbnail} demoLink={null} />
					)}
					{/*<p className="text-sm font-medium">{project.name}</p>*/}
				</div>
			) : (
				<div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
					No current public project has been selected yet.
				</div>
			)}
			<div className="flex">
				<Button asChild variant="outline" className="w-full text-accent">
					<Link to="/archives">View All Projects</Link>
				</Button>
			</div>
		</section>
	);
};
