import { createFileRoute } from "@tanstack/react-router";

import { getJobApplicationsFn } from "#/features/job-tracker/job-tracker.function";
import JobTrackerAdmin from "#/pages/_platform/job-tracker";

export const Route = createFileRoute("/(platform)/admin/job-tracker")({
	loader: async () => {
		const applications = await getJobApplicationsFn();

		return {
			applications,
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { applications } = Route.useLoaderData();

	return <JobTrackerAdmin applications={applications} />;
}
