import { createServerFn } from "@tanstack/react-start";

import { getPublicHomeData } from "./home.services";

export const getPublicHomeDataFn = createServerFn({ method: "GET" }).handler(
	async () => getPublicHomeData(),
);
