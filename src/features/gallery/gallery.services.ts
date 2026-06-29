import { asc, desc, eq } from "drizzle-orm";

import { db } from "#/db";
import { gallery } from "#/db/schema";

import type { GalleryInput } from "./gallery.schema";

export async function getGalleryItems() {
	return db
		.select()
		.from(gallery)
		.orderBy(asc(gallery.order), desc(gallery.createdAt));
}

export async function createGalleryItem(data: GalleryInput) {
	const [galleryItem] = await db
		.insert(gallery)
		.values({
			name: data.name,
			image: data.image,
			alt: data.alt,
			isActive: data.isActive,
			order: data.order,
		})
		.returning();

	return galleryItem;
}

export async function updateGalleryItem(id: string, data: GalleryInput) {
	const [galleryItem] = await db
		.update(gallery)
		.set({
			name: data.name,
			image: data.image,
			alt: data.alt,
			isActive: data.isActive,
			order: data.order,
			updatedAt: new Date(),
		})
		.where(eq(gallery.id, id))
		.returning();

	return galleryItem;
}

export async function deleteGalleryItem(id: string) {
	const [galleryItem] = await db
		.delete(gallery)
		.where(eq(gallery.id, id))
		.returning({
			id: gallery.id,
		});

	return galleryItem;
}

export async function setGalleryItemActive(id: string, isActive: boolean) {
	const [galleryItem] = await db
		.update(gallery)
		.set({
			isActive,
			updatedAt: new Date(),
		})
		.where(eq(gallery.id, id))
		.returning();

	return galleryItem;
}
