import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "#/db";
import { experiences, projects } from "#/db/schema";

export async function getPublicArchivesData() {
	const [publicProjects, workExperiences] = await Promise.all([
		db
			.select({
				id: projects.id,
				name: projects.name,
				description: projects.description,
				thumbnail: projects.thumbnail,
				techStack: projects.techStack,
				demoLink: projects.demoLink,
				repoLink: projects.repoLink,
			})
			.from(projects)
			.where(and(eq(projects.isActive, true), eq(projects.isSecret, false)))
			.orderBy(asc(projects.order), desc(projects.createdAt)),
		db
			.select({
				id: experiences.id,
				companyName: experiences.companyName,
				role: experiences.role,
				companyLogo: experiences.companyLogo,
				startDate: experiences.startDate,
				endDate: experiences.endDate,
				isCurrent: experiences.isCurrent,
				typeJob: experiences.typeJob,
				location: experiences.location,
			})
			.from(experiences)
			.orderBy(
				asc(experiences.order),
				desc(experiences.startDate),
				desc(experiences.createdAt),
			),
	]);

	return {
		projects: publicProjects,
		experiences: workExperiences,
	};
}

export type PublicArchivesData = Awaited<
	ReturnType<typeof getPublicArchivesData>
>;
