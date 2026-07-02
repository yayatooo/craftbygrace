import {
	createProjectFn,
	deleteProjectFn,
	updateProjectFn,
} from "./projects.function";

export type CreateProjectActionInput = {
	name: string;
	slug: string;
	description: string;
	techStack: string[];
	isCurrent: boolean;
	isSecret: boolean;
	isActive: boolean;
	demoLink: string | null;
	repoLink: string | null;
	order: number;
	thumbnailFile: File | null;
};

export type ProjectThumbnailUploadResult = {
	key: string;
	url: string;
};

export type CreateProjectActionOptions = {
	onUploading?: () => void;
	onSaving?: () => void;
};

export type UpdateProjectActionInput = {
	id: string;
	name: string;
	slug: string;
	description: string;
	techStack: string[];
	isCurrent: boolean;
	isSecret: boolean;
	isActive: boolean;
	demoLink: string | null;
	repoLink: string | null;
	order: number;
	currentThumbnail: string | null;
	thumbnailFile: File | null;
	shouldRemoveThumbnail: boolean;
};

export type UpdateProjectActionOptions = {
	onUploading?: () => void;
	onSaving?: () => void;
};

export type DeleteProjectActionInput = {
	id: string;
};

async function uploadProjectThumbnail(file: File) {
	const uploadFormData = new FormData();
	uploadFormData.set("thumbnailFile", file);

	const response = await fetch("/api/projects/thumbnail", {
		method: "POST",
		body: uploadFormData,
	});

	const result = await response.json().catch(() => null);

	if (!response.ok) {
		const message =
			result && typeof result.error === "string"
				? result.error
				: "Project thumbnail upload failed. Please try again.";

		throw new Error(message);
	}

	return result as ProjectThumbnailUploadResult;
}

export async function createProjectAction(
	input: CreateProjectActionInput,
	options: CreateProjectActionOptions = {},
) {
	let uploadedThumbnailKey: string | null = null;
	let thumbnail: string | null = null;

	if (input.thumbnailFile) {
		options.onUploading?.();

		const uploadResult = await uploadProjectThumbnail(input.thumbnailFile);
		uploadedThumbnailKey = uploadResult.key;
		thumbnail = uploadResult.url;
	}

	options.onSaving?.();

	try {
		return await createProjectFn({
			data: {
				thumbnail,
				name: input.name,
				slug: input.slug,
				description: input.description,
				techStack: input.techStack,
				isCurrent: input.isCurrent,
				isSecret: input.isSecret,
				isActive: input.isActive,
				demoLink: input.demoLink,
				repoLink: input.repoLink,
				order: input.order,
			},
		});
	} catch (error) {
		if (uploadedThumbnailKey) {
			console.error(
				"Project creation failed after thumbnail upload. Orphaned R2 object key:",
				uploadedThumbnailKey,
			);
		}

		throw error;
	}
}

export async function updateProjectAction(
	input: UpdateProjectActionInput,
	options: UpdateProjectActionOptions = {},
) {
	let uploadedThumbnailKey: string | null = null;
	let thumbnail = input.shouldRemoveThumbnail ? null : input.currentThumbnail;

	if (input.thumbnailFile) {
		options.onUploading?.();

		const uploadResult = await uploadProjectThumbnail(input.thumbnailFile);
		uploadedThumbnailKey = uploadResult.key;
		thumbnail = uploadResult.url;
	}

	options.onSaving?.();

	try {
		return await updateProjectFn({
			data: {
				id: input.id,
				data: {
					thumbnail,
					name: input.name,
					slug: input.slug,
					description: input.description,
					techStack: input.techStack,
					isCurrent: input.isCurrent,
					isSecret: input.isSecret,
					isActive: input.isActive,
					demoLink: input.demoLink,
					repoLink: input.repoLink,
					order: input.order,
				},
			},
		});
	} catch (error) {
		if (uploadedThumbnailKey) {
			console.error(
				"Project update failed after thumbnail upload. Orphaned R2 object key:",
				uploadedThumbnailKey,
			);
		}

		throw error;
	}
}

export async function deleteProjectAction(input: DeleteProjectActionInput) {
	// R2 thumbnail cleanup will be implemented later; this only deletes the DB row.
	return deleteProjectFn({
		data: {
			id: input.id,
		},
	});
}
