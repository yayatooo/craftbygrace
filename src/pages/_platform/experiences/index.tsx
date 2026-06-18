import { TitleText } from "#/components/title-text";
import { ExperienceFormCard } from "./experience-form-card";
import { ExperienceTable } from "./experience-table";

export default function ExperiencesAdmin() {
  return (
    <div className="w-full space-y-6">
      <div>
        <TitleText>Experiences</TitleText>
        <p className="text-sm text-muted-foreground">
          Manage your professional path, work history, and current roles.
        </p>
      </div>

      <ExperienceFormCard />

      <div className="space-y-3">
        <div>
          <h2 className="text-base font-semibold">Experience List</h2>
          <p className="text-sm text-muted-foreground">
            Preview your saved experience entries before connecting the
            database.
          </p>
        </div>

        <ExperienceTable />
      </div>
    </div>
  );
}
