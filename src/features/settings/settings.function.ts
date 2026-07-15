import { createServerFn } from "@tanstack/react-start";

import { requireOwnerMiddleware } from "#/features/auth/auth.middleware";

import { updateProfileSettingsSchema } from "./settings.schema";
import {
	getProfileSettingsByUserId,
	getUserByUsernameExcludingOwner,
	updateProfileSettingsByUserId,
} from "./settings.services";

export const getProfileSettingsFn = createServerFn({
	method: "GET",
})
	.middleware([requireOwnerMiddleware])
	.handler(async ({ context }) => {
		const profile = await getProfileSettingsByUserId(context.user.id);

		if (!profile) {
			throw new Error("Profile not found.");
		}

		return profile;
	});

export const updateProfileSettingsFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(updateProfileSettingsSchema)
	.handler(async ({ context, data }) => {
		if (data.data.username) {
			const duplicateUsername = await getUserByUsernameExcludingOwner(
				data.data.username,
				context.user.id,
			);

			if (duplicateUsername) {
				throw new Error("Username is already taken.");
			}
		}

		return updateProfileSettingsByUserId(context.user.id, data.data);
	});
