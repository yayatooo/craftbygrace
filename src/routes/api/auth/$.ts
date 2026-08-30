import { createFileRoute } from "@tanstack/react-router";
import { withDatabase } from "#/db";
import { getAuth } from "#/lib/auth";

function handleAuthRequest(request: Request) {
	return withDatabase(async () => getAuth().handler(request));
}

export const Route = createFileRoute("/api/auth/$")({
	server: {
		handlers: {
			GET: ({ request }) => handleAuthRequest(request),
			POST: ({ request }) => handleAuthRequest(request),
		},
	},
});
