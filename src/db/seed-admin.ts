import "dotenv/config";

import { isAPIError } from "better-auth/api";

import { auth } from "#/lib/auth";

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

async function seedAdmin() {
  const name = requiredEnv("ADMIN_NAME");
  const email = requiredEnv("ADMIN_EMAIL");
  const password = requiredEnv("ADMIN_PASSWORD");

  try {
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    console.log("✓ Admin user created successfully");
    console.log(`  Name: ${result.user.name}`);
    console.log(`  Email: ${result.user.email}`);
  } catch (error) {
    if (isAPIError(error)) {
      if (
        error.message.toLowerCase().includes("already") ||
        error.status === 422
      ) {
        console.log("ℹ Admin user already exists");
        return;
      }

      console.error("✗ Failed to create admin user");
      console.error(error.message);
      process.exitCode = 1;
      return;
    }

    console.error("✗ Unexpected error while creating admin user");
    console.error(error);
    process.exitCode = 1;
  }
}

void seedAdmin();
