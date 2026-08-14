import { createServerFn } from "@tanstack/react-start";

import { getPublicArchivesData } from "./archives.services";

export const getPublicArchivesDataFn = createServerFn({
	method: "GET",
}).handler(async () => getPublicArchivesData());
