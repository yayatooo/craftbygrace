import BlogsAdmin from "#/pages/_platform/blogs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(platform)/admin/blogs")({
  component: RouteComponent,
});

function RouteComponent() {
  return <BlogsAdmin />;
}
