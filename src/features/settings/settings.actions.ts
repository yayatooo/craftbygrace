import { updateProfileSettingsFn } from "./settings.function";

export type UpdateProfileSettingsActionInput = {
	name: string;
	username: string | null;
	headline: string | null;
	bio: string | null;
	isVerified: boolean;
	currentImage: string | null;
	profileFile: File | null;
};

export type ProfileImageUploadResult = {
	key: string;
	url: string;
};

export type UpdateProfileSettingsActionOptions = {
	onUploading?: () => void;
	onSaving?: () => void;
};

async function uploadProfileImage(file: File) {
	const uploadFormData = new FormData();
	uploadFormData.set("profileFile", file);

	const response = await fetch("/api/settings/profile-image", {
		method: "POST",
		body: uploadFormData,
	});

	const result = await response.json().catch(() => null);

	if (!response.ok) {
		const message =
			result && typeof result.error === "string"
				? result.error
				: "Profile photo upload failed. Please try again.";

		throw new Error(message);
	}

	return result as ProfileImageUploadResult;
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

export async function updateProfileSettingsAction(
	input: UpdateProfileSettingsActionInput,
	options: UpdateProfileSettingsActionOptions = {},
) {
	let uploadedProfileImageKey: string | null = null;
	let image = input.currentImage;
	let imageKey: string | null | undefined;

	if (input.profileFile) {
		options.onUploading?.();

		const uploadResult = await uploadProfileImage(input.profileFile);
		uploadedProfileImageKey = uploadResult.key;
		image = uploadResult.url;
		imageKey = uploadResult.key;
	}

	options.onSaving?.();

	try {
		const result = await updateProfileSettingsFn({
			data: {
				data: {
					name: input.name,
					username: input.username,
					headline: input.headline,
					bio: input.bio,
					isVerified: input.isVerified,
					image,
					imageKey,
				},
			},
		});

		if (
			uploadedProfileImageKey &&
			result.previousImageKey &&
			result.previousImageKey !== uploadedProfileImageKey
		) {
			await deleteUploadedObject(result.previousImageKey).catch((error) => {
				console.error("Failed to delete replaced profile image:", error);
			});
		}

		return result.profile;
	} catch (error) {
		if (uploadedProfileImageKey) {
			await deleteUploadedObject(uploadedProfileImageKey).catch(
				(cleanupError) => {
					console.error(
						"Profile update failed after image upload. Orphaned R2 object key:",
						uploadedProfileImageKey,
						cleanupError,
					);
				},
			);
		}

		throw error;
	}
}
