import { z } from "zod";

const jobTypeValues = [
	"full_time",
	"part_time",
	"freelance",
	"contract",
	"internship",
	"self_employed",
] as const;

const optionalUrl = z
	.union([
		z.string().trim().url("Must be a valid URL"),
		z.literal(""),
		z.null(),
	])
	.optional()
	.default(null)
	.transform((value) => (value === "" || value === null ? null : value));

const optionalText = z
	.union([z.string().trim().max(160), z.literal(""), z.null()])
	.optional()
	.default(null)
	.transform((value) => (value === "" || value === null ? null : value));

function parseDateInput(value: string) {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

	if (!match) return null;

	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	const date = new Date(Date.UTC(year, month - 1, day));

	if (
		date.getUTCFullYear() !== year ||
		date.getUTCMonth() !== month - 1 ||
		date.getUTCDate() !== day
	) {
		return null;
	}

	return date;
}

const requiredDate = z
	.string({ error: "Start date is required" })
	.trim()
	.min(1, "Start date is required")
	.transform((value, ctx) => {
		const date = parseDateInput(value);

		if (!date) {
			ctx.addIssue({
				code: "custom",
				message: "Must be a valid date",
			});

			return z.NEVER;
		}

		return date;
	});

const optionalDate = z
	.union([z.string().trim(), z.null()])
	.optional()
	.default(null)
	.transform((value, ctx) => {
		if (value === "" || value === null) return null;

		const date = parseDateInput(value);

		if (!date) {
			ctx.addIssue({
				code: "custom",
				message: "Must be a valid date",
			});

			return z.NEVER;
		}

		return date;
	});

export const experiencesInputSchema = z
	.object({
		companyName: z.string().trim().min(1, "Company name is required").max(160),
		role: z.string().trim().min(1, "Role is required").max(160),
		companyLogo: optionalUrl,
		startDate: requiredDate,
		endDate: optionalDate,
		isCurrent: z.boolean().default(false),
		typeJob: z.enum(jobTypeValues),
		location: optionalText,
		order: z.number().int().min(0).default(0),
	})
	.superRefine((data, ctx) => {
		if (!data.isCurrent && !data.endDate) {
			ctx.addIssue({
				code: "custom",
				path: ["endDate"],
				message: "End date is required when experience is not current",
			});
		}

		if (data.isCurrent && data.endDate) {
			ctx.addIssue({
				code: "custom",
				path: ["endDate"],
				message: "End date must be empty when experience is current",
			});
		}

		if (data.endDate && data.endDate < data.startDate) {
			ctx.addIssue({
				code: "custom",
				path: ["endDate"],
				message: "End date must not be earlier than start date",
			});
		}
	});

export const createExperienceSchema = experiencesInputSchema;

export const updateExperienceSchema = z.object({
	id: z.string().uuid(),
	data: experiencesInputSchema,
});

export const experienceIdSchema = z.object({
	id: z.string().uuid(),
});

export const toggleExperienceCurrentSchema = z.object({
	id: z.string().uuid(),
	isCurrent: z.boolean(),
});

export type ExperienceInput = z.infer<typeof experiencesInputSchema>;
