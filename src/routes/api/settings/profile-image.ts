import { createFileRoute } from "@tanstack/react-router";

import { getCurrentAuth } from "#/features/auth/auth.server";
import { createObjectKey, getPublicUrl, getR2Bucket } from "#/lib/s3";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedImageTypes = new Set(["image/png", "image/jpeg", "image/webp"]);

function json(data: unknown, status = 200) {
	return Response.json(data, { status });
}

export const Route = createFileRoute("/api/settings/profile-image")({
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
				const profileFile = formData.get("profileFile");

				if (!(profileFile instanceof File)) {
					return json({ error: "Missing profile photo file." }, 400);
				}

				if (!allowedImageTypes.has(profileFile.type)) {
					return json(
						{ error: "Profile photo must be a PNG, JPG, or WEBP image." },
						400,
					);
				}

				if (profileFile.size > MAX_FILE_SIZE) {
					return json({ error: "Profile photo must be 5 MB or smaller." }, 400);
				}

				const key = createObjectKey({
					folder: "profile",
					entityId: currentAuth.user.id,
					fileName: profileFile.name,
				});
				const body = new Uint8Array(await profileFile.arrayBuffer());

				await getR2Bucket().put(key, body, {
					httpMetadata: {
						contentType: profileFile.type,
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
