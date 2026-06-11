import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { BriefcaseBusiness, HomeIcon, Notebook, User } from "lucide-react";
import { AnimatedThemeToggler } from "#/components/ui/animated-theme-toggler";
import { buttonVariants } from "#/components/ui/button";
import { Dock, DockIcon } from "#/components/ui/dock";
import { Separator } from "#/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "#/components/ui/tooltip";
import { cn } from "#/lib/utils";

type NavItem = {
	href: string;
	icon: LucideIcon;
	label: string;
};

const linkClassName = cn(
	buttonVariants({ variant: "ghost", size: "icon" }),
	"size-12 rounded-xl text-foreground hover:bg-accent hover:text-accent-foreground",
);

const navItems: NavItem[] = [
	{ href: "/", icon: HomeIcon, label: "Home" },
	{ href: "/about", icon: User, label: "About" },
	{ href: "/archives", icon: BriefcaseBusiness, label: "Archives" },
	{ href: "/blog", icon: Notebook, label: "Blog" },
];

export function DockNav() {
	return (
		<nav
			aria-label="Primary navigation"
			className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
		>
			<TooltipProvider>
				<Dock
					direction="middle"
					className="mt-0 border-border bg-background/80 shadow-lg backdrop-blur-md"
				>
					{navItems.map((item) => {
						const Icon = item.icon;

						return (
							<DockIcon key={item.href}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Link
											to={item.href}
											aria-label={item.label}
											className={linkClassName}
										>
											<Icon className="size-4" />
										</Link>
									</TooltipTrigger>

									<TooltipContent>
										<p>{item.label}</p>
									</TooltipContent>
								</Tooltip>
							</DockIcon>
						);
					})}

					<Separator orientation="vertical" className="h-8" />

					<DockIcon>
						<Tooltip>
							<TooltipTrigger asChild>
								<AnimatedThemeToggler
									variant="circle"
									aria-label="Toggle theme"
									className={linkClassName}
								/>
							</TooltipTrigger>

							<TooltipContent>
								<p>Theme</p>
							</TooltipContent>
						</Tooltip>
					</DockIcon>
				</Dock>
			</TooltipProvider>
		</nav>
	);
}
