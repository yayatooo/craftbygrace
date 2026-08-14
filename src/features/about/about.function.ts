import { createServerFn } from "@tanstack/react-start";

import { getPublicAboutData } from "./about.services";

export const getPublicAboutDataFn = createServerFn({ method: "GET" }).handler(
	async () => getPublicAboutData(),
);
