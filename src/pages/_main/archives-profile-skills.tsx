"use client";

import type React from "react";
import { forwardRef, useRef } from "react";
import type { IconType } from "react-icons";
import {
	SiDocker,
	SiOdoo,
	SiPostgresql,
	SiPython,
	SiReact,
	SiTypescript,
} from "react-icons/si";
import { AnimatedBeam } from "#/components/ui/animated-beam";
import { cn } from "#/lib/utils";

const skills: Array<{
	name: string;
	icon: IconType;
	className: string;
}> = [
	{ name: "TypeScript", icon: SiTypescript, className: "text-[#3178c6]" },
	{ name: "Odoo", icon: SiOdoo, className: "text-[#714b67]" },
	{ name: "Docker", icon: SiDocker, className: "text-[#2496ed]" },
	{ name: "React", icon: SiReact, className: "text-[#61dafb]" },
	{ name: "Postgres", icon: SiPostgresql, className: "text-[#4169e1]" },
	{ name: "Python", icon: SiPython, className: "text-[#3776ab]" },
];

const Circle = forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
	({ className, children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				{...props}
				className={cn(
					"z-10 flex size-12 items-center justify-center rounded-full border-2 border-border bg-background p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
					className,
				)}
			>
				{children}
			</div>
		);
	},
);

Circle.displayName = "Circle";

export function ArchivesProfileSkills() {
	const containerRef = useRef<HTMLDivElement>(null);
	const div1Ref = useRef<HTMLDivElement>(null);
	const div3Ref = useRef<HTMLDivElement>(null);
	const div4Ref = useRef<HTMLDivElement>(null);
	const div5Ref = useRef<HTMLDivElement>(null);
	const div6Ref = useRef<HTMLDivElement>(null);
	const div7Ref = useRef<HTMLDivElement>(null);
	const div8Ref = useRef<HTMLDivElement>(null);

	const skillRefs = [div1Ref, div3Ref, div5Ref, div6Ref, div7Ref, div8Ref];

	return (
		<div
			className="relative flex h-[300px] w-full items-center justify-center overflow-hidden p-10"
			ref={containerRef}
		>
			<div className="flex size-full max-h-[200px] max-w-lg flex-col items-stretch justify-between gap-10">
				<div className="flex flex-row items-center justify-between">
					<SkillCircle skill={skills[0]} ref={div1Ref} />
					<SkillCircle skill={skills[1]} ref={div3Ref} />
				</div>
				<div className="flex flex-row items-center justify-between">
					<SkillCircle skill={skills[2]} ref={div5Ref} />
					<Circle ref={div4Ref} className="size-16 overflow-hidden p-0">
						<img
							src="/avatar.jpg"
							alt="Yato"
							className="h-full w-full object-cover"
						/>
					</Circle>
					<SkillCircle skill={skills[3]} ref={div6Ref} />
				</div>
				<div className="flex flex-row items-center justify-between">
					<SkillCircle skill={skills[4]} ref={div7Ref} />
					<SkillCircle skill={skills[5]} ref={div8Ref} />
				</div>
			</div>

			{skillRefs.map((skillRef, index) => (
				<AnimatedBeam
					key={skills[index].name}
					containerRef={containerRef}
					fromRef={skillRef}
					toRef={div4Ref}
					curvature={[-80, -80, 0, 0, 80, 80][index]}
					endYOffset={[-10, -10, 0, 0, 10, 10][index]}
					reverse={index > 3}
				/>
			))}
		</div>
	);
}

const SkillCircle = forwardRef<
	HTMLDivElement,
	{ skill: (typeof skills)[number] }
>(({ skill }, ref) => {
	const Icon = skill.icon;

	return (
		<Circle ref={ref} title={skill.name}>
			<Icon className={cn("size-7", skill.className)} aria-hidden="true" />
		</Circle>
	);
});

SkillCircle.displayName = "SkillCircle";
