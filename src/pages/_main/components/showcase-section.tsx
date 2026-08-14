import { ImageOff } from "lucide-react";
import { cn } from "#/lib/utils";

type ShowcaseItem = {
	id: string;
	title: string;
	meta: string;
	src: string | null;
	href: string | null;
};

type ShowcaseSectionProps = {
	title: string;
	description: string;
	items: ShowcaseItem[];
	aspectClassName: string;
	emptyMessage: string;
};

export function ShowcaseSection({
	title,
	description,
	items,
	aspectClassName,
	emptyMessage,
}: ShowcaseSectionProps) {
	return (
		<section className="flex flex-col gap-3 py-3">
			<div>
				<h2 className="font-semibold">{title}</h2>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
			{items.length > 0 ? (
				<div className="px-4">
					<div className="scrollbar-hidden -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
						{items.map((item) => {
							const content = (
								<>
									<div
										className={cn(
											aspectClassName,
											"flex items-center justify-center overflow-hidden rounded-lg border border-border bg-secondary",
										)}
									>
										{item.src ? (
											<img
												src={item.src}
												alt={item.title}
												className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
												loading="lazy"
												decoding="async"
											/>
										) : (
											<ImageOff
												className="size-7 text-muted-foreground"
												aria-hidden="true"
											/>
										)}
									</div>
									<div className="mt-2 min-w-0">
										<h3 className="truncate text-sm font-medium">
											{item.title}
										</h3>
										<p className="truncate text-xs text-muted-foreground">
											{item.meta}
										</p>
									</div>
								</>
							);

							const className =
								"group min-w-0 flex-[0_0_calc((100%-0.75rem)/2)] snap-start sm:flex-[0_0_calc((100%-1.5rem)/3)]";

							return item.href ? (
								<a
									key={item.id}
									href={item.href}
									target="_blank"
									rel="noreferrer"
									className={className}
								>
									{content}
								</a>
							) : (
								<article key={item.id} className={className}>
									{content}
								</article>
							);
						})}
					</div>
				</div>
			) : (
				<div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
					{emptyMessage}
				</div>
			)}
		</section>
	);
}
