import { createServerFn } from "@tanstack/react-start";

import { databaseMiddleware } from "#/features/auth/auth.middleware";

import { getPublicArchivesData } from "./archives.services";

export const getPublicArchivesDataFn = createServerFn({
	method: "GET",
})
	.middleware([databaseMiddleware])
	.handler(async () => getPublicArchivesData());
