import { TitleText } from "#/components/title-text";
import { ProjectFormCard } from "./project-form-card";
import { ProjectTable } from "./project-table";

export default function ProjectsAdmin() {
  return (
    <div className="w-full space-y-6">
      <div>
        <TitleText>Projects</TitleText>
        <p className="text-sm text-muted-foreground">
          Manage portfolio projects, current work, tech stack, and private NDA
          projects.
        </p>
      </div>

      <ProjectFormCard />

      <div className="space-y-3">
        <div>
          <h2 className="text-base font-semibold">Project List</h2>
          <p className="text-sm text-muted-foreground">
            Preview your saved project entries before connecting the database.
          </p>
        </div>

        <ProjectTable />
      </div>
    </div>
  );
}
