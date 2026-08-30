import { createServerFn } from "@tanstack/react-start";

import { databaseMiddleware } from "#/features/auth/auth.middleware";

import { getPublicHomeData } from "./home.services";

export const getPublicHomeDataFn = createServerFn({ method: "GET" })
	.middleware([databaseMiddleware])
	.handler(async () => getPublicHomeData());
