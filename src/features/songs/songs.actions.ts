import { createSongFn, deleteSongFn, updateSongFn } from "./songs.function";

export type CreateSongActionInput = {
	name: string;
	writer: string;
	link: string;
	isActive: boolean;
	order: number;
	coverFile: File | null;
};

export type CoverUploadResult = {
	key: string;
	url: string;
};

export type CreateSongActionOptions = {
	onUploading?: () => void;
	onSaving?: () => void;
};

export type UpdateSongActionInput = {
	id: string;
	name: string;
	writer: string;
	link: string;
	isActive: boolean;
	order: number;
	currentImage: string | null;
	coverFile: File | null;
};

export type UpdateSongActionOptions = {
	onUploading?: () => void;
	onSaving?: () => void;
};

export type DeleteSongActionInput = {
	id: string;
};

async function uploadSongCover(file: File) {
	const uploadFormData = new FormData();
	uploadFormData.set("coverFile", file);

	const response = await fetch("/api/songs/cover", {
		method: "POST",
		body: uploadFormData,
	});

	const result = await response.json().catch(() => null);

	if (!response.ok) {
		if (result && typeof result.error === "string") {
			console.error("Song cover upload failed:", result.error);
		}

		throw new Error("Cover upload failed. Please try again.");
	}

	return result as CoverUploadResult;
}

export async function createSongAction(
	input: CreateSongActionInput,
	options: CreateSongActionOptions = {},
) {
	let uploadedCoverKey: string | null = null;
	let image: string | null = null;

	if (input.coverFile) {
		options.onUploading?.();

		const uploadResult = await uploadSongCover(input.coverFile).catch(
			(error) => {
				if (
					error instanceof Error &&
					error.message === "Cover upload failed. Please try again."
				) {
					throw error;
				}

				throw new Error("Cover upload failed. Please try again.");
			},
		);
		uploadedCoverKey = uploadResult.key;
		image = uploadResult.url;
	}

	options.onSaving?.();

	try {
		return await createSongFn({
			data: {
				name: input.name,
				writer: input.writer,
				image,
				link: input.link,
				isActive: input.isActive,
				order: input.order,
			},
		});
	} catch (error) {
		if (uploadedCoverKey) {
			console.error(
				"Song creation failed after cover upload. Orphaned R2 object key:",
				uploadedCoverKey,
			);
		}

		throw error;
	}
}

export async function updateSongAction(
	input: UpdateSongActionInput,
	options: UpdateSongActionOptions = {},
) {
	let uploadedCoverKey: string | null = null;
	let image = input.currentImage;

	if (input.coverFile) {
		options.onUploading?.();

		const uploadResult = await uploadSongCover(input.coverFile).catch(
			(error) => {
				if (
					error instanceof Error &&
					error.message === "Cover upload failed. Please try again."
				) {
					throw error;
				}

				throw new Error("Cover upload failed. Please try again.");
			},
		);
		uploadedCoverKey = uploadResult.key;
		image = uploadResult.url;
	}

	options.onSaving?.();

	try {
		return await updateSongFn({
			data: {
				id: input.id,
				data: {
					name: input.name,
					writer: input.writer,
					image,
					link: input.link,
					isActive: input.isActive,
					order: input.order,
				},
			},
		});
	} catch (error) {
		if (uploadedCoverKey) {
			console.error(
				"Song update failed after cover upload. Orphaned R2 object key:",
				uploadedCoverKey,
			);
		}

		throw error;
	}
}

export async function deleteSongAction(input: DeleteSongActionInput) {
	// R2 cover cleanup will be handled later; this only deletes the DB record.
	return deleteSongFn({
		data: {
			id: input.id,
		},
	});
}
