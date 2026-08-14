import { createFileRoute } from "@tanstack/react-router";
import { getPublicAboutDataFn } from "#/features/about/about.function";
import { AboutSection } from "#/pages/_main/about-section";
import { AboutPageSkeleton } from "#/pages/_main/about-skeleton";
import { CardProfile } from "#/pages/_main/components/card-profile";
import { MotionReveal } from "#/pages/_main/components/motion-reveal";

export const Route = createFileRoute("/(main)/_pathless/about")({
	loader: () => getPublicAboutDataFn(),
	staleTime: 60_000,
	pendingMs: 200,
	pendingMinMs: 300,
	pendingComponent: AboutPageSkeleton,
	errorComponent: AboutPageError,
	component: RouteComponent,
});

function RouteComponent() {
	const aboutData = Route.useLoaderData();

	return (
		<div>
			<main>
				<MotionReveal>
					<CardProfile />
				</MotionReveal>
				<MotionReveal>
					<AboutSection data={aboutData} />
				</MotionReveal>
			</main>
		</div>
	);
}

function AboutPageError({ reset }: { reset: () => void }) {
	return (
		<div className="rounded-lg border border-border bg-card p-6 text-center">
			<h1 className="font-semibold">Couldn&apos;t load the about page</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				The content is temporarily unavailable. Please try again.
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
