import { TitleText } from "#/components/title-text";
import type { ProfileSettings } from "./components/profile-settings-form";
import { ProfileSettingsForm } from "./components/profile-settings-form";
import { type SkillItem, SkillsTable } from "./components/skills-table";

type SettingsAdminProps = {
	profile: ProfileSettings;
	skills: SkillItem[];
};

export default function SettingsAdmin({ profile, skills }: SettingsAdminProps) {
	return (
		<section className="flex flex-col gap-4">
			<TitleText>Configuration</TitleText>
			<ProfileSettingsForm profile={profile} />
			<SkillsTable data={skills} />
		</section>
	);
}
