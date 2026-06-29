import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createFileRoute } from "@tanstack/react-router";
import { getCurrentAuth } from "#/features/auth/auth.server";
import { getPublicUrl, r2Config, s3 } from "#/lib/s3";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedImageTypes = {
	"image/png": "png",
	"image/jpeg": "jpg",
	"image/webp": "webp",
} as const;

function json(data: unknown, status = 200) {
	return Response.json(data, { status });
}

export const Route = createFileRoute("/api/songs/cover")({
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
				const coverFile = formData.get("coverFile");

				if (!(coverFile instanceof File)) {
					return json({ error: "Missing cover file." }, 400);
				}

				const extension =
					allowedImageTypes[coverFile.type as keyof typeof allowedImageTypes];

				if (!extension) {
					return json(
						{ error: "Cover must be a PNG, JPG, or WEBP image." },
						400,
					);
				}

				if (coverFile.size > MAX_FILE_SIZE) {
					return json({ error: "Cover must be 5 MB or smaller." }, 400);
				}

				const key = `songs/${crypto.randomUUID()}/cover.${extension}`;
				const body = new Uint8Array(await coverFile.arrayBuffer());

				await s3.send(
					new PutObjectCommand({
						Bucket: r2Config.bucketName,
						Key: key,
						Body: body,
						ContentType: coverFile.type,
					}),
				);

				return json({
					key,
					url: getPublicUrl(key),
				});
			},
		},
	},
});
