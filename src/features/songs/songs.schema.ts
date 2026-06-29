import { z } from "zod";

const optionalUrl = z
	.union([
		z.string().trim().url("Must be a valid URL"),
		z.literal(""),
		z.null(),
	])
	.transform((value) => (value === "" || value === null ? null : value));

export const songsInputSchema = z.object({
	name: z.string().trim().min(1, "Song name is required").max(160),
	writer: z.string().trim().min(1, "Song writer is required").max(160),
	image: optionalUrl.optional().default(null),
	link: z
		.string()
		.trim()
		.min(1, "Song link is required")
		.url("Must be a valid URL"),
	isActive: z.boolean().default(true),
	order: z.number().int().min(0).default(0),
});

export const createSongSchema = songsInputSchema;

export const updateSongSchema = z.object({
	id: z.string().uuid(),
	data: songsInputSchema,
});

export const songIdSchema = z.object({
	id: z.string().uuid(),
});

export const toggleSongActiveSchema = z.object({
	id: z.string().uuid(),
	isActive: z.boolean(),
});

export type SongInput = z.infer<typeof songsInputSchema>;
