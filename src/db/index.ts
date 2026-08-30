import { AsyncLocalStorage } from "node:async_hooks";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const CONNECTION_TIMEOUT_MS = 5_000;
const QUERY_TIMEOUT_MS = 10_000;

function requiredDatabaseUrl() {
	const databaseUrl = process.env.DATABASE_URL;

	if (!databaseUrl) {
		throw new Error("DATABASE_URL is not defined");
	}

	return databaseUrl;
}

function createDatabaseResources() {
	const pool = new Pool({
		connectionString: requiredDatabaseUrl(),
		max: 1,
		connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
		query_timeout: QUERY_TIMEOUT_MS,
		statement_timeout: QUERY_TIMEOUT_MS,
	});

	return {
		database: drizzle(pool, { schema }),
		pool,
		values: new Map<symbol, unknown>(),
	};
}

type DatabaseScope = ReturnType<typeof createDatabaseResources>;

const databaseStorage = new AsyncLocalStorage<DatabaseScope>();

function getDatabaseScope() {
	const scope = databaseStorage.getStore();

	if (!scope) {
		throw new Error("Database accessed outside a request scope");
	}

	return scope;
}

export function getDb() {
	return getDatabaseScope().database;
}

export function getDatabaseScopeValue<T>(key: symbol, createValue: () => T) {
	const values = getDatabaseScope().values;
	const existingValue = values.get(key);

	if (existingValue !== undefined) {
		return existingValue as T;
	}

	const value = createValue();
	values.set(key, value);

	return value;
}

export async function withDatabase<T>(
	callback: (database: DatabaseScope["database"]) => Promise<T>,
) {
	const existingScope = databaseStorage.getStore();

	if (existingScope) {
		return callback(existingScope.database);
	}

	const scope = createDatabaseResources();

	try {
		return await databaseStorage.run(scope, () => callback(scope.database));
	} finally {
		await scope.pool.end();
	}
}
