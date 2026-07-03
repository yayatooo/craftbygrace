import {
	createFileRoute,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";

import { getJobApplicationsFn } from "#/features/job-tracker/job-tracker.function";
import JobTrackerAdmin from "#/pages/_platform/job-tracker";

export const Route = createFileRoute("/(platform)/admin/job-tracker")({
	loader: async ({ location }) => {
		if (location.pathname !== "/admin/job-tracker") {
			return {
				applications: [],
			};
		}

		const applications = await getJobApplicationsFn();

		return {
			applications,
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { applications } = Route.useLoaderData();
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	if (pathname !== "/admin/job-tracker") {
		return <Outlet />;
	}

	return <JobTrackerAdmin applications={applications} />;
}
