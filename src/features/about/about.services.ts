import { asc, desc, eq } from "drizzle-orm";

import { db } from "#/db";
import { gallery, movies, skills, songs } from "#/db/schema";
import { getPublicProfile } from "#/features/settings/settings.services";

export async function getPublicAboutData() {
	const [profile, activeSkills, activeSongs, activeMovies, activeGalleryItems] =
		await Promise.all([
			getPublicProfile(),
			db
				.select({
					id: skills.id,
					name: skills.name,
					icon: skills.icon,
				})
				.from(skills)
				.where(eq(skills.isActive, true))
				.orderBy(asc(skills.order), desc(skills.createdAt)),
			db
				.select({
					id: songs.id,
					name: songs.name,
					writer: songs.writer,
					image: songs.image,
					link: songs.link,
				})
				.from(songs)
				.where(eq(songs.isActive, true))
				.orderBy(asc(songs.order), desc(songs.createdAt)),
			db
				.select({
					id: movies.id,
					name: movies.name,
					type: movies.type,
					image: movies.image,
					link: movies.link,
				})
				.from(movies)
				.where(eq(movies.isActive, true))
				.orderBy(asc(movies.order), desc(movies.createdAt)),
			db
				.select({
					id: gallery.id,
					name: gallery.name,
					image: gallery.image,
					alt: gallery.alt,
				})
				.from(gallery)
				.where(eq(gallery.isActive, true))
				.orderBy(asc(gallery.order), desc(gallery.createdAt)),
		]);

	return {
		profile,
		skills: activeSkills,
		songs: activeSongs,
		movies: activeMovies,
		galleryItems: activeGalleryItems,
	};
}

export type PublicAboutData = Awaited<ReturnType<typeof getPublicAboutData>>;
