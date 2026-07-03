import { desc, eq } from "drizzle-orm";

import { db } from "#/db";
import { jobTracker } from "#/db/schema";

import type { JobApplicationInput } from "./job-tracker.schema";

export async function getJobApplications() {
	return db.select().from(jobTracker).orderBy(desc(jobTracker.createdAt));
}

export async function getJobApplicationById(id: string) {
	const [application] = await db
		.select()
		.from(jobTracker)
		.where(eq(jobTracker.id, id))
		.limit(1);

	return application ?? null;
}

export async function createJobApplication(data: JobApplicationInput) {
	const [application] = await db
		.insert(jobTracker)
		.values({
			name: data.name,
			company: data.company,
			location: data.location,
			role: data.role,
			cv: data.cv,
			type: data.type,
			platform: data.platform,
			workType: data.workType,
			status: data.status,
			remarks: data.remarks,
		})
		.returning();

	return application;
}

export async function updateJobApplication(
	id: string,
	data: JobApplicationInput,
) {
	const [application] = await db
		.update(jobTracker)
		.set({
			name: data.name,
			company: data.company,
			location: data.location,
			role: data.role,
			cv: data.cv,
			type: data.type,
			platform: data.platform,
			workType: data.workType,
			status: data.status,
			remarks: data.remarks,
			updatedAt: new Date(),
		})
		.where(eq(jobTracker.id, id))
		.returning();

	return application;
}

export async function deleteJobApplication(id: string) {
	const [application] = await db
		.delete(jobTracker)
		.where(eq(jobTracker.id, id))
		.returning({
			id: jobTracker.id,
		});

	return application;
}

export async function updateJobApplicationStatus(
	id: string,
	status: JobApplicationInput["status"],
) {
	const [application] = await db
		.update(jobTracker)
		.set({
			status,
			updatedAt: new Date(),
		})
		.where(eq(jobTracker.id, id))
		.returning();

	return application;
}
