import { useRouter } from "@tanstack/react-router";
import { ImageIcon, Save, Upload, X } from "lucide-react";
import type { ChangeEvent, DragEvent, FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Switch } from "#/components/ui/switch";
import { createGalleryItemAction } from "#/features/gallery/gallery.actions";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

export function UploadGalleryCard() {
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
		return () => {
			if (imagePreview?.startsWith("blob:")) {
				URL.revokeObjectURL(imagePreview);
			}
		};
	}, [imagePreview]);

	function setSelectedFile(file: File) {
		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
			removeImage();
			toast.error("Photo must be a PNG, JPG, or WEBP image.");
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			removeImage();
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

	function removeImage() {
		if (imagePreview?.startsWith("blob:")) {
			URL.revokeObjectURL(imagePreview);
		}

		setImagePreview(null);
		setImageFileName(null);
		setGalleryFile(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	function resetForm(form: HTMLFormElement | null) {
		form?.reset();
		removeImage();
		setIsActive(true);
		setIsDragging(false);
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!galleryFile) {
			toast.error("Please choose a photo first.");
			return;
		}

		const form = event.currentTarget;
		const formData = new FormData(form);

		const name = formData.get("name")?.toString().trim() ?? "";
		const alt = formData.get("alt")?.toString().trim() ?? "";
		const order = Number(formData.get("order") ?? 0);

		setIsPending(true);

		try {
			await createGalleryItemAction(
				{
					name,
					alt: alt || null,
					isActive,
					order,
					galleryFile,
				},
				{
					onUploading: () => setPendingStep("uploading"),
					onSaving: () => setPendingStep("saving"),
				},
			);

			toast.success("Gallery photo created successfully");
			resetForm(form);

			await router.invalidate();
		} catch (error) {
			console.error("Failed to create gallery photo:", error);
			toast.error("Failed to create gallery photo.");
		} finally {
			setIsPending(false);
			setPendingStep("idle");
		}
	}

	return (
		<Card className="w-full rounded-3xl border-border/80 shadow-none">
			<CardHeader className="space-y-1 px-6 py-3">
				<CardTitle className="text-xl font-semibold tracking-tight">
					Upload camera roll
				</CardTitle>
				<CardDescription className="text-sm text-muted-foreground">
					Drag and drop photos to add them into your portfolio gallery.
				</CardDescription>
			</CardHeader>

			<form onSubmit={handleSubmit}>
				<CardContent className="space-y-5 px-6">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="gallery-name" className="text-sm font-medium">
								Photo Name
							</Label>
							<Input
								id="gallery-name"
								name="name"
								placeholder="Late coffee"
								className="h-11 rounded-xl text-sm shadow-sm"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="gallery-order" className="text-sm font-medium">
								Order
							</Label>
							<Input
								id="gallery-order"
								name="order"
								type="number"
								min={0}
								defaultValue={0}
								className="h-11 rounded-xl text-sm shadow-sm"
							/>
						</div>
					</div>

					<div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
						<div className="space-y-2">
							<Label htmlFor="gallery-alt" className="text-sm font-medium">
								Alt Text
							</Label>
							<Input
								id="gallery-alt"
								name="alt"
								placeholder="Coffee beside a laptop at night"
								className="h-11 rounded-xl text-sm shadow-sm"
							/>
							<p className="text-xs text-muted-foreground">
								Optional description for accessibility and SEO.
							</p>
						</div>

						<div className="flex items-center gap-2 self-start rounded-xl border px-3 py-2.5 md:mt-7">
							<Switch
								id="gallery-active"
								checked={isActive}
								onCheckedChange={setIsActive}
							/>
							<Label htmlFor="gallery-active" className="text-sm">
								Active
							</Label>
						</div>
					</div>

					<div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_160px]">
						<label
							htmlFor="camera-roll-upload"
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							className={`flex min-h-45 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background px-6 text-center transition-colors hover:bg-muted/40 ${
								isDragging ? "bg-muted/40" : ""
							}`}
						>
							<Input
								id="camera-roll-upload"
								name="galleryFile"
								type="file"
								accept="image/png,image/jpeg,image/webp"
								className="hidden"
								onChange={handleImageChange}
								ref={fileInputRef}
							/>

							<Upload className="mb-4 size-8 stroke-[1.8]" />

							<p className="text-base font-semibold">
								Drag & Drop or Choose photo to upload
							</p>

							<p className="mt-2 text-sm text-muted-foreground">
								PNG, JPG, WEBP up to 5MB
							</p>
						</label>

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

										<Button
											type="button"
											variant="secondary"
											size="icon"
											className="absolute right-2 top-2 size-7"
											onClick={removeImage}
											aria-label="Remove selected photo"
											disabled={isPending}
										>
											<X className="size-3.5" />
										</Button>
									</>
								) : (
									<div className="flex flex-col items-center gap-2 px-3 text-center text-muted-foreground">
										<ImageIcon className="size-5" />
										<span className="text-xs">No photo selected</span>
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
				</CardContent>

				<CardFooter className="flex justify-end gap-3 px-6 pb-6 pt-2">
					<Button
						type="button"
						variant="outline"
						className="h-11 px-6 text-sm"
						disabled={isPending}
						onClick={(event) => {
							resetForm(event.currentTarget.form);
						}}
					>
						Cancel
					</Button>

					<Button
						type="submit"
						className="h-11 px-6 text-sm"
						disabled={isPending}
					>
						<Save className="size-4" />
						{pendingStep === "uploading"
							? "Uploading..."
							: pendingStep === "saving"
								? "Saving..."
								: "Upload Photo"}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
