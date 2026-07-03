import {
	createFileRoute,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";

import { getBlogsFn } from "#/features/blogs/blogs.function";
import BlogsAdmin from "#/pages/_platform/blogs";

export const Route = createFileRoute("/(platform)/admin/blogs")({
	loader: async ({ location }) => {
		if (location.pathname !== "/admin/blogs") {
			return {
				blogs: [],
			};
		}

		const blogs = await getBlogsFn();

		return {
			blogs,
		};
	},

	component: RouteComponent,
});

function RouteComponent() {
	const { blogs } = Route.useLoaderData();
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	if (pathname !== "/admin/blogs") {
		return <Outlet />;
	}

	return <BlogsAdmin blogs={blogs} />;
}
