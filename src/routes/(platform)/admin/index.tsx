import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(platform)/admin/")({
  beforeLoad: () => {
    throw redirect({
      to: "/admin/dashboard",
    });
  },
});
