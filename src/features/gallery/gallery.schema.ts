import { z } from "zod";

const imageUrl = z
	.string({ error: "Image URL is required" })
	.trim()
	.min(1, "Image URL is required")
	.url("Must be a valid URL");

const optionalAlt = z
	.union([z.string().trim().max(255), z.literal(""), z.null()])
	.optional()
	.default("")
	.transform((value) => (value === "" || value === null ? null : value));

export const galleryInputSchema = z.object({
	name: z.string().trim().min(1, "Gallery item name is required").max(160),
	image: imageUrl,
	alt: optionalAlt,
	isActive: z.boolean().default(true),
	order: z.number().int().min(0).default(0),
});

export const createGalleryItemSchema = galleryInputSchema;

export const updateGalleryItemSchema = z.object({
	id: z.string().uuid(),
	data: galleryInputSchema,
});

export const galleryItemIdSchema = z.object({
	id: z.string().uuid(),
});

export const toggleGalleryItemActiveSchema = z.object({
	id: z.string().uuid(),
	isActive: z.boolean(),
});

export type GalleryInput = z.infer<typeof galleryInputSchema>;
