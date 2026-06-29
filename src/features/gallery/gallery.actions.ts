import {
	createGalleryItemFn,
	deleteGalleryItemFn,
	updateGalleryItemFn,
} from "./gallery.function";

export type CreateGalleryItemActionInput = {
	name: string;
	alt: string | null;
	isActive: boolean;
	order: number;
	galleryFile: File;
};

export type GalleryImageUploadResult = {
	key: string;
	url: string;
};

export type CreateGalleryItemActionOptions = {
	onUploading?: () => void;
	onSaving?: () => void;
};

export type UpdateGalleryItemActionInput = {
	id: string;
	name: string;
	alt: string | null;
	isActive: boolean;
	order: number;
	currentImage: string;
	galleryFile: File | null;
	shouldRemoveImage: boolean;
};

export type UpdateGalleryItemActionOptions = {
	onUploading?: () => void;
	onSaving?: () => void;
};

export type DeleteGalleryItemActionInput = {
	id: string;
};

async function uploadGalleryImage(file: File) {
	const uploadFormData = new FormData();
	uploadFormData.set("galleryFile", file);

	const response = await fetch("/api/gallery/image", {
		method: "POST",
		body: uploadFormData,
	});

	const result = await response.json().catch(() => null);

	if (!response.ok) {
		const message =
			result && typeof result.error === "string"
				? result.error
				: "Gallery image upload failed. Please try again.";

		throw new Error(message);
	}

	return result as GalleryImageUploadResult;
}

export async function createGalleryItemAction(
	input: CreateGalleryItemActionInput,
	options: CreateGalleryItemActionOptions = {},
) {
	let uploadedGalleryImageKey: string | null = null;

	options.onUploading?.();

	const uploadResult = await uploadGalleryImage(input.galleryFile);
	uploadedGalleryImageKey = uploadResult.key;

	options.onSaving?.();

	try {
		return await createGalleryItemFn({
			data: {
				name: input.name,
				image: uploadResult.url,
				alt: input.alt,
				isActive: input.isActive,
				order: input.order,
			},
		});
	} catch (error) {
		console.error(
			"Gallery item creation failed after image upload. Orphaned R2 object key:",
			uploadedGalleryImageKey,
		);

		throw error;
	}
}

export async function updateGalleryItemAction(
	input: UpdateGalleryItemActionInput,
	options: UpdateGalleryItemActionOptions = {},
) {
	let uploadedGalleryImageKey: string | null = null;
	let image = input.currentImage;

	if (input.shouldRemoveImage && !input.galleryFile) {
		// gallery.image is required, so removal without replacement keeps the current image.
		image = input.currentImage;
	}

	if (input.galleryFile) {
		options.onUploading?.();

		const uploadResult = await uploadGalleryImage(input.galleryFile);
		uploadedGalleryImageKey = uploadResult.key;
		image = uploadResult.url;
	}

	options.onSaving?.();

	try {
		return await updateGalleryItemFn({
			data: {
				id: input.id,
				data: {
					name: input.name,
					image,
					alt: input.alt,
					isActive: input.isActive,
					order: input.order,
				},
			},
		});
	} catch (error) {
		if (uploadedGalleryImageKey) {
			console.error(
				"Gallery item update failed after image upload. Orphaned R2 object key:",
				uploadedGalleryImageKey,
			);
		}

		throw error;
	}
}

export async function deleteGalleryItemAction(
	input: DeleteGalleryItemActionInput,
) {
	// R2 image cleanup will be handled later; this only deletes the DB record.
	return deleteGalleryItemFn({
		data: {
			id: input.id,
		},
	});
}
