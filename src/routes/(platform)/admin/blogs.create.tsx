import { createFileRoute } from "@tanstack/react-router";

import { BlogsInputForm } from "#/pages/_platform/blogs/blogs-input-form";

export const Route = createFileRoute("/(platform)/admin/blogs/create")({
	component: RouteComponent,
});

function RouteComponent() {
	return <BlogsInputForm mode="create" />;
}
