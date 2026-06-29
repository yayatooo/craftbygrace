import { createServerFn } from "@tanstack/react-start";

import { requireOwnerMiddleware } from "#/features/auth/auth.middleware";

import {
	createGalleryItemSchema,
	galleryItemIdSchema,
	toggleGalleryItemActiveSchema,
	updateGalleryItemSchema,
} from "./gallery.schema";
import {
	createGalleryItem,
	deleteGalleryItem,
	getGalleryItems,
	setGalleryItemActive,
	updateGalleryItem,
} from "./gallery.services";

export const getGalleryItemsFn = createServerFn({
	method: "GET",
})
	.middleware([requireOwnerMiddleware])
	.handler(async () => {
		return getGalleryItems();
	});

export const createGalleryItemFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(createGalleryItemSchema)
	.handler(async ({ data }) => {
		return createGalleryItem(data);
	});

export const updateGalleryItemFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(updateGalleryItemSchema)
	.handler(async ({ data }) => {
		return updateGalleryItem(data.id, data.data);
	});

export const deleteGalleryItemFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(galleryItemIdSchema)
	.handler(async ({ data }) => {
		return deleteGalleryItem(data.id);
	});

export const toggleGalleryItemActiveFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(toggleGalleryItemActiveSchema)
	.handler(async ({ data }) => {
		return setGalleryItemActive(data.id, data.isActive);
	});
