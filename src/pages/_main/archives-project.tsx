import { Safari } from "#/components/ui/safari";

const projects = [
	{
		id: "crafted-portfolio-1",
		title: "Crafted Portfolio",
		description:
			"A personal space for work, notes, experiments, and the small details that shape my taste.",
		url: "yatodev.dev",
		imageSrc: "/banner.png",
	},
	{
		id: "crafted-portfolio-2",
		title: "Crafted Portfolio",
		description:
			"A personal space for work, notes, experiments, and the small details that shape my taste.",
		url: "yatodev.dev",
		imageSrc: "/banner.png",
	},
	{
		id: "crafted-portfolio-3",
		title: "Crafted Portfolio",
		description:
			"A personal space for work, notes, experiments, and the small details that shape my taste.",
		url: "yatodev.dev",
		imageSrc: "/banner.png",
	},
	{
		id: "crafted-portfolio-4",
		title: "Crafted Portfolio",
		description:
			"A personal space for work, notes, experiments, and the small details that shape my taste.",
		url: "yatodev.dev",
		imageSrc: "/banner.png",
	},
	{
		id: "crafted-portfolio-5",
		title: "Crafted Portfolio",
		description:
			"A personal space for work, notes, experiments, and the small details that shape my taste.",
		url: "yatodev.dev",
		imageSrc: "/banner.png",
	},
	{
		id: "crafted-portfolio-6",
		title: "Crafted Portfolio",
		description:
			"A personal space for work, notes, experiments, and the small details that shape my taste.",
		url: "yatodev.dev",
		imageSrc: "/banner.png",
	},
];

export const ArchivesProject = () => {
	return (
		<section>
			<h1 className="text-base font-semibold sm:text-lg">My archives so far</h1>
			<p className="text-muted-foreground py-2">
				I believe in documenting every achievement, no matter how small. To me,
				each milestone represents the hard work that has brought me to where I
				am today and, insya allah, will carry me to even greater heights.
			</p>
			<section className="py-8">
				<div className="grid gap-4 sm:grid-cols-2">
					{projects.map((project) => (
						<article
							key={project.id}
							className="group relative overflow-hidden rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-ring"
						>
							<Safari
								url={project.url}
								imageSrc={project.imageSrc}
								className="transition duration-300 group-hover:scale-[1.02] group-hover:blur-sm group-focus-within:scale-[1.02] group-focus-within:blur-sm"
							/>
							<div className="pointer-events-none absolute inset-0 flex items-end bg-linear-to-t from-background/95 via-background/50 to-transparent p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
								<div>
									<h2 className="font-semibold">{project.title}</h2>
									<p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
										{project.description}
									</p>
								</div>
							</div>
						</article>
					))}
				</div>
			</section>
		</section>
	);
};
