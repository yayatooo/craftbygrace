import { z } from "zod";

const optionalText = (max: number) =>
	z
		.union([z.string().trim().max(max), z.literal(""), z.null()])
		.optional()
		.default("")
		.transform((value) => (value === "" || value === null ? null : value));

const optionalUsername = z
	.union([
		z
			.string()
			.trim()
			.toLowerCase()
			.min(2, "Username must be at least 2 characters")
			.max(80, "Username must be 80 characters or less")
			.regex(
				/^[a-z0-9-]+$/,
				"Username may only contain lowercase letters, numbers, and hyphens",
			),
		z.literal(""),
		z.null(),
	])
	.optional()
	.default("")
	.transform((value) => (value === "" || value === null ? null : value));

const optionalImageUrl = z
	.union([z.string().trim().url("Must be a valid image URL"), z.null()])
	.optional()
	.default(null);

export const profileSettingsInputSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name must be 100 characters or less"),
	username: optionalUsername,
	headline: optionalText(160),
	bio: optionalText(1000),
	isVerified: z.boolean().default(false),
});

export const updateProfileSettingsSchema = z.object({
	data: profileSettingsInputSchema.extend({
		image: optionalImageUrl,
		imageKey: z.string().trim().min(1).nullable().optional(),
	}),
});

export type ProfileSettingsInput = z.infer<typeof profileSettingsInputSchema>;
export type UpdateProfileSettingsInput = z.infer<
	typeof updateProfileSettingsSchema
>["data"];
