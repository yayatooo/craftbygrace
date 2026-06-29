import { z } from "zod";

const optionalUrl = z
	.union([
		z.string().trim().url("Must be a valid URL"),
		z.literal(""),
		z.null(),
	])
	.transform((value) => (value === "" || value === null ? null : value));

export const moviesInputSchema = z.object({
	name: z.string().trim().min(1, "Movie name is required").max(160),
	type: z.string().trim().min(1, "Movie type is required").max(160),
	image: optionalUrl.optional().default(null),
	link: optionalUrl.optional().default(null),
	isActive: z.boolean().default(true),
	order: z.number().int().min(0).default(0),
});

export const createMoviesSchema = moviesInputSchema;

export const updateMoviesSchema = z.object({
	id: z.string().uuid(),
	data: moviesInputSchema,
});

export const movieIdSchema = z.object({
	id: z.string().uuid(),
});

export const toggleMoviesActiveSchema = z.object({
	id: z.string().uuid(),
	isActive: z.boolean(),
});

export type MoviesInput = z.infer<typeof moviesInputSchema>;
