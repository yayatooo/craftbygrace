import { createServerFn } from "@tanstack/react-start";

import { databaseMiddleware } from "#/features/auth/auth.middleware";

import { getPublicAboutData } from "./about.services";

export const getPublicAboutDataFn = createServerFn({ method: "GET" })
	.middleware([databaseMiddleware])
	.handler(async () => getPublicAboutData());
