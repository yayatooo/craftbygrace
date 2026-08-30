import { createMiddleware } from "@tanstack/react-start";
import { withDatabase } from "#/db";
import { getCurrentAuth } from "./auth.server";

export const databaseMiddleware = createMiddleware({
	type: "function",
}).server(async ({ next }) => withDatabase(async () => next()));

export const requireOwnerMiddleware = createMiddleware({
	type: "function",
})
	.middleware([databaseMiddleware])
	.server(async ({ next }) => {
		const currentAuth = await getCurrentAuth();

		if (!currentAuth) {
			throw new Error("Unauthorized");
		}

		if (!currentAuth.isOwner) {
			throw new Error("Forbidden");
		}

		return next({
			context: {
				user: currentAuth.user,
			},
		});
	});
