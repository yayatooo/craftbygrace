import { TitleText } from "#/components/title-text";
import { ProjectFormCard } from "./project-form-card";
import { ProjectTable } from "./project-table";

type ProjectsAdminProps = {
	projects?: Array<{
		id: string;
		thumbnail: string | null;
		name: string;
		slug: string;
		description: string;
		techStack: string[];
		isCurrent: boolean;
		isSecret: boolean;
		isActive: boolean;
		demoLink: string | null;
		repoLink: string | null;
		order: number;
		createdAt: Date;
		updatedAt: Date;
	}>;
};

export default function ProjectsAdmin({ projects = [] }: ProjectsAdminProps) {
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

				<ProjectTable data={projects} />
			</div>
		</div>
	);
}
