import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(main)/_pathless/blog")({
	component: Outlet,
});
