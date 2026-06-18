import GalleryAdmin from "#/pages/_platform/gallery";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(platform)/admin/gallery")({
  component: RouteComponent,
});

function RouteComponent() {
  return <GalleryAdmin />;
}
