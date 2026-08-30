import { env } from "cloudflare:workers";

function requiredEnv(name: string) {
	const value = process.env[name];

	if (!value) {
		throw new Error(`Missing environment variable: ${name}`);
	}

	return value;
}

export function getR2Bucket() {
	return env.R2_BUCKET;
}

export type UploadFolder =
	| "gallery"
	| "movies"
	| "projects"
	| "experiences"
	| "songs"
	| "profile"
	| "skills"
	| "avatars"
	| "blogs";

function sanitizeFileName(fileName: string) {
	const lastDotIndex = fileName.lastIndexOf(".");

	const name = lastDotIndex > 0 ? fileName.slice(0, lastDotIndex) : fileName;

	const extension = lastDotIndex > 0 ? fileName.slice(lastDotIndex + 1) : "";

	const safeName = name
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-_]/g, "")
		.replace(/-+/g, "-");

	const safeExtension = extension.toLowerCase().replace(/[^a-z0-9]/g, "");

	return safeExtension ? `${safeName}.${safeExtension}` : safeName;
}

export function createObjectKey({
	folder,
	entityId,
	fileName,
}: {
	folder: UploadFolder;
	entityId: string;
	fileName: string;
}) {
	const safeFileName = sanitizeFileName(fileName);
	const uniquePrefix = crypto.randomUUID().slice(0, 8);

	return `${folder}/${entityId}/${uniquePrefix}-${safeFileName}`;
}

export function getPublicUrl(key: string) {
	const publicUrl = requiredEnv("R2_PUBLIC_URL").replace(/\/$/, "");

	return `${publicUrl}/${key}`;
}
