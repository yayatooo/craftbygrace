import { createMovieFn } from "./movies.function";

export type CreateMovieActionInput = {
	name: string;
	type: string;
	link: string | null;
	isActive: boolean;
	order: number;
	posterFile: File | null;
};

export type PosterUploadResult = {
	key: string;
	url: string;
};

export type CreateMovieActionOptions = {
	onUploading?: () => void;
	onSaving?: () => void;
};

async function uploadMoviePoster(file: File) {
	const uploadFormData = new FormData();
	uploadFormData.set("posterFile", file);

	const response = await fetch("/api/movies/poster", {
		method: "POST",
		body: uploadFormData,
	});

	const result = await response.json().catch(() => null);

	if (!response.ok) {
		const message =
			result && typeof result.error === "string"
				? result.error
				: "Poster upload failed. Please try again.";

		throw new Error(message);
	}

	return result as PosterUploadResult;
}

export async function createMovieAction(
	input: CreateMovieActionInput,
	options: CreateMovieActionOptions = {},
) {
	let uploadedPosterKey: string | null = null;
	let image: string | null = null;

	if (input.posterFile) {
		options.onUploading?.();

		const uploadResult = await uploadMoviePoster(input.posterFile);
		uploadedPosterKey = uploadResult.key;
		image = uploadResult.url;
	}

	options.onSaving?.();

	try {
		return await createMovieFn({
			data: {
				name: input.name,
				type: input.type,
				image,
				link: input.link,
				isActive: input.isActive,
				order: input.order,
			},
		});
	} catch (error) {
		if (uploadedPosterKey) {
			console.error(
				"Movie creation failed after poster upload. Orphaned R2 object key:",
				uploadedPosterKey,
			);
		}

		throw error;
	}
}
