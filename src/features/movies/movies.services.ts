import { asc, desc, eq } from "drizzle-orm";

import { getDb } from "#/db";
import { movies } from "#/db/schema";

import type { MoviesInput } from "./movies.schema";

export async function getMovies() {
	const db = getDb();

	return db
		.select()
		.from(movies)
		.orderBy(asc(movies.order), desc(movies.createdAt));
}

export async function createMovie(data: MoviesInput) {
	const db = getDb();

	const [movie] = await db
		.insert(movies)
		.values({
			name: data.name,
			type: data.type,
			image: data.image,
			link: data.link,
			isActive: data.isActive,
			order: data.order,
		})
		.returning();

	return movie;
}

export async function updateMovie(id: string, data: MoviesInput) {
	const db = getDb();

	const [movie] = await db
		.update(movies)
		.set({
			name: data.name,
			type: data.type,
			image: data.image,
			link: data.link,
			isActive: data.isActive,
			order: data.order,
			updatedAt: new Date(),
		})
		.where(eq(movies.id, id))
		.returning();

	return movie;
}

export async function deleteMovie(id: string) {
	const db = getDb();

	const [movie] = await db.delete(movies).where(eq(movies.id, id)).returning({
		id: movies.id,
	});

	return movie;
}

export async function setMovieActive(id: string, isActive: boolean) {
	const db = getDb();

	const [movie] = await db
		.update(movies)
		.set({
			isActive,
			updatedAt: new Date(),
		})
		.where(eq(movies.id, id))
		.returning();

	return movie;
}
