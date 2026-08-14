import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "#/components/ui/skeleton";
import { getPublicHomeDataFn } from "#/features/home/home.function";
import Connect from "#/pages/_main/components/connect";
import { MotionReveal } from "#/pages/_main/components/motion-reveal";
import { Banner } from "#/pages/_main/home-banner";
import { ProjectCard } from "#/pages/_main/home-project-card";
import TimelineWorkflow from "#/pages/_main/home-timeline-workflow";
import { TrustedBy } from "#/pages/_main/home-trusted-by";

export const Route = createFileRoute("/(main)/_pathless/")({
	loader: () => getPublicHomeDataFn(),
	staleTime: 60_000,
	pendingMs: 200,
	pendingMinMs: 300,
	pendingComponent: HomeSkeleton,
	errorComponent: HomeError,
	component: Home,
});

function Home() {
	const data = Route.useLoaderData();

	return (
		<div>
			<main>
				<MotionReveal priority>
					<Banner profile={data.profile} />
				</MotionReveal>
				<MotionReveal priority>
					<ProjectCard project={data.currentProject} />
				</MotionReveal>
				<MotionReveal delay={0.04}>
					<TrustedBy />
				</MotionReveal>
				<MotionReveal delay={0.04}>
					<TimelineWorkflow />
				</MotionReveal>
				<MotionReveal delay={0.04}>
					<Connect />
				</MotionReveal>
			</main>
		</div>
	);
}

function HomeSkeleton() {
	return (
		<output className="block space-y-6" aria-label="Loading homepage">
			<div className="flex items-center gap-3">
				<Skeleton className="size-15 rounded-full" />
				<div className="flex-1 space-y-2">
					<Skeleton className="h-6 w-40" />
					<Skeleton className="h-4 w-32" />
				</div>
			</div>
			<div className="space-y-2">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-4/5" />
			</div>
			<div className="space-y-4 pt-6">
				<Skeleton className="h-6 w-32" />
				<Skeleton className="aspect-[1203/753] w-full rounded-lg" />
				<Skeleton className="h-9 w-full" />
			</div>
		</output>
	);
}

function HomeError({ reset }: { reset: () => void }) {
	return (
		<div className="rounded-lg border border-border bg-card p-6 text-center">
			<h1 className="font-semibold">Couldn&apos;t load the homepage</h1>
			<p className="mt-1 text-sm text-muted-foreground">Please try again.</p>
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
