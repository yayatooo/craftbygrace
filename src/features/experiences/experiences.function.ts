import { createServerFn } from "@tanstack/react-start";

import { requireOwnerMiddleware } from "#/features/auth/auth.middleware";

import {
	createExperienceSchema,
	experienceIdSchema,
	toggleExperienceCurrentSchema,
	updateExperienceSchema,
} from "./experiences.schema";
import {
	createExperience,
	deleteExperience,
	getExperiences,
	setExperienceCurrent,
	updateExperience,
} from "./experiences.services";

export const getExperiencesFn = createServerFn({
	method: "GET",
})
	.middleware([requireOwnerMiddleware])
	.handler(async () => {
		return getExperiences();
	});

export const createExperienceFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(createExperienceSchema)
	.handler(async ({ data }) => {
		return createExperience(data);
	});

export const updateExperienceFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(updateExperienceSchema)
	.handler(async ({ data }) => {
		return updateExperience(data.id, data.data);
	});

export const deleteExperienceFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(experienceIdSchema)
	.handler(async ({ data }) => {
		return deleteExperience(data.id);
	});

export const toggleExperienceCurrentFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(toggleExperienceCurrentSchema)
	.handler(async ({ data }) => {
		return setExperienceCurrent(data.id, data.isCurrent);
	});
