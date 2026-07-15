import { and, asc, desc, eq, ne } from "drizzle-orm";

import { db } from "#/db";
import { skills } from "#/db/schema";

import type { CreateSkillInput, UpdateSkillInput } from "./skills.schema";

export async function getSkills() {
	return db
		.select({
			id: skills.id,
			name: skills.name,
			slug: skills.slug,
			icon: skills.icon,
			isActive: skills.isActive,
			order: skills.order,
			createdAt: skills.createdAt,
			updatedAt: skills.updatedAt,
		})
		.from(skills)
		.orderBy(asc(skills.order), desc(skills.createdAt));
}

export async function getSkillBySlugExcludingId(slug: string, id?: string) {
	const where = id
		? and(eq(skills.slug, slug), ne(skills.id, id))
		: eq(skills.slug, slug);

	const [skill] = await db
		.select({
			id: skills.id,
		})
		.from(skills)
		.where(where)
		.limit(1);

	return skill ?? null;
}

export async function createSkill(data: CreateSkillInput) {
	const [skill] = await db
		.insert(skills)
		.values({
			id: data.id,
			name: data.name,
			slug: data.slug,
			icon: data.icon,
			iconKey: data.iconKey,
			isActive: data.isActive,
			order: data.order,
		})
		.returning();

	return skill;
}

export async function updateSkill(id: string, data: UpdateSkillInput) {
	return db.transaction(async (tx) => {
		const [currentSkill] = await tx
			.select({
				iconKey: skills.iconKey,
			})
			.from(skills)
			.where(eq(skills.id, id))
			.limit(1);

		if (!currentSkill) {
			throw new Error("Skill not found.");
		}

		const values = {
			name: data.name,
			slug: data.slug,
			isActive: data.isActive,
			order: data.order,
			updatedAt: new Date(),
			...(data.icon ? { icon: data.icon } : {}),
			...(data.iconKey ? { iconKey: data.iconKey } : {}),
		};

		const [skill] = await tx
			.update(skills)
			.set(values)
			.where(eq(skills.id, id))
			.returning();

		return {
			skill,
			previousIconKey: currentSkill.iconKey,
		};
	});
}

export async function deleteSkill(id: string) {
	const [skill] = await db.delete(skills).where(eq(skills.id, id)).returning({
		id: skills.id,
		iconKey: skills.iconKey,
	});

	return skill;
}

export async function setSkillActive(id: string, isActive: boolean) {
	const [skill] = await db
		.update(skills)
		.set({
			isActive,
			updatedAt: new Date(),
		})
		.where(eq(skills.id, id))
		.returning();

	return skill;
}
