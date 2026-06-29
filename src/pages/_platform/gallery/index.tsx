import { TitleText } from "#/components/title-text";
import { GalleryTable } from "./gallery-table";
import { UploadGalleryCard } from "./gallery-upload-card";

type GalleryAdminProps = {
	galleryItems?: Array<{
		id: string;
		name: string;
		image: string;
		alt: string | null;
		isActive: boolean;
		order: number;
		createdAt: Date;
		updatedAt: Date;
	}>;
};

export default function GalleryAdmin({ galleryItems }: GalleryAdminProps) {
	const galleryData = galleryItems ?? [];

	return (
		<section className="flex flex-col gap-4">
			<TitleText>Gallery</TitleText>
			<UploadGalleryCard />
			<GalleryTable data={galleryData} />
		</section>
	);
}
