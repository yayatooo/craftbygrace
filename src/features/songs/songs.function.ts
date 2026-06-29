import { createServerFn } from "@tanstack/react-start";

import { requireOwnerMiddleware } from "#/features/auth/auth.middleware";
import {
	createSongSchema,
	songIdSchema,
	toggleSongActiveSchema,
	updateSongSchema,
} from "./songs.schema";
import {
	createSong,
	deleteSong,
	getSongs,
	setSongActive,
	updateSong,
} from "./songs.services";

export const getSongsFn = createServerFn({
	method: "GET",
})
	.middleware([requireOwnerMiddleware])
	.handler(async () => {
		return getSongs();
	});

export const createSongFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(createSongSchema)
	.handler(async ({ data }) => {
		return createSong(data);
	});

export const updateSongFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(updateSongSchema)
	.handler(async ({ data }) => {
		return updateSong(data.id, data.data);
	});

export const deleteSongFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(songIdSchema)
	.handler(async ({ data }) => {
		return deleteSong(data.id);
	});

export const toggleSongActiveFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(toggleSongActiveSchema)
	.handler(async ({ data }) => {
		return setSongActive(data.id, data.isActive);
	});
