import { TitleText } from "#/components/title-text";

import type { JobApplicationItem } from ".";
import { JobTrackerInputForm } from "./job-tracker-input-form";

type JobTrackerEditFormProps = {
	application: JobApplicationItem;
};

export function JobTrackerEditForm({ application }: JobTrackerEditFormProps) {
	return (
		<div className="w-full space-y-6">
			<div>
				<TitleText>Edit Application</TitleText>
				<p className="text-sm text-muted-foreground">
					Update the application details, progress, CV link, and notes.
				</p>
			</div>

			<JobTrackerInputForm mode="edit" application={application} />
		</div>
	);
}
