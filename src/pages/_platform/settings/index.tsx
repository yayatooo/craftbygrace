import { TitleText } from "#/components/title-text";
import { ProfileSettingsForm } from "./components/profile-settings-form";
import type { ProfileSettings } from "./components/profile-settings-form";
import { SkillsTable, type SkillItem } from "./components/skills-table";

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
