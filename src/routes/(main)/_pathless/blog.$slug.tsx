import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Badge } from "#/components/ui/badge";
import { Skeleton } from "#/components/ui/skeleton";
import { getPublishedBlogBySlugFn } from "#/features/blogs/blogs.function";

export const Route = createFileRoute("/(main)/_pathless/blog/$slug")({
	loader: async ({ params }) => {
		const post = await getPublishedBlogBySlugFn({
			data: { slug: params.slug },
		});

		if (!post) throw notFound();

		return post;
	},
	head: ({ loaderData }) => ({
		meta: loaderData
			? [
					{ title: `${loaderData.title} · Craft by Grace` },
					{
						name: "description",
						content:
							loaderData.excerpt ??
							`Read ${loaderData.title} on Craft by Grace.`,
					},
					{ property: "og:title", content: loaderData.title },
					{
						property: "og:description",
						content: loaderData.excerpt ?? loaderData.title,
					},
					...(loaderData.coverImage
						? [{ property: "og:image", content: loaderData.coverImage }]
						: []),
				]
			: [],
	}),
	staleTime: 60_000,
	pendingMs: 200,
	pendingMinMs: 300,
	pendingComponent: BlogPostSkeleton,
	notFoundComponent: BlogPostNotFound,
	errorComponent: BlogPostError,
	component: BlogPostPage,
});

const dateFormatter = new Intl.DateTimeFormat("en", {
	day: "numeric",
	month: "long",
	year: "numeric",
	timeZone: "UTC",
});

function BlogPostPage() {
	const post = Route.useLoaderData();

	return (
		<main>
			<Link
				to="/blog"
				className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
			>
				<ArrowLeft className="size-4" aria-hidden="true" />
				All posts
			</Link>

			<article className="pt-8">
				<header>
					{post.tags.length > 0 && (
						<div className="mb-4 flex flex-wrap gap-2">
							{post.tags.map((tag) => (
								<Badge key={tag} variant="secondary">
									{tag}
								</Badge>
							))}
						</div>
					)}
					<h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
						{post.title}
					</h1>
					{post.excerpt && (
						<p className="mt-4 text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
							{post.excerpt}
						</p>
					)}
					<div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
						{post.publishedAt && (
							<span className="inline-flex items-center gap-1.5">
								<CalendarDays className="size-4" aria-hidden="true" />
								<time dateTime={new Date(post.publishedAt).toISOString()}>
									{dateFormatter.format(new Date(post.publishedAt))}
								</time>
							</span>
						)}
						{post.readingTime && (
							<span className="inline-flex items-center gap-1.5">
								<Clock3 className="size-4" aria-hidden="true" />
								{post.readingTime} min read
							</span>
						)}
					</div>
				</header>

				{post.coverImage && (
					<img
						src={post.coverImage}
						alt=""
						className="mt-8 aspect-video w-full rounded-xl border border-border object-cover"
						fetchPriority="high"
						decoding="async"
					/>
				)}

				<div className="prose prose-zinc mt-10 max-w-none dark:prose-invert prose-a:text-primary prose-img:rounded-lg prose-img:border prose-img:border-border">
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						skipHtml
						components={{
							a: ({ href, children, ...props }) => {
								const isExternal = href?.startsWith("http");

								return (
									<a
										href={href}
										target={isExternal ? "_blank" : undefined}
										rel={isExternal ? "noreferrer" : undefined}
										{...props}
									>
										{children}
									</a>
								);
							},
						}}
					>
						{post.content}
					</ReactMarkdown>
				</div>
			</article>
		</main>
	);
}

function BlogPostSkeleton() {
	return (
		<output className="block space-y-5" aria-label="Loading article">
			<Skeleton className="h-4 w-24" />
			<div className="space-y-4 pt-6">
				<Skeleton className="h-9 w-full" />
				<Skeleton className="h-9 w-4/5" />
				<Skeleton className="h-5 w-full" />
				<Skeleton className="h-4 w-52" />
			</div>
			<Skeleton className="aspect-video w-full rounded-xl" />
			<div className="space-y-3 pt-4">
				{[0, 1, 2, 3, 4, 5].map((item) => (
					<Skeleton key={item} className="h-4 w-full" />
				))}
			</div>
		</output>
	);
}

function BlogPostNotFound() {
	return (
		<div className="py-20 text-center">
			<h1 className="text-2xl font-semibold">Article not found</h1>
			<p className="mt-2 text-sm text-muted-foreground">
				This article may be unpublished or no longer available.
			</p>
			<Link
				to="/blog"
				className="mt-6 inline-flex text-sm font-medium underline underline-offset-4"
			>
				Back to blog
			</Link>
		</div>
	);
}

function BlogPostError({ reset }: { reset: () => void }) {
	return (
		<div className="rounded-lg border border-border bg-card p-6 text-center">
			<h1 className="font-semibold">Couldn&apos;t load this article</h1>
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
