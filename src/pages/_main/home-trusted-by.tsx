import bensonLogo from "#/assets/partners/benson-logo.png?format=webp&w=160";
import bensonLogoSrcSet from "#/assets/partners/benson-logo.png?format=webp&w=160;320&as=srcset";
import cbrLogo from "#/assets/partners/cbr.png?format=webp&w=160";
import cbrLogoSrcSet from "#/assets/partners/cbr.png?format=webp&w=160;320&as=srcset";
import inaLogo from "#/assets/partners/ina.svg.png?format=webp&w=160";
import inaLogoSrcSet from "#/assets/partners/ina.svg.png?format=webp&w=160;320&as=srcset";
import markasMobilLogo from "#/assets/partners/markas-mobil.png?format=webp&w=160";
import markasMobilLogoSrcSet from "#/assets/partners/markas-mobil.png?format=webp&w=160;320&as=srcset";
import odooLogo from "#/assets/partners/odoo.png?format=webp&w=160";
import odooLogoSrcSet from "#/assets/partners/odoo.png?format=webp&w=160;320&as=srcset";
import shudaxiaLogo from "#/assets/partners/shudaxia.png?format=webp&w=160";
import shudaxiaLogoSrcSet from "#/assets/partners/shudaxia.png?format=webp&w=160;320&as=srcset";
import skorLogo from "#/assets/partners/skor.png?format=webp&w=160";
import skorLogoSrcSet from "#/assets/partners/skor.png?format=webp&w=160;320&as=srcset";

const partners = [
	{
		name: "CBR",
		src: cbrLogo,
		srcSet: cbrLogoSrcSet,
		width: 160,
		height: 36,
		className: "max-h-8",
	},
	{
		name: "INA",
		src: inaLogo,
		srcSet: inaLogoSrcSet,
		width: 160,
		height: 46,
		className: "max-h-8",
	},
	{
		name: "Markas Mobil",
		src: markasMobilLogo,
		srcSet: markasMobilLogoSrcSet,
		width: 160,
		height: 44,
		className: "max-h-12",
	},
	{
		name: "Odoo",
		src: odooLogo,
		srcSet: odooLogoSrcSet,
		width: 160,
		height: 51,
		className: "max-h-8",
	},
	{
		name: "SDX",
		src: shudaxiaLogo,
		srcSet: shudaxiaLogoSrcSet,
		width: 160,
		height: 50,
		className: "max-h-10",
	},
	{
		name: "Skor",
		src: skorLogo,
		srcSet: skorLogoSrcSet,
		width: 160,
		height: 66,
		className: "max-h-8",
	},
	{
		name: "Benson",
		src: bensonLogo,
		srcSet: bensonLogoSrcSet,
		width: 160,
		height: 49,
		className: "max-h-12",
	},
] as const;

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
							srcSet={partner.srcSet}
							sizes="(min-width: 640px) 128px, calc(50vw - 22px)"
							alt={partner.name}
							width={partner.width}
							height={partner.height}
							className={`${partner.className} max-w-full object-contain grayscale contrast-125 saturate-0 dark:brightness-0 dark:invert`}
							loading="lazy"
							decoding="async"
						/>
					</div>
				))}
			</div>
		</>
	);
};
