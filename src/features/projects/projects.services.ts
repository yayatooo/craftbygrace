import { asc, desc, eq, ne } from "drizzle-orm";

import { getDb } from "#/db";
import { projects } from "#/db/schema";

import type { ProjectInput } from "./projects.schema";

export async function getProjects() {
	const db = getDb();

	return db
		.select()
		.from(projects)
		.orderBy(asc(projects.order), desc(projects.createdAt));
}

export async function createProject(data: ProjectInput) {
	const db = getDb();

	const values = {
		thumbnail: data.thumbnail,
		name: data.name,
		slug: data.slug,
		description: data.description,
		techStack: data.techStack,
		isCurrent: data.isCurrent,
		isSecret: data.isSecret,
		isActive: data.isActive,
		demoLink: data.demoLink,
		repoLink: data.repoLink,
		order: data.order,
	};

	if (!data.isCurrent) {
		const [project] = await db.insert(projects).values(values).returning();

		return project;
	}

	return db.transaction(async (tx) => {
		await tx.update(projects).set({
			isCurrent: false,
			updatedAt: new Date(),
		});

		const [project] = await tx.insert(projects).values(values).returning();

		return project;
	});
}

export async function updateProject(id: string, data: ProjectInput) {
	const db = getDb();

	const values = {
		thumbnail: data.thumbnail,
		name: data.name,
		slug: data.slug,
		description: data.description,
		techStack: data.techStack,
		isCurrent: data.isCurrent,
		isSecret: data.isSecret,
		isActive: data.isActive,
		demoLink: data.demoLink,
		repoLink: data.repoLink,
		order: data.order,
		updatedAt: new Date(),
	};

	if (!data.isCurrent) {
		const [project] = await db
			.update(projects)
			.set(values)
			.where(eq(projects.id, id))
			.returning();

		return project;
	}

	return db.transaction(async (tx) => {
		await tx
			.update(projects)
			.set({
				isCurrent: false,
				updatedAt: new Date(),
			})
			.where(ne(projects.id, id));

		const [project] = await tx
			.update(projects)
			.set(values)
			.where(eq(projects.id, id))
			.returning();

		return project;
	});
}

export async function deleteProject(id: string) {
	const db = getDb();

	const [project] = await db
		.delete(projects)
		.where(eq(projects.id, id))
		.returning({
			id: projects.id,
		});

	return project;
}

export async function setProjectActive(id: string, isActive: boolean) {
	const db = getDb();

	const [project] = await db
		.update(projects)
		.set({
			isActive,
			updatedAt: new Date(),
		})
		.where(eq(projects.id, id))
		.returning();

	return project;
}
