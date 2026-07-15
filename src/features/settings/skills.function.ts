import { createServerFn } from "@tanstack/react-start";

import { requireOwnerMiddleware } from "#/features/auth/auth.middleware";

import {
	createSkillSchema,
	skillIdSchema,
	toggleSkillActiveSchema,
	updateSkillSchema,
} from "./skills.schema";
import {
	createSkill,
	deleteSkill,
	getSkillBySlugExcludingId,
	getSkills,
	setSkillActive,
	updateSkill,
} from "./skills.services";

export const getSkillsFn = createServerFn({
	method: "GET",
})
	.middleware([requireOwnerMiddleware])
	.handler(async () => {
		return getSkills();
	});

export const createSkillFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(createSkillSchema)
	.handler(async ({ data }) => {
		const duplicateSkill = await getSkillBySlugExcludingId(data.slug);

		if (duplicateSkill) {
			throw new Error("Skill slug is already taken.");
		}

		return createSkill(data);
	});

export const updateSkillFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(updateSkillSchema)
	.handler(async ({ data }) => {
		const duplicateSkill = await getSkillBySlugExcludingId(
			data.data.slug,
			data.id,
		);

		if (duplicateSkill) {
			throw new Error("Skill slug is already taken.");
		}

		return updateSkill(data.id, data.data);
	});

export const deleteSkillFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(skillIdSchema)
	.handler(async ({ data }) => {
		return deleteSkill(data.id);
	});

export const toggleSkillActiveFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(toggleSkillActiveSchema)
	.handler(async ({ data }) => {
		return setSkillActive(data.id, data.isActive);
	});
