import { and, eq, ne } from "drizzle-orm";

import { db } from "#/db";
import { user } from "#/db/schema";

import type { UpdateProfileSettingsInput } from "./settings.schema";

export async function getProfileSettingsByUserId(userId: string) {
	const [profile] = await db
		.select({
			name: user.name,
			image: user.image,
			username: user.username,
			headline: user.headline,
			bio: user.bio,
			isVerified: user.isVerified,
			updatedAt: user.updatedAt,
		})
		.from(user)
		.where(eq(user.id, userId))
		.limit(1);

	return profile ?? null;
}

export async function getUserByUsernameExcludingOwner(
	username: string,
	userId: string,
) {
	const [existingUser] = await db
		.select({
			id: user.id,
		})
		.from(user)
		.where(and(eq(user.username, username), ne(user.id, userId)))
		.limit(1);

	return existingUser ?? null;
}

export async function updateProfileSettingsByUserId(
	userId: string,
	data: UpdateProfileSettingsInput,
) {
	return db.transaction(async (tx) => {
		const [currentProfile] = await tx
			.select({
				imageKey: user.imageKey,
			})
			.from(user)
			.where(eq(user.id, userId))
			.limit(1);

		if (!currentProfile) {
			throw new Error("Profile not found.");
		}

		const [profile] = await tx
			.update(user)
			.set({
				name: data.name,
				image: data.image,
				imageKey:
					data.imageKey === undefined ? currentProfile.imageKey : data.imageKey,
				username: data.username,
				headline: data.headline,
				bio: data.bio,
				isVerified: data.isVerified,
				updatedAt: new Date(),
			})
			.where(eq(user.id, userId))
			.returning({
				name: user.name,
				image: user.image,
				username: user.username,
				headline: user.headline,
				bio: user.bio,
				isVerified: user.isVerified,
				updatedAt: user.updatedAt,
			});

		return {
			profile,
			previousImageKey: currentProfile.imageKey,
		};
	});
}
