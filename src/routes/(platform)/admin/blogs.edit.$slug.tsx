import { createFileRoute, notFound } from "@tanstack/react-router";

import { getBlogBySlugFn } from "#/features/blogs/blogs.function";
import { BlogsEditForm } from "#/pages/_platform/blogs/blogs-edit-form";

export const Route = createFileRoute("/(platform)/admin/blogs/edit/$slug")({
	loader: async ({ params }) => {
		const blog = await getBlogBySlugFn({
			data: {
				slug: params.slug,
			},
		});

		if (!blog) {
			throw notFound();
		}

		return {
			blog,
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { blog } = Route.useLoaderData();

	return <BlogsEditForm blog={blog} />;
}
