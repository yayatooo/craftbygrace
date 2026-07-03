import { createBlogFn, deleteBlogFn, updateBlogFn } from "./blogs.function";

export type CreateBlogActionInput = {
	title: string;
	slug: string;
	excerpt: string | null;
	content: string;
	status: "draft" | "published" | "archived";
	tags: string[];
	isFeatured: boolean;
	coverImageFile: File | null;
};

export type BlogCoverUploadResult = {
	key: string;
	url: string;
};

export type CreateBlogActionOptions = {
	onUploading?: () => void;
	onSaving?: () => void;
};

export type UpdateBlogActionInput = {
	id: string;
	title: string;
	slug: string;
	excerpt: string | null;
	content: string;
	status: "draft" | "published" | "archived";
	tags: string[];
	isFeatured: boolean;
	currentCoverImage: string | null;
	coverImageFile: File | null;
	shouldRemoveCoverImage: boolean;
};

export type UpdateBlogActionOptions = {
	onUploading?: () => void;
	onSaving?: () => void;
};

export type DeleteBlogActionInput = {
	id: string;
};

async function uploadBlogCover(file: File) {
	const uploadFormData = new FormData();
	uploadFormData.set("coverImageFile", file);

	const response = await fetch("/api/blogs/cover", {
		method: "POST",
		body: uploadFormData,
	});

	const result = await response.json().catch(() => null);

	if (!response.ok) {
		const message =
			result && typeof result.error === "string"
				? result.error
				: "Blog cover upload failed. Please try again.";

		throw new Error(message);
	}

	return result as BlogCoverUploadResult;
}

export async function createBlogAction(
	input: CreateBlogActionInput,
	options: CreateBlogActionOptions = {},
) {
	let uploadedCoverKey: string | null = null;
	let coverImage: string | null = null;

	if (input.coverImageFile) {
		options.onUploading?.();

		const uploadResult = await uploadBlogCover(input.coverImageFile);
		uploadedCoverKey = uploadResult.key;
		coverImage = uploadResult.url;
	}

	options.onSaving?.();

	try {
		return await createBlogFn({
			data: {
				title: input.title,
				slug: input.slug,
				excerpt: input.excerpt,
				coverImage,
				contentType: "markdown",
				content: input.content,
				status: input.status,
				tags: input.tags,
				isFeatured: input.isFeatured,
			},
		});
	} catch (error) {
		if (uploadedCoverKey) {
			console.error(
				"Blog creation failed after cover upload. Orphaned R2 object key:",
				uploadedCoverKey,
			);
		}

		throw error;
	}
}

export async function updateBlogAction(
	input: UpdateBlogActionInput,
	options: UpdateBlogActionOptions = {},
) {
	let uploadedCoverKey: string | null = null;
	let coverImage = input.shouldRemoveCoverImage
		? null
		: input.currentCoverImage;

	if (input.coverImageFile) {
		options.onUploading?.();

		const uploadResult = await uploadBlogCover(input.coverImageFile);
		uploadedCoverKey = uploadResult.key;
		coverImage = uploadResult.url;
	}

	options.onSaving?.();

	try {
		return await updateBlogFn({
			data: {
				id: input.id,
				data: {
					title: input.title,
					slug: input.slug,
					excerpt: input.excerpt,
					coverImage,
					contentType: "markdown",
					content: input.content,
					status: input.status,
					tags: input.tags,
					isFeatured: input.isFeatured,
				},
			},
		});
	} catch (error) {
		if (uploadedCoverKey) {
			console.error(
				"Blog update failed after cover upload. Orphaned R2 object key:",
				uploadedCoverKey,
			);
		}

		throw error;
	}
}

export async function deleteBlogAction(input: DeleteBlogActionInput) {
	// R2 cover cleanup is intentionally deferred; this only deletes the DB row.
	return deleteBlogFn({
		data: {
			id: input.id,
		},
	});
}
