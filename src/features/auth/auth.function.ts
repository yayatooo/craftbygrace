import { createServerFn } from "@tanstack/react-start";
import { databaseMiddleware } from "./auth.middleware";
import { getCurrentAuth } from "./auth.server";

export const getCurrentAuthFn = createServerFn({
	method: "GET",
})
	.middleware([databaseMiddleware])
	.handler(async () => {
		return getCurrentAuth();
	});
