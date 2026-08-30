import { createServerFn } from "@tanstack/react-start";
import { getCurrentAuth } from "./auth.server";

export const getCurrentAuthFn = createServerFn({
	method: "GET",
}).handler(async () => {
	return getCurrentAuth();
});
