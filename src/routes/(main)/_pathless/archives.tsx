import { createFileRoute } from "@tanstack/react-router";
import { getPublicArchivesDataFn } from "#/features/archives/archives.function";
import { ArchivesPath } from "#/pages/_main/archives-path";
import { ArchivesProject } from "#/pages/_main/archives-project";
import { ArchivesSkeleton } from "#/pages/_main/archives-skeleton";
import { MotionReveal } from "#/pages/_main/components/motion-reveal";

export const Route = createFileRoute("/(main)/_pathless/archives")({
	loader: () => getPublicArchivesDataFn(),
	staleTime: 60_000,
	pendingMs: 200,
	pendingMinMs: 300,
	pendingComponent: ArchivesSkeleton,
	errorComponent: ArchivesError,
	component: RouteComponent,
});

function RouteComponent() {
	const data = Route.useLoaderData();

	return (
		<div id="archives">
			<main>
				<MotionReveal priority>
					<ArchivesProject projects={data.projects} />
				</MotionReveal>
				<MotionReveal delay={0.05}>
					<ArchivesPath experiences={data.experiences} />
				</MotionReveal>
			</main>
		</div>
	);
}

function ArchivesError({ reset }: { reset: () => void }) {
	return (
		<div className="rounded-lg border border-border bg-card p-6 text-center">
			<h1 className="font-semibold">Couldn&apos;t load the archives</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				The archive data is temporarily unavailable. Please try again.
			</p>
			<button
				type="button"
				onClick={reset}
				className="mt-4 text-sm font-medium underline underline-offset-4"
			>
				Try again
			</button>
		</div>
	);
}
