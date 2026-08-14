import { Badge } from "#/components/ui/badge";
import type { PublicAboutData } from "#/features/about/about.services";
import { ShowcaseSection } from "./components/showcase-section";

type AboutSectionProps = {
	data: PublicAboutData;
};

function EmptyState({ children }: { children: React.ReactNode }) {
	return (
		<div className="mt-4 rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
			{children}
		</div>
	);
}

export function AboutSection({ data }: AboutSectionProps) {
	return (
		<section className="flex flex-col gap-4 py-4">
			<div>
				<h1 className="text-base font-semibold sm:text-lg">Current Stack</h1>
				<p className="text-muted-foreground">
					The engine behind my work. I leverage this trusted stack to deliver
					robust and scalable solutions for both my clients and my team.
				</p>
				{data.skills.length > 0 ? (
					<div className="mt-4 flex flex-wrap gap-2">
						{data.skills.map((skill) => (
							<Badge
								key={skill.id}
								variant="outline"
								className="h-8 gap-2 rounded-md bg-border px-3 text-sm"
							>
								<img
									src={skill.icon}
									alt=""
									className="size-4 shrink-0 object-contain"
									loading="lazy"
									decoding="async"
								/>
								{skill.name}
							</Badge>
						))}
					</div>
				) : (
					<EmptyState>Skills will be added soon.</EmptyState>
				)}
			</div>

			<div className="pt-8">
				<h1 className="text-center text-base font-semibold sm:text-lg">
					Heavy rotation
				</h1>
			</div>

			<ShowcaseSection
				title="Songs on repeat"
				description="Tracks that have been living in my queue lately."
				items={data.songs.map((song) => ({
					id: song.id,
					title: song.name,
					meta: song.writer,
					src: song.image,
					href: song.link,
				}))}
				aspectClassName="aspect-square"
				emptyMessage="No songs in rotation right now."
			/>

			<ShowcaseSection
				title="Watchlist"
				description="Stories and worlds that shape my taste for pacing, mood, and detail."
				items={data.movies.map((movie) => ({
					id: movie.id,
					title: movie.name,
					meta: movie.type,
					src: movie.image,
					href: movie.link,
				}))}
				aspectClassName="aspect-[3/4]"
				emptyMessage="Nothing is on the watchlist yet."
			/>

			<div>
				<h1 className="text-base font-semibold sm:text-lg">Gallery</h1>
				<p className="text-muted-foreground">
					Nothing special, just capturing what I feel and see.
				</p>
				{data.galleryItems.length > 0 ? (
					<div className="mt-4 columns-2 gap-3 sm:columns-3">
						{data.galleryItems.map((item, index) => (
							<figure
								key={item.id}
								className="group relative mb-3 break-inside-avoid overflow-hidden rounded-lg border border-border bg-secondary"
							>
								<img
									src={item.image}
									alt={item.alt || item.name}
									className="h-auto w-full object-cover transition duration-300 group-hover:scale-[1.02]"
									loading={index < 2 ? "eager" : "lazy"}
									fetchPriority={index === 0 ? "high" : "auto"}
									decoding="async"
								/>
								<figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 text-xs font-medium text-white">
									{item.name}
								</figcaption>
							</figure>
						))}
					</div>
				) : (
					<EmptyState>No photos have been shared yet.</EmptyState>
				)}
			</div>
		</section>
	);
}
