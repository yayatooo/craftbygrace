import { asc, desc, eq } from "drizzle-orm";

import { db } from "#/db";
import { experiences } from "#/db/schema";

import type { ExperienceInput } from "./experiences.schema";

export async function getExperiences() {
	return db
		.select()
		.from(experiences)
		.orderBy(
			asc(experiences.order),
			desc(experiences.startDate),
			desc(experiences.createdAt),
		);
}

export async function createExperience(data: ExperienceInput) {
	const [experience] = await db
		.insert(experiences)
		.values({
			companyName: data.companyName,
			role: data.role,
			companyLogo: data.companyLogo,
			startDate: data.startDate,
			endDate: data.endDate,
			isCurrent: data.isCurrent,
			typeJob: data.typeJob,
			location: data.location,
			order: data.order,
		})
		.returning();

	return experience;
}

export async function updateExperience(id: string, data: ExperienceInput) {
	const [experience] = await db
		.update(experiences)
		.set({
			companyName: data.companyName,
			role: data.role,
			companyLogo: data.companyLogo,
			startDate: data.startDate,
			endDate: data.endDate,
			isCurrent: data.isCurrent,
			typeJob: data.typeJob,
			location: data.location,
			order: data.order,
			updatedAt: new Date(),
		})
		.where(eq(experiences.id, id))
		.returning();

	return experience;
}

export async function deleteExperience(id: string) {
	const [experience] = await db
		.delete(experiences)
		.where(eq(experiences.id, id))
		.returning({
			id: experiences.id,
		});

	return experience;
}

export async function setExperienceCurrent(id: string, isCurrent: boolean) {
	const [experience] = await db
		.update(experiences)
		.set({
			isCurrent,
			updatedAt: new Date(),
		})
		.where(eq(experiences.id, id))
		.returning();

	return experience;
}
