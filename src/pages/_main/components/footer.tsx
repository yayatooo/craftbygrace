import { Link } from "@tanstack/react-router";

const footerLinks = [
	{ label: "Home", to: "/" },
	{ label: "About", to: "/about" },
	{ label: "Archives", to: "/archives" },
	{ label: "Blog", to: "/blog" },
] as const;

export function Footer() {
	return (
		<footer className="mt-12 border-border/60 border-t py-8">
			<div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
				<Link
					to="/"
					aria-label="Yatodev home"
					className="group flex w-fit items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
				>
					<img
						src="/logo.png"
						alt="Yatodev logo"
						width={40}
						height={40}
						className="size-10 object-contain transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105"
					/>
					<div>
						<p className="text-sm font-semibold tracking-tight">Craft by Grace</p>
						<p className="text-muted-foreground text-xs">
							Crafting thoughtful digital experiences.
						</p>
					</div>
				</Link>

				<nav aria-label="Footer navigation">
					<ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
						{footerLinks.map((link) => (
							<li key={link.to}>
								<Link
									to={link.to}
									className="text-muted-foreground text-xs transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>

			<p className="mt-6 text-muted-foreground/80 text-[11px]">
				&copy; {new Date().getFullYear()} Rahmat Hidayat. All rights reserved.
			</p>
		</footer>
	);
}
