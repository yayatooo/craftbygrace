import { createFileRoute } from "@tanstack/react-router";
import { getCurrentAuth } from "#/features/auth/auth.server";
import { getPublicUrl, getR2Bucket } from "#/lib/s3";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedImageTypes = {
	"image/png": "png",
	"image/jpeg": "jpg",
	"image/webp": "webp",
} as const;

function json(data: unknown, status = 200) {
	return Response.json(data, { status });
}

export const Route = createFileRoute("/api/gallery/image")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const currentAuth = await getCurrentAuth();

				if (!currentAuth) {
					return json({ error: "Unauthorized" }, 401);
				}

				if (!currentAuth.isOwner) {
					return json({ error: "Forbidden" }, 403);
				}

				const formData = await request.formData();
				const galleryFile = formData.get("galleryFile");

				if (!(galleryFile instanceof File)) {
					return json({ error: "Missing gallery file." }, 400);
				}

				const extension =
					allowedImageTypes[galleryFile.type as keyof typeof allowedImageTypes];

				if (!extension) {
					return json(
						{ error: "Gallery image must be a PNG, JPG, or WEBP image." },
						400,
					);
				}

				if (galleryFile.size > MAX_FILE_SIZE) {
					return json({ error: "Gallery image must be 5 MB or smaller." }, 400);
				}

				const key = `gallery/${crypto.randomUUID()}/image.${extension}`;
				const body = new Uint8Array(await galleryFile.arrayBuffer());

				await getR2Bucket().put(key, body, {
					httpMetadata: {
						contentType: galleryFile.type,
					},
				});

				return json({
					key,
					url: getPublicUrl(key),
				});
			},
		},
	},
});
