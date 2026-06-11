export const TrustedBy = () => {
	function getWorkExperience(startYear: number, startMonth: number) {
		const now = new Date();

		const currentYear = now.getFullYear();
		const currentMonth = now.getMonth() + 1;

		let years = currentYear - startYear;

		if (currentMonth < startMonth) {
			years -= 1;
		}

		if (years <= 0) return "less than 1 year";

		return `${years} ${years === 1 ? "year" : "years"}`;
	}

	const partners = [
		{ name: "CBR", src: "/partners/cbr.png", className: "max-h-8" },
		{ name: "INA", src: "/partners/ina.svg.png", className: "max-h-8" },
		{
			name: "Markas Mobil",
			src: "/partners/markas-mobil.png",
			className: "max-h-12",
		},
		{ name: "Odoo", src: "/partners/odoo.png", className: "max-h-8" },
		{ name: "SDX", src: "/partners/shudaxia.png", className: "max-h-10" },
		{ name: "Skor", src: "/partners/skor.png", className: "max-h-8" },
		{ name: "Benson", src: "/partners/benson-logo.png", className: "max-h-12" },
	];

	return (
		<>
			<section id="trusted-by" className="scroll-mt-8 py-8 flex flex-col gap-4">
				<h1 className="text-lg font-semibold">Trusted by many</h1>
				<p>
					I have spent{" "}
					<span className="font-semibold">{getWorkExperience(2023, 5)}</span>{" "}
					working in this field, collaborating with clients from a wide range of
					industries.
				</p>
				<p>
					My focus on quality, attention to detail, and commitment to meaningful
					results have helped me build strong, lasting relationships with every
					partner I have worked with.
				</p>
			</section>
			<div className="flex flex-wrap justify-center gap-3">
				{partners.map((partner) => (
					<div
						key={partner.name}
						className="flex h-16 basis-[calc((100%-0.75rem)/2)] items-center justify-center bg-background px-3 sm:basis-[calc((100%-2.25rem)/4)]"
					>
						<img
							src={partner.src}
							alt={partner.name}
							className={`${partner.className} max-w-full object-contain grayscale contrast-125 saturate-0 dark:brightness-0 dark:invert`}
							loading="lazy"
						/>
					</div>
				))}
			</div>
		</>
	);
};
