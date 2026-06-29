import { createFileRoute } from "@tanstack/react-router";
import { getGalleryItemsFn } from "#/features/gallery/gallery.function";
import GalleryAdmin from "#/pages/_platform/gallery";

export const Route = createFileRoute("/(platform)/admin/gallery")({
	loader: async () => {
		const galleryItems = await getGalleryItemsFn();

		return {
			galleryItems,
		};
	},

	component: RouteComponent,
});

function RouteComponent() {
	const { galleryItems } = Route.useLoaderData();

	return <GalleryAdmin galleryItems={galleryItems} />;
}
