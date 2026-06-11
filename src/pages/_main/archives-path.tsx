const workExperiences = [
	{
		id: "markas-mobil",
		company: "Evindo Global Putra",
		role: "Full stack Engineer",
		location: "Indonesia",
		workType: "Full Time",
		duration: "Oct 2024 - Present",
		logoSrc: "/partners/markas-mobil.png",
		technologies: [
			"React",
			"TypeScript",
			"Odoo",
			"Python",
			"Docker",
			"Postgres",
		],
	},
	{
		id: "MerkleInnovation",
		company: "Merkle Inovation Technologies",
		role: "Full stack Developer",
		location: "Indonesia",
		workType: "Freelance",
		duration: "Sep 2023 - Oct 2024",
		logoSrc: "/partners/shudaxia-logo.png",
		technologies: ["Mendix", "React", "Tailwind CSS", "Java"],
	},
	{
		id: "Eduwork",
		company: "Eduwork",
		role: "Full stack Developer",
		location: "Indonesia",
		workType: "Intern",
		duration: "Jun 2024 - Dec 2024",
		logoSrc: "/partners/shudaxia-logo.png",
		technologies: ["Typescript", "React", "MongoDB", "Express"],
	},
	{
		id: "bmkg",
		company: "BMKG Mutiara Palu",
		role: "Full stack Developer",
		location: "Indonesia",
		workType: "Intern",
		duration: "Sep 2020 - Dec 2020",
		logoSrc: "/partners/shudaxia-logo.png",
		technologies: ["PHP", "Codeigther", "Mysql", "Bootsrap"],
	},
];

export const ArchivesPath = () => {
	return (
		<section className="flex flex-col gap-2 py-8">
			<h1 className="text-base font-semibold sm:text-lg">Path</h1>
			<p className="text-muted-foreground">
				From the agility of freelance endeavors to the structure of full-time
				roles, my career has been a continuous journey of growth. In every
				chapter, I embrace the lessons that empower me to not just adapt, but
				truly thrive in an ever-evolving industry.
			</p>
			<div className="mt-6 grid gap-4">
				{workExperiences.map((experience) => (
					<article
						key={experience.id}
						className="rounded-lg border border-border bg-secondary p-4"
					>
						<div className="flex flex-col gap-4 sm:flex-row sm:items-start">
							<div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background p-2">
								<img
									src={experience.logoSrc}
									alt={`${experience.company} logo`}
									className="h-full w-full object-contain"
								/>
							</div>
							<div className="min-w-0 flex-1">
								<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
									<div>
										<h2 className="font-semibold">{experience.company}</h2>
										<p className="text-sm">{experience.role}</p>
										<p className="mt-1 text-muted-foreground text-sm">
											{experience.location} · {experience.workType}
										</p>
									</div>
									<p className="shrink-0 text-muted-foreground text-sm">
										{experience.duration}
									</p>
								</div>
								<div className="mt-4 flex flex-wrap gap-2">
									{experience.technologies.map((technology) => (
										<span
											key={technology}
											className="rounded-full border border-border bg-background px-3 py-1 text-muted-foreground text-xs"
										>
											{technology}
										</span>
									))}
								</div>
							</div>
						</div>
					</article>
				))}
			</div>
		</section>
	);
};
