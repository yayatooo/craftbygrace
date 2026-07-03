import { createServerFn } from "@tanstack/react-start";

import { requireOwnerMiddleware } from "#/features/auth/auth.middleware";

import {
	blogIdSchema,
	blogSlugSchema,
	createBlogSchema,
	updateBlogSchema,
} from "./blogs.schema";
import {
	createBlog,
	deleteBlog,
	getBlogBySlug,
	getBlogs,
	updateBlog,
} from "./blogs.services";

export const getBlogsFn = createServerFn({
	method: "GET",
})
	.middleware([requireOwnerMiddleware])
	.handler(async () => {
		return getBlogs();
	});

export const getBlogBySlugFn = createServerFn({
	method: "GET",
})
	.middleware([requireOwnerMiddleware])
	.validator(blogSlugSchema)
	.handler(async ({ data }) => {
		return getBlogBySlug(data.slug);
	});

export const createBlogFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(createBlogSchema)
	.handler(async ({ data }) => {
		return createBlog(data);
	});

export const updateBlogFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(updateBlogSchema)
	.handler(async ({ data }) => {
		return updateBlog(data.id, data.data);
	});

export const deleteBlogFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(blogIdSchema)
	.handler(async ({ data }) => {
		return deleteBlog(data.id);
	});
