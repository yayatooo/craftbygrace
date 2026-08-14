import { Building2 } from "lucide-react";

import type { PublicArchivesData } from "#/features/archives/archives.services";

const jobTypeLabels: Record<
	PublicArchivesData["experiences"][number]["typeJob"],
	string
> = {
	full_time: "Full-time",
	part_time: "Part-time",
	freelance: "Freelance",
	contract: "Contract",
	internship: "Internship",
	self_employed: "Self-employed",
};

const monthYearFormatter = new Intl.DateTimeFormat("en", {
	month: "short",
	year: "numeric",
	timeZone: "UTC",
});

function formatDate(value: Date) {
	return monthYearFormatter.format(new Date(value));
}

export function ArchivesPath({
	experiences,
}: {
	experiences: PublicArchivesData["experiences"];
}) {
	return (
		<section className="flex flex-col gap-2 py-8">
			<h1 className="text-base font-semibold sm:text-lg">Path</h1>
			<p className="text-muted-foreground">
				From the agility of freelance endeavors to the structure of full-time
				roles, my career has been a continuous journey of growth. In every
				chapter, I embrace the lessons that empower me to not just adapt, but
				truly thrive in an ever-evolving industry.
			</p>
			{experiences.length > 0 ? (
				<div className="mt-6 grid gap-4">
					{experiences.map((experience) => (
						<article
							key={experience.id}
							className="rounded-lg border border-border bg-secondary p-4"
						>
							<div className="flex flex-col gap-4 sm:flex-row sm:items-start">
								<div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background p-2">
									{experience.companyLogo ? (
										<img
											src={experience.companyLogo}
											alt={`${experience.companyName} logo`}
											className="h-full w-full object-contain"
											loading="lazy"
											decoding="async"
										/>
									) : (
										<Building2
											className="size-6 text-muted-foreground"
											aria-hidden="true"
										/>
									)}
								</div>
								<div className="min-w-0 flex-1">
									<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
										<div>
											<h2 className="font-semibold">
												{experience.companyName}
											</h2>
											<p className="text-sm">{experience.role}</p>
											<p className="mt-1 text-sm text-muted-foreground">
												{[
													experience.location,
													jobTypeLabels[experience.typeJob],
												]
													.filter(Boolean)
													.join(" · ")}
											</p>
										</div>
										<p className="shrink-0 text-sm text-muted-foreground">
											{formatDate(experience.startDate)} –{" "}
											{experience.isCurrent || !experience.endDate
												? "Present"
												: formatDate(experience.endDate)}
										</p>
									</div>
								</div>
							</div>
						</article>
					))}
				</div>
			) : (
				<div className="mt-6 rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
					No work experience has been added yet.
				</div>
			)}
		</section>
	);
}
