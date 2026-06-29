import { asc, desc, eq } from "drizzle-orm";

import { db } from "#/db";
import { songs } from "#/db/schema";

import type { SongInput } from "./songs.schema";

export async function getSongs() {
	return db
		.select()
		.from(songs)
		.orderBy(asc(songs.order), desc(songs.createdAt));
}

export async function createSong(data: SongInput) {
	const [song] = await db
		.insert(songs)
		.values({
			name: data.name,
			writer: data.writer,
			image: data.image,
			link: data.link,
			isActive: data.isActive,
			order: data.order,
		})
		.returning();

	return song;
}

export async function updateSong(id: string, data: SongInput) {
	const [song] = await db
		.update(songs)
		.set({
			name: data.name,
			writer: data.writer,
			image: data.image,
			link: data.link,
			isActive: data.isActive,
			order: data.order,
			updatedAt: new Date(),
		})
		.where(eq(songs.id, id))
		.returning();

	return song;
}

export async function deleteSong(id: string) {
	const [song] = await db.delete(songs).where(eq(songs.id, id)).returning({
		id: songs.id,
	});

	return song;
}

export async function setSongActive(id: string, isActive: boolean) {
	const [song] = await db
		.update(songs)
		.set({
			isActive,
			updatedAt: new Date(),
		})
		.where(eq(songs.id, id))
		.returning();

	return song;
}
