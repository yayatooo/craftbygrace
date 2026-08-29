import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL is not defined");
}

export const db = drizzle({
	connection: {
		connectionString: databaseUrl,
		max: 1,
		maxUses: 1,
		idleTimeoutMillis: 5_000,
	},
	schema,
});
