import { createFileRoute } from "@tanstack/react-router";
import { getProjectsFn } from "#/features/projects/projects.function";
import ProjectsAdmin from "#/pages/_platform/projects";

export const Route = createFileRoute("/(platform)/admin/projects")({
	loader: async () => {
		const projects = await getProjectsFn();

		return {
			projects,
		};
	},

	component: RouteComponent,
});

function RouteComponent() {
	const { projects } = Route.useLoaderData();

	return <ProjectsAdmin projects={projects} />;
}
