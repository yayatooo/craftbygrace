import { useRouter } from "@tanstack/react-router";
import { ImageIcon, LinkIcon, Music2, Save, Upload, X } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Switch } from "#/components/ui/switch";
import { createSongAction } from "#/features/songs/songs.actions";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

export function SongFormCard() {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const [isPending, setIsPending] = useState(false);
	const [pendingStep, setPendingStep] = useState<
		"idle" | "uploading" | "saving"
	>("idle");
	const [isActive, setIsActive] = useState(true);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [imageFileName, setImageFileName] = useState<string | null>(null);
	const [coverFile, setCoverFile] = useState<File | null>(null);

	useEffect(() => {
		return () => {
			if (imagePreview?.startsWith("blob:")) {
				URL.revokeObjectURL(imagePreview);
			}
		};
	}, [imagePreview]);

	function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];

		if (!file) return;

		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
			removeImage();
			toast.error("Cover upload failed. Please try again.");
			event.target.value = "";
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			removeImage();
			toast.error("Cover upload failed. Please try again.");
			event.target.value = "";
			return;
		}

		if (imagePreview?.startsWith("blob:")) {
			URL.revokeObjectURL(imagePreview);
		}

		setImagePreview(URL.createObjectURL(file));
		setImageFileName(file.name);
		setCoverFile(file);
	}

	function removeImage() {
		if (imagePreview?.startsWith("blob:")) {
			URL.revokeObjectURL(imagePreview);
		}

		setImagePreview(null);
		setImageFileName(null);
		setCoverFile(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const form = event.currentTarget;
		const formData = new FormData(form);

		const name = formData.get("name")?.toString().trim() ?? "";
		const writer = formData.get("writer")?.toString().trim() ?? "";
		const link = formData.get("link")?.toString().trim() ?? "";
		const order = Number(formData.get("order") ?? 0);

		setIsPending(true);

		try {
			await createSongAction(
				{
					name,
					writer,
					link,
					isActive,
					order,
					coverFile,
				},
				{
					onUploading: () => setPendingStep("uploading"),
					onSaving: () => setPendingStep("saving"),
				},
			);

			toast.success("Song created successfully");

			form.reset();
			removeImage();
			setIsActive(true);

			await router.invalidate();
		} catch (error) {
			console.error("Failed to create song:", error);

			if (
				error instanceof Error &&
				error.message === "Cover upload failed. Please try again."
			) {
				toast.error("Cover upload failed. Please try again.");
			} else {
				toast.error("Failed to create song.");
			}
		} finally {
			setIsPending(false);
			setPendingStep("idle");
		}
	}

	return (
		<Card className="w-full shadow-none">
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="space-y-1">
						<CardTitle className="flex items-center gap-2 text-xl">
							<Music2 className="size-5" />
							Add Song
						</CardTitle>
						<CardDescription>
							Add your favorite songs to show on your portfolio.
						</CardDescription>
					</div>

					<div className="flex items-center gap-2 rounded-md border px-3 py-2">
						<Switch
							id="song-active"
							checked={isActive}
							onCheckedChange={setIsActive}
						/>
						<Label htmlFor="song-active" className="text-sm">
							Active
						</Label>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<form className="space-y-6" onSubmit={handleSubmit}>
					<div className="grid gap-5 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="song-name">Song Name</Label>
							<Input
								id="song-name"
								name="name"
								placeholder="Sweet Disposition"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="song-writer">Writer</Label>
							<Input
								id="song-writer"
								name="writer"
								placeholder="The Temper Trap"
								required
							/>
						</div>
					</div>

					<div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_160px]">
						<div className="space-y-2">
							<Label htmlFor="song-image">Cover Image</Label>

							<label
								htmlFor="song-image"
								className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted/20 px-4 text-center transition-colors hover:bg-muted/40"
							>
								<Upload className="size-5 text-muted-foreground" />

								<div className="space-y-1">
									<p className="text-sm font-medium">
										{imageFileName ?? "Choose cover image"}
									</p>

									<p className="text-xs text-muted-foreground">
										PNG, JPG, WEBP up to 5MB
									</p>
								</div>

								<Input
									id="song-image"
									name="coverFile"
									type="file"
									accept="image/png,image/jpeg,image/webp"
									className="hidden"
									onChange={handleImageChange}
									ref={fileInputRef}
								/>
							</label>

							<p className="text-xs text-muted-foreground">
								Cover will be uploaded to your R2 bucket when the form is saved.
							</p>

							<div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_120px]">
								<div className="space-y-2">
									<Label htmlFor="song-link">Link</Label>
									<div className="relative">
										<LinkIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
										<Input
											id="song-link"
											name="link"
											placeholder="https://open.spotify.com/track/..."
											className="pl-9"
											required
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="song-order">Order</Label>
									<Input
										id="song-order"
										name="order"
										type="number"
										min={0}
										defaultValue={0}
									/>
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<Label>Preview</Label>

							<div className="relative flex aspect-2/3 w-full items-center justify-center overflow-hidden rounded-md border bg-muted">
								{imagePreview ? (
									<>
										<img
											src={imagePreview}
											alt="Song cover preview"
											className="size-full object-cover"
										/>

										<Button
											type="button"
											variant="secondary"
											size="icon"
											className="absolute right-2 top-2 size-7"
											onClick={removeImage}
											aria-label="Remove selected image"
										>
											<X className="size-3.5" />
										</Button>
									</>
								) : (
									<div className="flex flex-col items-center gap-2 px-3 text-center text-muted-foreground">
										<ImageIcon className="size-5" />
										<span className="text-xs">No image selected</span>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="flex justify-end gap-3 border-t pt-6">
						<Button
							type="button"
							variant="outline"
							disabled={isPending}
							onClick={(event) => {
								const form = event.currentTarget.form;

								form?.reset();
								removeImage();
								setIsActive(true);
							}}
						>
							Cancel
						</Button>

						<Button type="submit" disabled={isPending}>
							<Save className="size-4" />
							{pendingStep === "uploading"
								? "Uploading..."
								: pendingStep === "saving"
									? "Saving..."
									: "Save Song"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
