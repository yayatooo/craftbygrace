import { and, desc, eq } from "drizzle-orm";

import { db } from "#/db";
import { projects } from "#/db/schema";
import { getPublicProfile } from "#/features/settings/settings.services";

export async function getPublicHomeData() {
	const [profile, currentProjects] = await Promise.all([
		getPublicProfile(),
		db
			.select({
				id: projects.id,
				name: projects.name,
				thumbnail: projects.thumbnail,
				demoLink: projects.demoLink,
			})
			.from(projects)
			.where(
				and(
					eq(projects.isCurrent, true),
					eq(projects.isActive, true),
					eq(projects.isSecret, false),
				),
			)
			.orderBy(desc(projects.updatedAt))
			.limit(1),
	]);

	return {
		profile,
		currentProject: currentProjects[0] ?? null,
	};
}

export type PublicHomeData = Awaited<ReturnType<typeof getPublicHomeData>>;
