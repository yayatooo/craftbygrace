import { useRouter } from "@tanstack/react-router";
import { ImageIcon, Save, Upload, X } from "lucide-react";
import type { ChangeEvent, DragEvent, FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Switch } from "#/components/ui/switch";
import { updateGalleryItemAction } from "#/features/gallery/gallery.actions";
import type { GalleryItem } from "./gallery-table";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

type GalleryEditDialogProps = {
	galleryItem: GalleryItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function GalleryEditDialog({
	galleryItem,
	open,
	onOpenChange,
}: GalleryEditDialogProps) {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const [isPending, setIsPending] = useState(false);
	const [pendingStep, setPendingStep] = useState<
		"idle" | "uploading" | "saving"
	>("idle");
	const [isActive, setIsActive] = useState(true);
	const [isDragging, setIsDragging] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [imageFileName, setImageFileName] = useState<string | null>(null);
	const [galleryFile, setGalleryFile] = useState<File | null>(null);

	useEffect(() => {
		if (!galleryItem) {
			setIsActive(true);
			setImagePreview(null);
			setImageFileName(null);
			setGalleryFile(null);
			setIsDragging(false);
			return;
		}

		setIsActive(galleryItem.isActive);
		setImagePreview(galleryItem.image);
		setImageFileName(null);
		setGalleryFile(null);
		setIsDragging(false);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, [galleryItem]);

	useEffect(() => {
		return () => {
			if (imagePreview?.startsWith("blob:")) {
				URL.revokeObjectURL(imagePreview);
			}
		};
	}, [imagePreview]);

	function resetSelectedFile() {
		if (imagePreview?.startsWith("blob:")) {
			URL.revokeObjectURL(imagePreview);
		}

		setImagePreview(galleryItem?.image ?? null);
		setImageFileName(null);
		setGalleryFile(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	function setSelectedFile(file: File) {
		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
			resetSelectedFile();
			toast.error("Photo must be a PNG, JPG, or WEBP image.");
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			resetSelectedFile();
			toast.error("Photo must be 5 MB or smaller.");
			return;
		}

		if (imagePreview?.startsWith("blob:")) {
			URL.revokeObjectURL(imagePreview);
		}

		setImagePreview(URL.createObjectURL(file));
		setImageFileName(file.name);
		setGalleryFile(file);
	}

	function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];

		if (!file) return;

		setSelectedFile(file);
	}

	function handleDragOver(event: DragEvent<HTMLLabelElement>) {
		event.preventDefault();
		setIsDragging(true);
	}

	function handleDragLeave(event: DragEvent<HTMLLabelElement>) {
		event.preventDefault();
		setIsDragging(false);
	}

	function handleDrop(event: DragEvent<HTMLLabelElement>) {
		event.preventDefault();
		setIsDragging(false);

		const file = event.dataTransfer.files?.[0];

		if (!file) return;

		setSelectedFile(file);
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!galleryItem) return;

		const formData = new FormData(event.currentTarget);
		const name = formData.get("name")?.toString().trim() ?? "";
		const alt = formData.get("alt")?.toString().trim() ?? "";
		const order = Number(formData.get("order") ?? 0);

		setIsPending(true);

		try {
			await updateGalleryItemAction(
				{
					id: galleryItem.id,
					name,
					alt: alt || null,
					isActive,
					order,
					currentImage: galleryItem.image,
					galleryFile,
					shouldRemoveImage: false,
				},
				{
					onUploading: () => setPendingStep("uploading"),
					onSaving: () => setPendingStep("saving"),
				},
			);

			toast.success("Gallery photo updated successfully");
			onOpenChange(false);
			await router.invalidate();
		} catch (error) {
			console.error("Failed to update gallery photo:", error);
			toast.error("Failed to update gallery photo.");
		} finally {
			setIsPending(false);
			setPendingStep("idle");
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (!isPending) onOpenChange(nextOpen);
			}}
		>
			<DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Edit Gallery Photo</DialogTitle>
					<DialogDescription>
						Update gallery photo details and display information.
					</DialogDescription>
				</DialogHeader>

				<form
					key={galleryItem?.id ?? "empty"}
					className="space-y-6"
					onSubmit={handleSubmit}
				>
					<div className="grid gap-5 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="edit-gallery-name">Photo Name</Label>
							<Input
								id="edit-gallery-name"
								name="name"
								defaultValue={galleryItem?.name ?? ""}
								placeholder="Late coffee"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="edit-gallery-order">Order</Label>
							<Input
								id="edit-gallery-order"
								name="order"
								type="number"
								min={0}
								defaultValue={galleryItem?.order ?? 0}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="edit-gallery-alt">Alt Text</Label>
						<Input
							id="edit-gallery-alt"
							name="alt"
							defaultValue={galleryItem?.alt ?? ""}
							placeholder="Coffee beside a laptop at night"
						/>
						<p className="text-xs text-muted-foreground">
							Optional description for accessibility and SEO.
						</p>
					</div>

					<div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_160px]">
						<div className="space-y-2">
							<Label htmlFor="edit-gallery-image">Image Upload</Label>

							<label
								htmlFor="edit-gallery-image"
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
								className={`flex min-h-45 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background px-6 text-center transition-colors hover:bg-muted/40 ${
									isDragging ? "bg-muted/40" : ""
								}`}
							>
								<Upload className="mb-4 size-8 stroke-[1.8]" />

								<div className="space-y-1">
									<p className="text-base font-semibold">
										{imageFileName ?? "Drag & Drop or Choose photo to upload"}
									</p>

									<p className="text-sm text-muted-foreground">
										PNG, JPG, WEBP up to 5MB
									</p>
								</div>

								<Input
									id="edit-gallery-image"
									name="galleryFile"
									type="file"
									accept="image/png,image/jpeg,image/webp"
									className="hidden"
									onChange={handleImageChange}
									ref={fileInputRef}
								/>
							</label>

							<p className="text-xs text-muted-foreground">
								Leave unchanged to keep the current image.
							</p>
						</div>

						<div className="space-y-2">
							<Label>Preview</Label>

							<div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border bg-muted">
								{imagePreview ? (
									<>
										<img
											src={imagePreview}
											alt="Selected preview"
											className="size-full object-cover"
										/>

										{galleryFile ? (
											<Button
												type="button"
												variant="secondary"
												size="icon"
												className="absolute right-2 top-2 size-7"
												onClick={resetSelectedFile}
												aria-label="Remove selected replacement"
												disabled={isPending}
											>
												<X className="size-3.5" />
											</Button>
										) : null}
									</>
								) : (
									<div className="flex flex-col items-center gap-2 px-3 text-center text-muted-foreground">
										<ImageIcon className="size-5" />
										<span className="text-xs">No image selected</span>
									</div>
								)}
							</div>

							{imageFileName ? (
								<p className="truncate text-xs text-muted-foreground">
									{imageFileName}
								</p>
							) : null}
						</div>
					</div>

					<div className="flex items-center gap-2 rounded-md border px-3 py-2">
						<Switch
							id="edit-gallery-active"
							checked={isActive}
							onCheckedChange={setIsActive}
						/>
						<Label htmlFor="edit-gallery-active" className="text-sm">
							Active
						</Label>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							disabled={isPending}
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>

						<Button type="submit" disabled={isPending}>
							<Save className="size-4" />
							{pendingStep === "uploading"
								? "Uploading..."
								: pendingStep === "saving"
									? "Saving..."
									: "Save Changes"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
