import { MoveRight } from "lucide-react";
import { Button } from "#/components/ui/button";
import { ShowcaseSection } from "./components/showcase-section";

const albums = [
	{
		title: "Unforgiven",
		artist: "LE SSERAFIM",
		src: "/album/Le_Sserafim_-_Unforgiven.png",
	},
	{ title: "Blonde", artist: "Frank Ocean", src: "/album/blond.jpeg" },
	{ title: "Doa", artist: "K3bi", src: "/album/doa.jpeg" },
	{
		title: "Flaws and All",
		artist: "Wave to Earth",
		src: "/album/flawsandall.jpeg",
	},
	{ title: "Forza", artist: "$afa", src: "/album/forza.jpeg" },
	{
		title: "Piss in the Wind",
		artist: "Brent Faiyaz",
		src: "/album/pissinthewind.jpeg",
	},
];

const movies = [
	{
		title: "From",
		type: "Series",
		src: "/movie/Poster_From_Seri_Televisi.jpg",
	},
	{
		title: "Vinland Saga S2",
		type: "Anime Series",
		src: "/movie/Vinland_Saga_S2_Key_Visual_2.webp",
	},
	{
		title: "Better Call Saul",
		type: "Series",
		src: "/movie/better call saul.jpg",
	},
	{ title: "Breaking Bad", type: "Series", src: "/movie/breakingbad.jpg" },
	{ title: "Dark", type: "Series", src: "/movie/dark.jpg" },
	{
		title: "Nippon Sangoku",
		type: "Anime Series",
		src: "/movie/nippon-sangoku.webp",
	},
];

const galleryItems = [
	{ title: "Late coffee", className: "h-32 bg-[#2f3a32]" },
	{ title: "Street light", className: "h-48 bg-[#7a4f3d]" },
	{ title: "Quiet desk", className: "h-40 bg-[#3f4f66]" },
	{ title: "After rain", className: "h-56 bg-[#56614f]" },
	{ title: "Window seat", className: "h-36 bg-[#8b735b]" },
	{ title: "Night walk", className: "h-52 bg-[#242833]" },
	{ title: "Soft blur", className: "h-44 bg-[#7d5a66]" },
	{ title: "Warm corner", className: "h-40 bg-[#9a6a48]" },
];

export const AboutSection = () => {
	return (
		<section className="flex flex-col gap-4 py-8">
			<div>
				<h1 className="text-base font-semibold sm:text-lg">Heavy rotation</h1>
				<p className="text-muted-foreground">
					Music, series, movies, and the visual references I keep coming back
					to.
				</p>
			</div>

			<ShowcaseSection
				title="Albums on repeat"
				description="Covers that have been living in my queue lately."
				items={albums}
				aspectClassName="aspect-square"
				metaKey="artist"
			/>

			<ShowcaseSection
				title="Watchlist"
				description="Stories and worlds that shape my taste for pacing, mood, and detail."
				items={movies}
				aspectClassName="aspect-[3/4]"
				metaKey="type"
			/>
			<div>
				<h1 className="text-base font-semibold sm:text-lg">Gallery</h1>
				<p className="text-muted-foreground">
					Nothing Special just capture what i feel and see
				</p>
				<div className="mt-4 columns-2 gap-3 sm:columns-3">
					{galleryItems.map((item) => (
						<div
							key={item.title}
							className="mb-3 break-inside-avoid overflow-hidden rounded-lg border border-border bg-secondary"
						>
							<div
								className={`${item.className} flex items-end p-3 text-xs font-medium text-white`}
							>
								<span>{item.title}</span>
							</div>
						</div>
					))}
				</div>
				<div className="flex justify-end pt-8">
					<Button variant="link" className="italic text-foreground">
						More Photos <MoveRight />
					</Button>
				</div>
			</div>
		</section>
	);
};
