import { createFileRoute, notFound } from "@tanstack/react-router";

import { getJobApplicationByIdFn } from "#/features/job-tracker/job-tracker.function";
import { JobTrackerEditForm } from "#/pages/_platform/job-tracker/job-tracker-edit-form";

export const Route = createFileRoute("/(platform)/admin/job-tracker/edit/$id")({
	loader: async ({ params }) => {
		const application = await getJobApplicationByIdFn({
			data: {
				id: params.id,
			},
		});

		if (!application) {
			throw notFound();
		}

		return {
			application,
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { application } = Route.useLoaderData();

	return <JobTrackerEditForm application={application} />;
}
