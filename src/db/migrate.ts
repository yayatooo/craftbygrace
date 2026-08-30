import "dotenv/config";

import { migrate } from "drizzle-orm/node-postgres/migrator";

import { withDatabase } from "./index";

async function runMigrations() {
	try {
		console.log("→ Running database migrations...");

		await withDatabase(async (db) => {
			await migrate(db, {
				migrationsFolder: "./drizzle",
			});
		});

		console.log("✓ Database migrations completed successfully");
	} catch (error) {
		console.error("✗ Database migration failed");
		console.error(error);

		process.exitCode = 1;
	}
}

void runMigrations();
