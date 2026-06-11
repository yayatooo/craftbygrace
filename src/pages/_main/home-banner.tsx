import { CardProfile } from "./components/card-profile";

export const Banner = () => {
	return (
		<div className="text-sm leading-6 sm:text-base sm:leading-7">
			<CardProfile />
			<section>
				<p className="py-4">
					Hi, I'm a Fullstack Developer in{" "}
					<span className="font-semibold text-accent">Jakarta, Indonesia</span>,
					deep in the TypeScript & Python ecosystem. turn ideas into clean,
					performant, and user first solutions. really love Coffee and Huh
					Yunjin
				</p>
				<p>
					I build modern web experiences with a focus on polished user
					interfaces, thoughtful architecture, and clean, maintainable code.
					Recently, I’ve been exploring AI-powered products and crafting
					interfaces that solve real business problems.
				</p>
			</section>
		</div>
	);
};
