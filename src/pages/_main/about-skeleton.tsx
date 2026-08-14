import { Skeleton } from "#/components/ui/skeleton";

function ShowcaseSkeleton({ portrait = false }: { portrait?: boolean }) {
	return (
		<div className="space-y-3 py-3" aria-hidden="true">
			<div className="space-y-2">
				<Skeleton className="h-5 w-28" />
				<Skeleton className="h-4 w-4/5" />
			</div>
			<div className="flex gap-3 overflow-hidden">
				{[0, 1, 2].map((item) => (
					<div
						key={item}
						className="w-[calc((100%-0.75rem)/2)] shrink-0 sm:w-[calc((100%-1.5rem)/3)]"
					>
						<Skeleton className={portrait ? "aspect-[3/4]" : "aspect-square"} />
						<Skeleton className="mt-2 h-4 w-4/5" />
						<Skeleton className="mt-1 h-3 w-1/2" />
					</div>
				))}
			</div>
		</div>
	);
}

export function AboutPageSkeleton() {
	return (
		<output className="block space-y-8" aria-label="Loading about page">
			<div className="flex items-center gap-4">
				<Skeleton className="size-20 rounded-full" />
				<div className="flex-1 space-y-2">
					<Skeleton className="h-5 w-40" />
					<Skeleton className="h-4 w-56 max-w-full" />
				</div>
			</div>
			<div className="space-y-4">
				<Skeleton className="h-5 w-32" />
				<Skeleton className="h-4 w-full" />
				<div className="flex flex-wrap gap-2">
					{[0, 1, 2, 3, 4, 5].map((item) => (
						<Skeleton key={item} className="h-8 w-24" />
					))}
				</div>
			</div>
			<ShowcaseSkeleton />
			<ShowcaseSkeleton portrait />
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
				{[0, 1, 2, 3, 4, 5].map((item) => (
					<Skeleton key={item} className="aspect-square" />
				))}
			</div>
		</output>
	);
}
