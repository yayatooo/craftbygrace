import { z } from "zod";

const urlSafeSlug = z
	.string()
	.trim()
	.toLowerCase()
	.min(1, "Skill slug is required")
	.max(120, "Skill slug must be 120 characters or less")
	.regex(
		/^[a-z0-9-]+$/,
		"Slug may only contain lowercase letters, numbers, and hyphens",
	);

const iconUrl = z
	.string({ error: "Skill icon is required" })
	.trim()
	.min(1, "Skill icon is required")
	.url("Must be a valid icon URL");

const iconKey = z
	.string({ error: "Skill icon key is required" })
	.trim()
	.min(1, "Skill icon key is required");

export const skillFieldsSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, "Skill name is required")
		.max(100, "Skill name must be 100 characters or less"),
	slug: urlSafeSlug,
	isActive: z.boolean().default(true),
	order: z.number().int().min(0).default(0),
});

export const createSkillSchema = skillFieldsSchema.extend({
	id: z.string().uuid(),
	icon: iconUrl,
	iconKey,
});

export const updateSkillSchema = z.object({
	id: z.string().uuid(),
	data: skillFieldsSchema.extend({
		icon: iconUrl.optional(),
		iconKey: iconKey.optional(),
	}),
});

export const skillIdSchema = z.object({
	id: z.string().uuid(),
});

export const toggleSkillActiveSchema = z.object({
	id: z.string().uuid(),
	isActive: z.boolean(),
});

export type SkillFieldsInput = z.infer<typeof skillFieldsSchema>;
export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>["data"];
