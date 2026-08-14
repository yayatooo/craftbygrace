import { Safari } from "#/components/ui/safari";

function displayUrl(value: string | null) {
	if (!value) return "Project preview";

	try {
		return new URL(value).hostname.replace(/^www\./, "");
	} catch {
		return value;
	}
}

export function SafariDemo({
	imageSrc,
	demoLink,
}: {
	imageSrc: string;
	demoLink: string | null;
}) {
	return (
		<div>
			<Safari
				url={displayUrl(demoLink)}
				imageSrc={imageSrc}
				imageLoading="eager"
				imageFetchPriority="high"
			/>
		</div>
	);
}
