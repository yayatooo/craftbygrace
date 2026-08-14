import { Safari } from "#/components/ui/safari";
import type { PublicArchivesData } from "#/features/archives/archives.services";

type Project = PublicArchivesData["projects"][number];

function displayUrl(value: string | null) {
	if (!value) return "Project preview";

	try {
		return new URL(value).hostname.replace(/^www\./, "");
	} catch {
		return value;
	}
}

function ProjectPreview({ project }: { project: Project }) {
	const href = project.demoLink || project.repoLink;
	const content = (
		<>
			<Safari
				url={displayUrl(href)}
				imageSrc={project.thumbnail ?? undefined}
				className="transition duration-300 group-hover:scale-[1.02] group-hover:blur-sm group-focus-within:scale-[1.02] group-focus-within:blur-sm"
			/>
			<div className="pointer-events-none absolute inset-0 flex items-end bg-linear-to-t from-background/95 via-background/50 to-transparent p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
				<div className="min-w-0">
					<h2 className="font-semibold">{project.name}</h2>
					<p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
						{project.description}
					</p>
					{project.techStack.length > 0 && (
						<p className="mt-2 truncate text-xs text-muted-foreground">
							{project.techStack.join(" · ")}
						</p>
					)}
				</div>
			</div>
		</>
	);

	const className =
		"group relative block overflow-hidden rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-ring";

	return href ? (
		<a
			href={href}
			target="_blank"
			rel="noreferrer"
			aria-label={`Open ${project.name}`}
			className={className}
		>
			{content}
		</a>
	) : (
		<article className={className}>{content}</article>
	);
}

export function ArchivesProject({
	projects,
}: {
	projects: PublicArchivesData["projects"];
}) {
	return (
		<section>
			<h1 className="text-base font-semibold sm:text-lg">My archives so far</h1>
			<p className="py-2 text-muted-foreground">
				I believe in documenting every achievement, no matter how small. To me,
				each milestone represents the hard work that has brought me to where I
				am today and, insya allah, will carry me to even greater heights.
			</p>
			<section className="py-8" aria-label="Projects">
				{projects.length > 0 ? (
					<div className="grid gap-4 sm:grid-cols-2">
						{projects.map((project) => (
							<ProjectPreview key={project.id} project={project} />
						))}
					</div>
				) : (
					<div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
						No public projects have been added yet.
					</div>
				)}
			</section>
		</section>
	);
}
