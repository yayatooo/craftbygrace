import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText } from "lucide-react";

import { Skeleton } from "#/components/ui/skeleton";
import { getPublishedBlogsFn } from "#/features/blogs/blogs.function";
import { MotionReveal } from "#/pages/_main/components/motion-reveal";

export const Route = createFileRoute("/(main)/_pathless/blog/")({
	loader: () => getPublishedBlogsFn(),
	staleTime: 60_000,
	pendingMs: 200,
	pendingMinMs: 300,
	pendingComponent: BlogListSkeleton,
	errorComponent: BlogListError,
	component: RouteComponent,
});

const dateFormatter = new Intl.DateTimeFormat("en", {
	day: "numeric",
	month: "short",
	year: "numeric",
	timeZone: "UTC",
});

function RouteComponent() {
	const posts = Route.useLoaderData();

	return (
		<main>
			<MotionReveal priority>
				<h1 className="text-base font-semibold sm:text-lg">Blog</h1>
				<p className="py-2 text-muted-foreground">
					Writing may not be my strongest suit, but sharing is something I love
					to do. Here, you will find a collection of thoughts, lessons, and
					small discoveries from my mind—shared in the hope that someone out
					there finds them useful.
				</p>
			</MotionReveal>
			{posts.length > 0 ? (
				<section className="grid gap-6 py-8 sm:grid-cols-2" aria-label="Posts">
					{posts.map((post, index) => (
						<MotionReveal
							key={post.id}
							priority={index < 2}
							delay={Math.min(index * 0.03, 0.12)}
						>
							<Link
								to="/blog/$slug"
								params={{ slug: post.slug }}
								className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							>
								<div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-lg border border-border bg-secondary">
									{post.coverImage ? (
										<img
											src={post.coverImage}
											alt=""
											className="h-full w-full object-cover grayscale transition duration-300 group-hover:scale-105 group-hover:grayscale-0 group-focus-visible:scale-105 group-focus-visible:grayscale-0"
											loading={index < 2 ? "eager" : "lazy"}
											fetchPriority={index === 0 ? "high" : "auto"}
											decoding="async"
										/>
									) : (
										<FileText
											className="size-10 text-muted-foreground"
											aria-hidden="true"
										/>
									)}
								</div>
								<div className="mt-3 space-y-2">
									<div className="flex items-start justify-between gap-4 text-foreground transition-colors duration-200 group-hover:text-primary group-focus-visible:text-primary">
										<h2 className="line-clamp-2 text-sm font-semibold sm:text-base">
											{post.title}
										</h2>
										<ArrowRight className="mt-0.5 size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1" />
									</div>
									{post.excerpt && (
										<p className="line-clamp-2 text-sm text-muted-foreground">
											{post.excerpt}
										</p>
									)}
									<p className="text-xs text-muted-foreground">
										{post.publishedAt
											? dateFormatter.format(new Date(post.publishedAt))
											: "Published"}
										{post.readingTime ? ` · ${post.readingTime} min read` : ""}
									</p>
								</div>
							</Link>
						</MotionReveal>
					))}
				</section>
			) : (
				<div className="my-8 rounded-lg border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
					No articles have been published yet.
				</div>
			)}
		</main>
	);
}

function BlogListSkeleton() {
	return (
		<output className="block space-y-4" aria-label="Loading blog posts">
			<Skeleton className="h-6 w-20" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-4/5" />
			<div className="grid gap-6 pt-4 sm:grid-cols-2">
				{[0, 1, 2, 3].map((item) => (
					<div key={item} className="space-y-3">
						<Skeleton className="aspect-4/3 rounded-lg" />
						<Skeleton className="h-5 w-4/5" />
						<Skeleton className="h-4 w-full" />
					</div>
				))}
			</div>
		</output>
	);
}

function BlogListError({ reset }: { reset: () => void }) {
	return (
		<div className="rounded-lg border border-border bg-card p-6 text-center">
			<h1 className="font-semibold">Couldn&apos;t load the blog</h1>
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
