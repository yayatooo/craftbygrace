import { createServerFn } from "@tanstack/react-start";

import { requireOwnerMiddleware } from "#/features/auth/auth.middleware";

import {
	createJobApplicationSchema,
	jobApplicationIdSchema,
	updateJobApplicationSchema,
	updateJobApplicationStatusSchema,
} from "./job-tracker.schema";
import {
	createJobApplication,
	deleteJobApplication,
	getJobApplications,
	updateJobApplication,
	updateJobApplicationStatus,
} from "./job-tracker.services";

export const getJobApplicationsFn = createServerFn({
	method: "GET",
})
	.middleware([requireOwnerMiddleware])
	.handler(async () => {
		return getJobApplications();
	});

export const createJobApplicationFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(createJobApplicationSchema)
	.handler(async ({ data }) => {
		return createJobApplication(data);
	});

export const updateJobApplicationFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(updateJobApplicationSchema)
	.handler(async ({ data }) => {
		return updateJobApplication(data.id, data.data);
	});

export const deleteJobApplicationFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(jobApplicationIdSchema)
	.handler(async ({ data }) => {
		return deleteJobApplication(data.id);
	});

export const updateJobApplicationStatusFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(updateJobApplicationStatusSchema)
	.handler(async ({ data }) => {
		return updateJobApplicationStatus(data.id, data.status);
	});
