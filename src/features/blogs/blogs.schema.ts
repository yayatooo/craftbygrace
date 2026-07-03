import { z } from "zod";

import { blogContentTypeEnum, blogStatusEnum } from "#/db/schema";

const optionalUrl = z
	.union([
		z.string().trim().url("Must be a valid URL"),
		z.literal(""),
		z.null(),
	])
	.transform((value) => (value === "" || value === null ? null : value));

const dateSchema = z.preprocess((value) => {
	if (value === undefined) {
		return undefined;
	}

	if (value === "" || value === null) {
		return null;
	}

	if (value instanceof Date) {
		return value;
	}

	if (typeof value === "string" || typeof value === "number") {
		return new Date(value);
	}

	return value;
}, z.date().nullable().optional());

const tagsSchema = z
	.array(
		z
			.string()
			.trim()
			.min(1, "Tag is required")
			.max(80, "Tag must be 80 characters or less"),
	)
	.default([])
	.transform((tags) => {
		const seen = new Set<string>();

		return tags.filter((tag) => {
			const key = tag.toLowerCase();

			if (seen.has(key)) {
				return false;
			}

			seen.add(key);
			return true;
		});
	});

export function calculateReadingTime(content: string): number {
	const text = content
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/!\[[^\]]*]\([^)]*\)/g, " ")
		.replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
		.replace(/^#{1,6}\s+/gm, "")
		.replace(/^>\s?/gm, "")
		.replace(/[*_~>#-]/g, " ")
		.replace(/\s+/g, " ")
		.trim();

	const wordCount = text === "" ? 0 : text.split(/\s+/).length;

	return Math.max(1, Math.ceil(wordCount / 250));
}

export const blogsInputSchema = z
	.object({
		title: z.string().trim().min(1, "Blog title is required").max(200),
		slug: z
			.string()
			.trim()
			.toLowerCase()
			.min(1, "Blog slug is required")
			.max(220)
			.regex(
				/^[a-z0-9-]+$/,
				"Slug may only contain lowercase letters, numbers, and hyphens",
			),
		excerpt: z
			.string()
			.trim()
			.transform((value) => (value === "" ? null : value))
			.nullable()
			.optional()
			.default(null),
		coverImage: optionalUrl.optional().default(null),
		contentType: z.enum(blogContentTypeEnum.enumValues),
		content: z.string().trim().min(1, "Blog content is required"),
		status: z.enum(blogStatusEnum.enumValues),
		tags: tagsSchema,
		isFeatured: z.boolean().default(false),
		publishedAt: dateSchema,
	})
	.transform((data) => {
		if (data.status === "draft") {
			return {
				...data,
				publishedAt: null,
			};
		}

		return data;
	});

export const createBlogSchema = blogsInputSchema;

export const updateBlogSchema = z.object({
	id: z.string().uuid(),
	data: blogsInputSchema,
});

export const blogIdSchema = z.object({
	id: z.string().uuid(),
});

export const blogSlugSchema = z.object({
	slug: z.string().trim().min(1, "Blog slug is required"),
});

export type BlogInput = z.infer<typeof blogsInputSchema>;
