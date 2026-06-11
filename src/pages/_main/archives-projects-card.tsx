import { Safari } from "#/components/ui/safari";

const projects = [
	{
		title: "Crafted Portfolio",
		description:
			"A personal space for work, notes, experiments, and the small details that shape my taste.",
		url: "yatodev.dev",
		imageSrc: "/banner.png",
	},
	{
		title: "Crafted Portfolio",
		description:
			"A personal space for work, notes, experiments, and the small details that shape my taste.",
		url: "yatodev.dev",
		imageSrc: "/banner.png",
	},
];

export const ArchivesProjectCard = () => {
	return (
		<section className="flex flex-col gap-4 py-8">
			<div className="grid gap-4">
				{projects.map((project) => (
					<article
						key={project.title}
						className="relative min-h-80 overflow-hidden rounded-xl border border-border bg-secondary p-5"
					>
						<div className="relative z-10 max-w-[72%]">
							<h2 className="font-semibold">{project.title}</h2>
							<p className="mt-1 text-sm text-muted-foreground">
								{project.description}
							</p>
						</div>
						<div className="pointer-events-none absolute inset-x-5 -bottom-3 z-0 translate-y-8 sm:-bottom-24 sm:translate-y-14">
							<Safari
								url={project.url}
								imageSrc={project.imageSrc}
								className="drop-shadow-2xl"
							/>
						</div>
					</article>
				))}
			</div>
		</section>
	);
};
