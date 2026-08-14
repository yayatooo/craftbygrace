import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";

const footerLinks = [
	{ label: "Home", to: "/" },
	{ label: "About", to: "/about" },
	{ label: "Archives", to: "/archives" },
	{ label: "Blog", to: "/blog" },
] as const;

export function Footer() {
	const shouldReduceMotion = useReducedMotion();

	return (
		<motion.footer
			className="mt-12 border-border/60 border-t py-8 sm:py-10"
			initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.25 }}
			transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
		>
			<div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
				<motion.div
					className="w-full sm:w-auto"
					whileHover={shouldReduceMotion ? undefined : { y: -2 }}
					whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
					transition={{ type: "spring", stiffness: 350, damping: 24 }}
				>
					<Link
						to="/"
						aria-label="Yatodev home"
						className="group mx-auto flex w-fit flex-col items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:mx-0 sm:flex-row sm:gap-3"
					>
						<motion.img
							src="/logo.png"
							alt="Yatodev logo"
							width={40}
							height={40}
							className="size-12 object-contain sm:size-10"
							whileHover={
								shouldReduceMotion ? undefined : { rotate: -4, scale: 1.06 }
							}
							transition={{ type: "spring", stiffness: 300, damping: 18 }}
						/>
						<div className="min-w-0">
							<p className="text-sm font-semibold tracking-tight">
								Craft by Grace
							</p>
							<p className="max-w-64 text-pretty text-muted-foreground text-xs leading-relaxed">
								Crafting thoughtful digital experiences.
							</p>
						</div>
					</Link>
				</motion.div>

				<nav
					aria-label="Footer navigation"
					className="w-full border-border/50 border-y py-2.5 sm:w-auto sm:border-0 sm:py-0"
				>
					<ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 sm:justify-end">
						{footerLinks.map((link, index) => (
							<motion.li
								key={link.to}
								initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								whileHover={shouldReduceMotion ? undefined : { y: -2 }}
								transition={{
									duration: 0.35,
									delay: shouldReduceMotion ? 0 : 0.12 + index * 0.06,
									ease: [0.22, 1, 0.36, 1],
								}}
							>
								<Link
									to={link.to}
									className="inline-flex min-h-8 items-center px-1 text-muted-foreground text-xs transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								>
									{link.label}
								</Link>
							</motion.li>
						))}
					</ul>
				</nav>
			</div>

			<motion.p
				className="mt-5 text-center text-muted-foreground/80 text-[11px] leading-relaxed sm:mt-6 sm:text-left"
				initial={shouldReduceMotion ? false : { opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ once: true }}
				transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : 0.3 }}
			>
				&copy; {new Date().getFullYear()} Rahmat Hidayat. All rights reserved.
			</motion.p>
		</motion.footer>
	);
}
