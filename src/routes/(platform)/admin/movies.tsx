import { createFileRoute } from "@tanstack/react-router";
import { getMoviesFn } from "#/features/movies/movies.function";
import MoviesAdmin from "#/pages/_platform/movies";

export const Route = createFileRoute("/(platform)/admin/movies")({
	loader: async () => {
		const movies = await getMoviesFn();

		return {
			movies,
		};
	},

	component: RouteComponent,
});

function RouteComponent() {
	const { movies } = Route.useLoaderData();

	return <MoviesAdmin movies={movies} />;
}
