import { and, desc, eq, lte, sql } from "drizzle-orm";

import { getDb } from "#/db";
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
	const db = getDb();

	return db
		.select()
		.from(blogs)
		.orderBy(sql`${blogs.publishedAt} desc nulls last`, desc(blogs.createdAt));
}

export async function getBlogBySlug(slug: string) {
	const db = getDb();

	const [blog] = await db
		.select()
		.from(blogs)
		.where(eq(blogs.slug, slug))
		.limit(1);

	return blog ?? null;
}

export async function getPublishedBlogs() {
	const db = getDb();

	return db
		.select({
			id: blogs.id,
			title: blogs.title,
			slug: blogs.slug,
			excerpt: blogs.excerpt,
			coverImage: blogs.coverImage,
			tags: blogs.tags,
			readingTime: blogs.readingTime,
			publishedAt: blogs.publishedAt,
			isFeatured: blogs.isFeatured,
		})
		.from(blogs)
		.where(
			and(eq(blogs.status, "published"), lte(blogs.publishedAt, new Date())),
		)
		.orderBy(desc(blogs.isFeatured), desc(blogs.publishedAt));
}

export async function getPublishedBlogBySlug(slug: string) {
	const db = getDb();

	const [blog] = await db
		.select({
			id: blogs.id,
			title: blogs.title,
			slug: blogs.slug,
			excerpt: blogs.excerpt,
			coverImage: blogs.coverImage,
			contentType: blogs.contentType,
			content: blogs.content,
			tags: blogs.tags,
			readingTime: blogs.readingTime,
			publishedAt: blogs.publishedAt,
			updatedAt: blogs.updatedAt,
		})
		.from(blogs)
		.where(
			and(
				eq(blogs.slug, slug),
				eq(blogs.status, "published"),
				lte(blogs.publishedAt, new Date()),
			),
		)
		.limit(1);

	return blog ?? null;
}

export type PublishedBlogList = Awaited<ReturnType<typeof getPublishedBlogs>>;
export type PublishedBlog = NonNullable<
	Awaited<ReturnType<typeof getPublishedBlogBySlug>>
>;

export async function createBlog(data: BlogInput) {
	const db = getDb();

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
	const db = getDb();

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
	const db = getDb();

	const [blog] = await db.delete(blogs).where(eq(blogs.id, id)).returning({
		id: blogs.id,
	});

	return blog;
}
