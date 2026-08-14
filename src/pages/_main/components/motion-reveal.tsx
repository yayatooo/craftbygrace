import { motion, useReducedMotion } from "motion/react";
import type { PropsWithChildren } from "react";

type MotionRevealProps = PropsWithChildren<{
	className?: string;
	delay?: number;
}>;

export function MotionReveal({
	children,
	className,
	delay = 0,
}: MotionRevealProps) {
	const shouldReduceMotion = useReducedMotion();

	return (
		<motion.div
			className={className}
			initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.12 }}
			transition={{
				duration: 0.5,
				delay: shouldReduceMotion ? 0 : delay,
				ease: [0.22, 1, 0.36, 1],
			}}
		>
			{children}
		</motion.div>
	);
}
