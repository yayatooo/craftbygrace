import { Skeleton } from "#/components/ui/skeleton";

export function ArchivesSkeleton() {
	return (
		<output className="block space-y-12" aria-label="Loading archives">
			<section className="space-y-4">
				<Skeleton className="h-6 w-40" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-4/5" />
				<div className="grid gap-4 pt-4 sm:grid-cols-2">
					{[0, 1, 2, 3].map((item) => (
						<Skeleton key={item} className="aspect-[1203/753] rounded-lg" />
					))}
				</div>
			</section>
			<section className="space-y-4">
				<Skeleton className="h-6 w-20" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-3/4" />
				{[0, 1, 2].map((item) => (
					<div key={item} className="flex gap-4 rounded-lg border p-4">
						<Skeleton className="size-12 shrink-0" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-4 w-2/5" />
							<Skeleton className="h-4 w-1/3" />
							<Skeleton className="h-3 w-3/5" />
						</div>
					</div>
				))}
			</section>
		</output>
	);
}
