import { z } from "zod";

import {
	jobTypeEnum,
	platformEnum,
	trackerTypeEnum,
	workTypeEnum,
} from "#/db/schema";

const defaultJobApplicationStatus =
	"screening" satisfies (typeof trackerTypeEnum.enumValues)[number];

const optionalUrl = z
	.union([
		z.string().trim().url("Must be a valid URL"),
		z.literal(""),
		z.null(),
	])
	.optional()
	.transform((value) => (value === "" || value === null ? null : value));

const optionalRemarks = z
	.union([z.string().trim(), z.null()])
	.optional()
	.transform((value) => {
		if (value === undefined || value === null || value === "") {
			return null;
		}

		return value;
	});

const jobApplicationStatusSchema = z.enum(trackerTypeEnum.enumValues);

export const jobApplicationInputSchema = z.object({
	name: z.string().trim().min(1, "Name is required").max(160),
	company: z.string().trim().min(1, "Company is required").max(160),
	location: z.string().trim().min(1, "Location is required").max(160),
	role: z.string().trim().min(1, "Role is required").max(160),
	cv: optionalUrl.default(null),
	type: z.enum(jobTypeEnum.enumValues),
	platform: z.enum(platformEnum.enumValues),
	workType: z.enum(workTypeEnum.enumValues),
	status: jobApplicationStatusSchema.default(defaultJobApplicationStatus),
	remarks: optionalRemarks.default(null),
});

export const createJobApplicationSchema = jobApplicationInputSchema;

export const updateJobApplicationSchema = z.object({
	id: z.string().uuid(),
	data: jobApplicationInputSchema,
});

export const jobApplicationIdSchema = z.object({
	id: z.string().uuid(),
});

export const updateJobApplicationStatusSchema = z.object({
	id: z.string().uuid(),
	status: jobApplicationStatusSchema,
});

export type JobApplicationInput = z.infer<typeof jobApplicationInputSchema>;
