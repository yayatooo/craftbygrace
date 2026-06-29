import { createFileRoute } from "@tanstack/react-router";
import { getSongsFn } from "#/features/songs/songs.function";
import SongsAdmin from "#/pages/_platform/songs";

export const Route = createFileRoute("/(platform)/admin/songs")({
	loader: async () => {
		const songs = await getSongsFn();

		return {
			songs,
		};
	},

	component: RouteComponent,
});

function RouteComponent() {
	const { songs } = Route.useLoaderData();

	return <SongsAdmin songs={songs} />;
}
