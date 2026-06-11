type ShowcaseItem = {
	title: string;
	src: string;
	artist?: string;
	type?: string;
};

export function ShowcaseSection({
	title,
	description,
	items,
	aspectClassName,
	metaKey,
}: {
	title: string;
	description: string;
	items: ShowcaseItem[];
	aspectClassName: string;
	metaKey: "artist" | "type";
}) {
	return (
		<section className="flex flex-col gap-3 py-3">
			<div>
				<h2 className="font-semibold">{title}</h2>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
			<div className="px-4">
				<div className="scrollbar-hidden -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
					{items.map((item) => (
						<article
							key={item.src}
							className="group min-w-0 flex-[0_0_calc((100%-0.75rem)/2)] snap-start sm:flex-[0_0_calc((100%-1.5rem)/3)]"
						>
							<div
								className={`${aspectClassName} overflow-hidden rounded-lg border border-border bg-secondary`}
							>
								<img
									src={item.src}
									alt={item.title}
									className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
									loading="lazy"
								/>
							</div>
							<div className="mt-2 min-w-0">
								<h3 className="truncate text-sm font-medium">{item.title}</h3>
								<p className="truncate text-xs text-muted-foreground">
									{item[metaKey]}
								</p>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
