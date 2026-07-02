import { createServerFn } from "@tanstack/react-start";

import { requireOwnerMiddleware } from "#/features/auth/auth.middleware";

import {
	createProjectSchema,
	projectIdSchema,
	toggleProjectActiveSchema,
	updateProjectSchema,
} from "./projects.schema";
import {
	createProject,
	deleteProject,
	getProjects,
	setProjectActive,
	updateProject,
} from "./projects.services";

export const getProjectsFn = createServerFn({
	method: "GET",
})
	.middleware([requireOwnerMiddleware])
	.handler(async () => {
		return getProjects();
	});

export const createProjectFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(createProjectSchema)
	.handler(async ({ data }) => {
		return createProject(data);
	});

export const updateProjectFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(updateProjectSchema)
	.handler(async ({ data }) => {
		return updateProject(data.id, data.data);
	});

export const deleteProjectFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(projectIdSchema)
	.handler(async ({ data }) => {
		return deleteProject(data.id);
	});

export const toggleProjectActiveFn = createServerFn({
	method: "POST",
})
	.middleware([requireOwnerMiddleware])
	.validator(toggleProjectActiveSchema)
	.handler(async ({ data }) => {
		return setProjectActive(data.id, data.isActive);
	});
