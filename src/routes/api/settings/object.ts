import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { createFileRoute } from "@tanstack/react-router";

import { getCurrentAuth } from "#/features/auth/auth.server";
import { r2Config, s3 } from "#/lib/s3";

function json(data: unknown, status = 200) {
	return Response.json(data, { status });
}

function isSettingsObjectKey(key: string) {
	return (
		(key.startsWith("profile/") || key.startsWith("skills/")) &&
		!key.includes("..") &&
		key.length <= 1024
	);
}

export const Route = createFileRoute("/api/settings/object")({
	server: {
		handlers: {
			DELETE: async ({ request }) => {
				const currentAuth = await getCurrentAuth();

				if (!currentAuth) {
					return json({ error: "Unauthorized" }, 401);
				}

				if (!currentAuth.isOwner) {
					return json({ error: "Forbidden" }, 403);
				}

				const body = await request.json().catch(() => null);
				const key =
					body && typeof body === "object" && "key" in body ? body.key : null;

				if (typeof key !== "string" || !isSettingsObjectKey(key)) {
					return json({ error: "Invalid R2 object key." }, 400);
				}

				await s3.send(
					new DeleteObjectCommand({
						Bucket: r2Config.bucketName,
						Key: key,
					}),
				);

				return json({
					ok: true,
				});
			},
		},
	},
});
