import "dotenv/config";

import { sql } from "drizzle-orm";

import { db } from "./index";

type DatabaseConnectionResult = {
  database: string;
  username: string;
  connectedAt: string;
};

async function testDatabaseConnection() {
  try {
    const result = await db.execute<DatabaseConnectionResult>(
      sql`
        select
          current_database() as "database",
          current_user as "username",
          now() as "connectedAt"
      `,
    );

    const connection = result.rows[0];

    if (!connection) {
      throw new Error("Database returned no connection result");
    }

    console.log("✓ Database connection successful");
    console.log(`  Database: ${connection.database}`);
    console.log(`  User: ${connection.username}`);
    console.log(
      `  Connected at: ${new Date(connection.connectedAt).toISOString()}`,
    );
  } catch (error) {
    console.error("✗ Database connection failed");
    console.error(error);

    process.exitCode = 1;
  }
}

void testDatabaseConnection();
