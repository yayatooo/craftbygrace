import { createMiddleware } from "@tanstack/react-start";
import { getCurrentAuth } from "./auth.server";

export const requireOwnerMiddleware = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  const currentAuth = await getCurrentAuth();

  if (!currentAuth) {
    throw new Error("Unauthorized");
  }

  if (!currentAuth.isOwner) {
    throw new Error("Forbidden");
  }

  return next({
    context: {
      user: currentAuth.user,
    },
  });
});
