import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { getDatabaseScopeValue, getDb } from "#/db";
import { account, session, user, verification } from "#/db/schema";

const authScopeKey = Symbol("auth");

function requiredEnv(name: string) {
	const value = process.env[name];

	if (!value) {
		throw new Error(`Missing environment variable: ${name}`);
	}

	return value;
}

function createAuth() {
	return betterAuth({
		secret: requiredEnv("BETTER_AUTH_SECRET"),
		baseURL: requiredEnv("BETTER_AUTH_URL"),

		database: drizzleAdapter(getDb(), {
			provider: "pg",
			schema: {
				user,
				session,
				account,
				verification,
			},
		}),

		emailAndPassword: {
			enabled: true,
		},

		plugins: [tanstackStartCookies()],
	});
}

export function getAuth() {
	return getDatabaseScopeValue(authScopeKey, createAuth);
}
