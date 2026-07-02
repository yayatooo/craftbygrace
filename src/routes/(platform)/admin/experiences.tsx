import { createFileRoute } from "@tanstack/react-router";
import { getExperiencesFn } from "#/features/experiences/experiences.function";
import ExperiencesAdmin from "#/pages/_platform/experiences";

export const Route = createFileRoute("/(platform)/admin/experiences")({
	loader: async () => {
		const experiences = await getExperiencesFn();

		return {
			experiences,
		};
	},

	component: RouteComponent,
});

function RouteComponent() {
	const { experiences } = Route.useLoaderData();

	return <ExperiencesAdmin experiences={experiences} />;
}
