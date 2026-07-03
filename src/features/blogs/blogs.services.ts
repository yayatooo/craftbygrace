import { desc, eq, sql } from "drizzle-orm";

import { db } from "#/db";
import { blogs } from "#/db/schema";

import { type BlogInput, calculateReadingTime } from "./blogs.schema";

function resolvePublishedAtForCreate(data: BlogInput) {
	if (data.status === "draft") {
		return null;
	}

	if (data.status === "published") {
		return data.publishedAt ?? new Date();
	}

	return data.publishedAt ?? null;
}

function resolvePublishedAtForUpdate(
	data: BlogInput,
	currentPublishedAt: Date | null,
) {
	if (data.status === "draft") {
		return null;
	}

	if (data.status === "published") {
		return data.publishedAt ?? currentPublishedAt ?? new Date();
	}

	return data.publishedAt === undefined ? currentPublishedAt : data.publishedAt;
}

export async function getBlogs() {
	return db
		.select()
		.from(blogs)
		.orderBy(sql`${blogs.publishedAt} desc nulls last`, desc(blogs.createdAt));
}

export async function getBlogBySlug(slug: string) {
	const [blog] = await db
		.select()
		.from(blogs)
		.where(eq(blogs.slug, slug))
		.limit(1);

	return blog ?? null;
}

export async function createBlog(data: BlogInput) {
	const [blog] = await db
		.insert(blogs)
		.values({
			title: data.title,
			slug: data.slug,
			excerpt: data.excerpt,
			coverImage: data.coverImage,
			contentType: data.contentType,
			content: data.content,
			status: data.status,
			tags: data.tags,
			readingTime: calculateReadingTime(data.content),
			publishedAt: resolvePublishedAtForCreate(data),
			isFeatured: data.isFeatured,
		})
		.returning();

	return blog;
}

export async function updateBlog(id: string, data: BlogInput) {
	const [currentBlog] = await db
		.select({
			publishedAt: blogs.publishedAt,
		})
		.from(blogs)
		.where(eq(blogs.id, id))
		.limit(1);

	const [blog] = await db
		.update(blogs)
		.set({
			title: data.title,
			slug: data.slug,
			excerpt: data.excerpt,
			coverImage: data.coverImage,
			contentType: data.contentType,
			content: data.content,
			status: data.status,
			tags: data.tags,
			readingTime: calculateReadingTime(data.content),
			publishedAt: resolvePublishedAtForUpdate(
				data,
				currentBlog?.publishedAt ?? null,
			),
			isFeatured: data.isFeatured,
			updatedAt: new Date(),
		})
		.where(eq(blogs.id, id))
		.returning();

	return blog;
}

export async function deleteBlog(id: string) {
	const [blog] = await db.delete(blogs).where(eq(blogs.id, id)).returning({
		id: blogs.id,
	});

	return blog;
}
