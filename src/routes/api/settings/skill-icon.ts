import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createFileRoute } from "@tanstack/react-router";

import { getCurrentAuth } from "#/features/auth/auth.server";
import { createObjectKey, getPublicUrl, r2Config, s3 } from "#/lib/s3";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const uuidPattern =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const allowedImageTypes = new Set(["image/png", "image/jpeg", "image/webp"]);

function json(data: unknown, status = 200) {
	return Response.json(data, { status });
}

export const Route = createFileRoute("/api/settings/skill-icon")({
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
				const skillId = formData.get("skillId");
				const skillIconFile = formData.get("skillIconFile");

				if (typeof skillId !== "string" || !uuidPattern.test(skillId)) {
					return json({ error: "Invalid skill ID." }, 400);
				}

				if (!(skillIconFile instanceof File)) {
					return json({ error: "Missing skill icon file." }, 400);
				}

				if (!allowedImageTypes.has(skillIconFile.type)) {
					return json(
						{ error: "Skill icon must be a PNG, JPG, or WEBP image." },
						400,
					);
				}

				if (skillIconFile.size > MAX_FILE_SIZE) {
					return json({ error: "Skill icon must be 5 MB or smaller." }, 400);
				}

				const key = createObjectKey({
					folder: "skills",
					entityId: skillId,
					fileName: skillIconFile.name,
				});
				const body = new Uint8Array(await skillIconFile.arrayBuffer());

				await s3.send(
					new PutObjectCommand({
						Bucket: r2Config.bucketName,
						Key: key,
						Body: body,
						ContentType: skillIconFile.type,
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
