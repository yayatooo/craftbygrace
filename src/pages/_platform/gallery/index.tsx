import { TitleText } from "#/components/title-text";
import { GalleryTable } from "../components/gallery-table";
import { UploadGalleryCard } from "../components/gallery-upload-card";

export default function GalleryAdmin() {
  const galleryData = [
    {
      id: "1",
      name: "Workspace setup",
      image: "/placeholder-gallery.jpg",
      isActive: true,
    },
    {
      id: "2",
      name: "Coffee coding session",
      image: "/placeholder-gallery.jpg",
      isActive: false,
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <TitleText>Gallery</TitleText>
      <UploadGalleryCard />
      <GalleryTable data={galleryData} />
    </section>
  );
}
