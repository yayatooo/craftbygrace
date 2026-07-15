import {
	createSkillFn,
	deleteSkillFn,
	toggleSkillActiveFn,
	updateSkillFn,
} from "./skills.function";

export type SkillIconUploadResult = {
	key: string;
	url: string;
};

export type CreateSkillActionInput = {
	name: string;
	slug: string;
	isActive: boolean;
	order: number;
	iconFile: File;
};

export type UpdateSkillActionInput = {
	id: string;
	name: string;
	slug: string;
	isActive: boolean;
	order: number;
	iconFile: File | null;
};

export type SkillActionOptions = {
	onUploading?: () => void;
	onSaving?: () => void;
};

export type DeleteSkillActionInput = {
	id: string;
};

export type ToggleSkillActiveActionInput = {
	id: string;
	isActive: boolean;
};

async function uploadSkillIcon(skillId: string, file: File) {
	const uploadFormData = new FormData();
	uploadFormData.set("skillId", skillId);
	uploadFormData.set("skillIconFile", file);

	const response = await fetch("/api/settings/skill-icon", {
		method: "POST",
		body: uploadFormData,
	});

	const result = await response.json().catch(() => null);

	if (!response.ok) {
		const message =
			result && typeof result.error === "string"
				? result.error
				: "Skill icon upload failed. Please try again.";

		throw new Error(message);
	}

	return result as SkillIconUploadResult;
}

async function deleteUploadedObject(key: string) {
	const response = await fetch("/api/settings/object", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ key }),
	});

	if (!response.ok) {
		const result = await response.json().catch(() => null);
		const message =
			result && typeof result.error === "string"
				? result.error
				: "R2 object cleanup failed.";

		throw new Error(message);
	}
}

export async function createSkillAction(
	input: CreateSkillActionInput,
	options: SkillActionOptions = {},
) {
	const id = crypto.randomUUID();
	let uploadedIconKey: string | null = null;

	options.onUploading?.();

	const uploadResult = await uploadSkillIcon(id, input.iconFile);
	uploadedIconKey = uploadResult.key;

	options.onSaving?.();

	try {
		return await createSkillFn({
			data: {
				id,
				name: input.name,
				slug: input.slug,
				icon: uploadResult.url,
				iconKey: uploadResult.key,
				isActive: input.isActive,
				order: input.order,
			},
		});
	} catch (error) {
		if (uploadedIconKey) {
			await deleteUploadedObject(uploadedIconKey).catch((cleanupError) => {
				console.error(
					"Skill creation failed after icon upload. Orphaned R2 object key:",
					uploadedIconKey,
					cleanupError,
				);
			});
		}

		throw error;
	}
}

export async function updateSkillAction(
	input: UpdateSkillActionInput,
	options: SkillActionOptions = {},
) {
	let uploadedIconKey: string | null = null;
	let icon: string | undefined;
	let iconKey: string | undefined;

	if (input.iconFile) {
		options.onUploading?.();

		const uploadResult = await uploadSkillIcon(input.id, input.iconFile);
		uploadedIconKey = uploadResult.key;
		icon = uploadResult.url;
		iconKey = uploadResult.key;
	}

	options.onSaving?.();

	try {
		const result = await updateSkillFn({
			data: {
				id: input.id,
				data: {
					name: input.name,
					slug: input.slug,
					isActive: input.isActive,
					order: input.order,
					icon,
					iconKey,
				},
			},
		});

		if (
			uploadedIconKey &&
			result.previousIconKey &&
			result.previousIconKey !== uploadedIconKey
		) {
			await deleteUploadedObject(result.previousIconKey).catch((error) => {
				console.error("Failed to delete replaced skill icon:", error);
			});
		}

		return result.skill;
	} catch (error) {
		if (uploadedIconKey) {
			await deleteUploadedObject(uploadedIconKey).catch((cleanupError) => {
				console.error(
					"Skill update failed after icon upload. Orphaned R2 object key:",
					uploadedIconKey,
					cleanupError,
				);
			});
		}

		throw error;
	}
}

export async function deleteSkillAction(input: DeleteSkillActionInput) {
	const result = await deleteSkillFn({
		data: {
			id: input.id,
		},
	});

	if (result?.iconKey) {
		await deleteUploadedObject(result.iconKey).catch((error) => {
			console.error("Failed to delete skill icon after skill deletion:", error);
		});
	}

	return result;
}

export async function toggleSkillActiveAction(
	input: ToggleSkillActiveActionInput,
) {
	return toggleSkillActiveFn({
		data: input,
	});
}
