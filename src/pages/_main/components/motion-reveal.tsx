import { motion, useReducedMotion } from "motion/react";
import type { PropsWithChildren } from "react";

type MotionRevealProps = PropsWithChildren<{
	className?: string;
	delay?: number;
	priority?: boolean;
}>;

export function MotionReveal({
	children,
	className,
	delay = 0,
	priority = false,
}: MotionRevealProps) {
	const shouldReduceMotion = useReducedMotion();

	if (priority || shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, y: 12 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.08, margin: "0px 0px -32px" }}
			transition={{
				duration: 0.38,
				delay,
				ease: [0.22, 1, 0.36, 1],
			}}
		>
			{children}
		</motion.div>
	);
}
