import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";

export type PublicProfile = {
	name: string;
	headline: string | null;
	image: string | null;
	isVerified: boolean;
} | null;

function getInitials(name: string) {
	return name
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0])
		.join("")
		.toUpperCase();
}

export function CardProfile({ profile }: { profile: PublicProfile }) {
	const name = profile?.name ?? "Portfolio Owner";

	return (
		<section className="flex items-center gap-2 py-4">
			<Avatar size="xl">
				{profile?.image && (
					<AvatarImage
						src={profile.image}
						alt={`${name} profile photo`}
						fetchPriority="high"
					/>
				)}
				<AvatarFallback>{getInitials(name)}</AvatarFallback>
			</Avatar>
			<div className="min-w-0">
				<div className="flex min-w-0 items-center gap-1.5">
					<h1 className="truncate text-xl font-semibold sm:text-2xl">{name}</h1>
					{profile?.isVerified && (
						<img
							src="/verified.png"
							alt="Verified"
							width={24}
							height={24}
							className="size-5 shrink-0 sm:size-6"
						/>
					)}
				</div>
				<p className="truncate text-sm">
					{profile?.headline ?? "Full Stack Engineer"}
				</p>
			</div>
		</section>
	);
}
