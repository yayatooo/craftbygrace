import { Link, useLocation } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { BriefcaseBusiness, HomeIcon, Notebook, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
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
	"relative size-12 overflow-hidden rounded-xl text-foreground hover:bg-transparent hover:text-foreground",
);

const navItems: NavItem[] = [
	{ href: "/", icon: HomeIcon, label: "Home" },
	{ href: "/about", icon: User, label: "About" },
	{ href: "/archives", icon: BriefcaseBusiness, label: "Archives" },
	{ href: "/blog", icon: Notebook, label: "Blog" },
];

export function DockNav() {
	const { pathname } = useLocation();
	const activeIndex = navItems.findIndex(
		(item) =>
			item.href === pathname ||
			(item.href !== "/" && pathname.startsWith(`${item.href}/`)),
	);
	const previousActiveIndexRef = useRef(activeIndex);
	const panDirection =
		activeIndex === previousActiveIndexRef.current
			? 0
			: activeIndex > previousActiveIndexRef.current
				? 1
				: -1;

	useEffect(() => {
		if (activeIndex >= 0) {
			previousActiveIndexRef.current = activeIndex;
		}
	}, [activeIndex]);

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
					{navItems.map((item, index) => {
						const Icon = item.icon;
						const isActive = activeIndex === index;

						return (
							<DockIcon key={item.href}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Link
											to={item.href}
											aria-label={item.label}
											className={cn(
												linkClassName,
												isActive &&
													"text-accent-foreground hover:text-accent-foreground",
											)}
										>
											{isActive ? (
												<motion.span
													key={item.href}
													className="absolute inset-0 rounded-xl bg-accent"
													initial={{
														x:
															panDirection === 0
																? "0%"
																: panDirection > 0
																	? "-100%"
																	: "100%",
													}}
													animate={{ x: "0%" }}
													transition={{
														duration: 0.24,
														ease: [0.22, 1, 0.36, 1],
													}}
												/>
											) : null}
											<Icon className="relative z-10 size-4" />
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
