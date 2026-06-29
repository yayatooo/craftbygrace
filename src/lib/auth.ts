import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "#/db";
import { users } from "#/db/schema";
import { tanstackStartCookies } from "better-auth/tanstack-start";

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const auth = betterAuth({
  secret: requiredEnv("BETTER_AUTH_SECRET"),
  baseURL: requiredEnv("BETTER_AUTH_URL"),

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      users,
    },
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [tanstackStartCookies()],
});
