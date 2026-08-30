import { createFileRoute } from "@tanstack/react-router";
import { getProfileSettingsFn } from "#/features/settings/settings.function";
import { getSkillsFn } from "#/features/settings/skills.function";
import SettingsAdmin from "#/pages/_platform/settings";

export const Route = createFileRoute("/(platform)/admin/settings")({
	loader: async () => {
		const [profile, skills] = await Promise.all([
			getProfileSettingsFn(),
			getSkillsFn(),
		]);

		return {
			profile,
			skills,
		};
	},

	component: RouteComponent,
});

function RouteComponent() {
	const { profile, skills } = Route.useLoaderData();

	return <SettingsAdmin profile={profile} skills={skills} />;
}
