import {
	createExperienceFn,
	deleteExperienceFn,
	updateExperienceFn,
} from "./experiences.function";

export type ExperienceJobType =
	| "full_time"
	| "part_time"
	| "freelance"
	| "contract"
	| "internship"
	| "self_employed";

export type CreateExperienceActionInput = {
	companyName: string;
	role: string;
	startDate: string;
	endDate: string | null;
	isCurrent: boolean;
	typeJob: ExperienceJobType;
	location: string | null;
	order: number;
	companyLogoFile: File | null;
};

export type CompanyLogoUploadResult = {
	key: string;
	url: string;
};

export type CreateExperienceActionOptions = {
	onUploading?: () => void;
	onSaving?: () => void;
};

export type UpdateExperienceActionInput = {
	id: string;
	companyName: string;
	role: string;
	startDate: string;
	endDate: string | null;
	isCurrent: boolean;
	typeJob: ExperienceJobType;
	location: string | null;
	order: number;
	currentCompanyLogo: string | null;
	companyLogoFile: File | null;
	shouldRemoveCompanyLogo: boolean;
};

export type UpdateExperienceActionOptions = {
	onUploading?: () => void;
	onSaving?: () => void;
};

export type DeleteExperienceActionInput = {
	id: string;
};

async function uploadCompanyLogo(file: File) {
	const uploadFormData = new FormData();
	uploadFormData.set("companyLogoFile", file);

	const response = await fetch("/api/experiences/company-logo", {
		method: "POST",
		body: uploadFormData,
	});

	const result = await response.json().catch(() => null);

	if (!response.ok) {
		const message =
			result && typeof result.error === "string"
				? result.error
				: "Company logo upload failed. Please try again.";

		throw new Error(message);
	}

	return result as CompanyLogoUploadResult;
}

export async function createExperienceAction(
	input: CreateExperienceActionInput,
	options: CreateExperienceActionOptions = {},
) {
	let uploadedCompanyLogoKey: string | null = null;
	let companyLogo: string | null = null;

	if (input.companyLogoFile) {
		options.onUploading?.();

		const uploadResult = await uploadCompanyLogo(input.companyLogoFile);
		uploadedCompanyLogoKey = uploadResult.key;
		companyLogo = uploadResult.url;
	}

	options.onSaving?.();

	try {
		return await createExperienceFn({
			data: {
				companyName: input.companyName,
				role: input.role,
				companyLogo,
				startDate: input.startDate,
				endDate: input.endDate,
				isCurrent: input.isCurrent,
				typeJob: input.typeJob,
				location: input.location,
				order: input.order,
			},
		});
	} catch (error) {
		if (uploadedCompanyLogoKey) {
			console.error(
				"Experience creation failed after company logo upload. Orphaned R2 object key:",
				uploadedCompanyLogoKey,
			);
		}

		throw error;
	}
}

export async function updateExperienceAction(
	input: UpdateExperienceActionInput,
	options: UpdateExperienceActionOptions = {},
) {
	let uploadedCompanyLogoKey: string | null = null;
	let companyLogo = input.shouldRemoveCompanyLogo
		? null
		: input.currentCompanyLogo;

	if (input.companyLogoFile) {
		options.onUploading?.();

		const uploadResult = await uploadCompanyLogo(input.companyLogoFile);
		uploadedCompanyLogoKey = uploadResult.key;
		companyLogo = uploadResult.url;
	}

	options.onSaving?.();

	try {
		return await updateExperienceFn({
			data: {
				id: input.id,
				data: {
					companyName: input.companyName,
					role: input.role,
					companyLogo,
					startDate: input.startDate,
					endDate: input.endDate,
					isCurrent: input.isCurrent,
					typeJob: input.typeJob,
					location: input.location,
					order: input.order,
				},
			},
		});
	} catch (error) {
		if (uploadedCompanyLogoKey) {
			console.error(
				"Experience update failed after company logo upload. Orphaned R2 object key:",
				uploadedCompanyLogoKey,
			);
		}

		throw error;
	}
}

export async function deleteExperienceAction(
	input: DeleteExperienceActionInput,
) {
	// R2 company logo cleanup will be handled later; this only deletes the DB record.
	return deleteExperienceFn({
		data: {
			id: input.id,
		},
	});
}
