import {
	createJobApplicationFn,
	deleteJobApplicationFn,
	updateJobApplicationFn,
} from "./job-tracker.function";
import {
	createJobApplicationSchema,
	updateJobApplicationSchema,
} from "./job-tracker.schema";

export type CreateJobApplicationActionInput = {
	name: string;
	company: string;
	location: string;
	role: string;
	cv: string | null;
	type: string;
	platform: string;
	workType: string;
	status: string;
	remarks: string | null;
};

export type UpdateJobApplicationActionInput =
	CreateJobApplicationActionInput & {
		id: string;
	};

export type DeleteJobApplicationActionInput = {
	id: string;
};

export async function createJobApplicationAction(
	input: CreateJobApplicationActionInput,
) {
	const data = createJobApplicationSchema.parse(input);

	return createJobApplicationFn({
		data,
	});
}

export async function updateJobApplicationAction(
	input: UpdateJobApplicationActionInput,
) {
	const data = updateJobApplicationSchema.parse({
		id: input.id,
		data: {
			name: input.name,
			company: input.company,
			location: input.location,
			role: input.role,
			cv: input.cv,
			type: input.type,
			platform: input.platform,
			workType: input.workType,
			status: input.status,
			remarks: input.remarks,
		},
	});

	return updateJobApplicationFn({
		data,
	});
}

export async function deleteJobApplicationAction(
	input: DeleteJobApplicationActionInput,
) {
	return deleteJobApplicationFn({
		data: {
			id: input.id,
		},
	});
}

// Future action layer responsibility: CV upload handling if document uploads are
// added later.
