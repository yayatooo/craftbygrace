import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { MotionReveal } from "#/pages/_main/components/motion-reveal";

export const Route = createFileRoute("/(main)/_pathless/blog")({
	component: RouteComponent,
});

const posts = [
	{
		id: "blog-1",
		title: "Finding Better Ways to Build",
		imageSrc: "/blog/blog1.webp",
		href: "#",
	},
	{
		id: "blog-2",
		title: "Small Lessons From Recent Work",
		imageSrc: "/blog/blog2.webp",
		href: "#",
	},
];

function RouteComponent() {
	return (
		<main>
			<MotionReveal>
				<h1 className="text-base font-semibold sm:text-lg">Blog</h1>
				<p className="text-muted-foreground py-2">
					Writing may not be my strongest suit, but sharing is something I love
					to do. Here, you will find a collection of thoughts, lessons, and
					small discoveries from my mind—shared in the hope that someone out
					there finds them useful.
				</p>
			</MotionReveal>
			<section className="grid gap-4 py-8 sm:grid-cols-2">
				{posts.map((post, index) => (
					<MotionReveal key={post.id} delay={0.05 + index * 0.06}>
						<a
							href={post.href}
							className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							<div className="aspect-4/3 overflow-hidden rounded-lg">
								<img
									src={post.imageSrc}
									alt=""
									className="h-full w-full object-cover grayscale transition duration-300 group-hover:scale-105 group-hover:grayscale-0 group-focus-visible:scale-105 group-focus-visible:grayscale-0"
								/>
							</div>
							<div className="mt-3 flex items-center justify-between gap-4 text-foreground transition-colors duration-200 group-hover:text-primary group-focus-visible:text-primary">
								<h2 className="line-clamp-2 text-sm font-semibold sm:text-base">
									{post.title}
								</h2>
								<ArrowRight className="size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1" />
							</div>
						</a>
					</MotionReveal>
				))}
			</section>
		</main>
	);
}
