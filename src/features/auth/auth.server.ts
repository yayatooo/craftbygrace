import { getRequestHeaders } from "@tanstack/react-start/server";

import { auth } from "#/lib/auth";

function getAdminEmail() {
  const email = process.env.ADMIN_EMAIL;

  if (!email) {
    throw new Error("ADMIN_EMAIL is missing");
  }

  return email.toLowerCase();
}

export async function getCurrentAuth() {
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
  });

  if (!session) {
    return null;
  }

  return {
    user: session.user,
    isOwner: session.user.email.toLowerCase() === getAdminEmail(),
  };
}
