import { createFileRoute } from "@tanstack/react-router";

import { TitleText } from "#/components/title-text";
import { JobTrackerInputForm } from "#/pages/_platform/job-tracker/job-tracker-input-form";

export const Route = createFileRoute("/(platform)/admin/job-tracker/create")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="w-full space-y-6">
			<div>
				<TitleText>Add Application</TitleText>
				<p className="text-sm text-muted-foreground">
					Track a new job application, its progress, CV link, and notes.
				</p>
			</div>

			<JobTrackerInputForm mode="create" />
		</div>
	);
}
