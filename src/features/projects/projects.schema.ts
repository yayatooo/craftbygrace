import { z } from "zod";

const optionalUrl = z
	.union([
		z.string().trim().url("Must be a valid URL"),
		z.literal(""),
		z.null(),
	])
	.transform((value) => (value === "" || value === null ? null : value));

const techStackSchema = z
	.array(
		z
			.string()
			.trim()
			.min(1, "Tech stack item is required")
			.max(80, "Tech stack item must be 80 characters or less"),
	)
	.min(1, "At least one tech stack item is required")
	.transform((items) => {
		const seen = new Set<string>();

		return items.filter((item) => {
			const key = item.toLowerCase();

			if (seen.has(key)) {
				return false;
			}

			seen.add(key);
			return true;
		});
	});

export const projectsInputSchema = z.object({
	thumbnail: optionalUrl.optional().default(null),
	name: z.string().trim().min(1, "Project name is required").max(160),
	slug: z
		.string()
		.trim()
		.toLowerCase()
		.min(1, "Project slug is required")
		.max(180)
		.regex(
			/^[a-z0-9-]+$/,
			"Slug may only contain lowercase letters, numbers, and hyphens",
		),
	description: z.string().trim().min(1, "Project description is required"),
	techStack: techStackSchema,
	isCurrent: z.boolean().default(false),
	isSecret: z.boolean().default(false),
	isActive: z.boolean().default(true),
	demoLink: optionalUrl.optional().default(null),
	repoLink: optionalUrl.optional().default(null),
	order: z.number().int().min(0).default(0),
});

export const createProjectSchema = projectsInputSchema;

export const updateProjectSchema = z.object({
	id: z.string().uuid(),
	data: projectsInputSchema,
});

export const projectIdSchema = z.object({
	id: z.string().uuid(),
});

export const toggleProjectActiveSchema = z.object({
	id: z.string().uuid(),
	isActive: z.boolean(),
});

export type ProjectInput = z.infer<typeof projectsInputSchema>;
