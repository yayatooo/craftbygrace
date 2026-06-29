import { useRouter } from "@tanstack/react-router";
import { ImageIcon, LinkIcon, Save, Upload, X } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
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
import { updateSongAction } from "#/features/songs/songs.actions";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

export type SongItem = {
	id: string;
	name: string;
	writer: string;
	image: string | null;
	link: string;
	isActive: boolean;
	order: number;
	createdAt: Date;
	updatedAt: Date;
};

type SongEditDialogProps = {
	song: SongItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function SongEditDialog({
	song,
	open,
	onOpenChange,
}: SongEditDialogProps) {
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
		if (!song) {
			setIsActive(true);
			setImagePreview(null);
			setImageFileName(null);
			setCoverFile(null);
			return;
		}

		setIsActive(song.isActive);
		setImagePreview(song.image);
		setImageFileName(null);
		setCoverFile(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, [song]);

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
			setImagePreview(song?.image ?? null);
		}

		setImageFileName(null);
		setCoverFile(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];

		if (!file) return;

		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
			resetSelectedFile();
			toast.error("Cover upload failed. Please try again.");
			event.target.value = "";
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			resetSelectedFile();
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

		if (!song) return;

		const formData = new FormData(event.currentTarget);
		const name = formData.get("name")?.toString().trim() ?? "";
		const writer = formData.get("writer")?.toString().trim() ?? "";
		const link = formData.get("link")?.toString().trim() ?? "";
		const order = Number(formData.get("order") ?? 0);
		const currentImage = imagePreview?.startsWith("blob:")
			? song.image
			: imagePreview;

		setIsPending(true);

		try {
			await updateSongAction(
				{
					id: song.id,
					name,
					writer,
					link,
					isActive,
					order,
					currentImage,
					coverFile,
				},
				{
					onUploading: () => setPendingStep("uploading"),
					onSaving: () => setPendingStep("saving"),
				},
			);

			toast.success("Song updated successfully");
			onOpenChange(false);
			await router.invalidate();
		} catch (error) {
			console.error("Failed to update song:", error);

			if (
				error instanceof Error &&
				error.message === "Cover upload failed. Please try again."
			) {
				toast.error("Cover upload failed. Please try again.");
			} else {
				toast.error("Failed to update song.");
			}
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
					<DialogTitle>Edit Song</DialogTitle>
					<DialogDescription>
						Update song details and cover display information.
					</DialogDescription>
				</DialogHeader>

				<form
					key={song?.id ?? "empty"}
					className="space-y-6"
					onSubmit={handleSubmit}
				>
					<div className="grid gap-5 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="edit-song-name">Song Name</Label>
							<Input
								id="edit-song-name"
								name="name"
								defaultValue={song?.name ?? ""}
								placeholder="Sweet Disposition"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="edit-song-writer">Writer</Label>
							<Input
								id="edit-song-writer"
								name="writer"
								defaultValue={song?.writer ?? ""}
								placeholder="The Temper Trap"
								required
							/>
						</div>
					</div>

					<div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_160px]">
						<div className="space-y-2">
							<Label htmlFor="edit-song-image">Cover Image</Label>

							<label
								htmlFor="edit-song-image"
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
									id="edit-song-image"
									name="coverFile"
									type="file"
									accept="image/png,image/jpeg,image/webp"
									className="hidden"
									onChange={handleImageChange}
									ref={fileInputRef}
								/>
							</label>

							<p className="text-xs text-muted-foreground">
								Leave unchanged to keep the current cover.
							</p>

							<div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_120px]">
								<div className="space-y-2">
									<Label htmlFor="edit-song-link">Link</Label>
									<div className="relative">
										<LinkIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
										<Input
											id="edit-song-link"
											name="link"
											defaultValue={song?.link ?? ""}
											placeholder="https://open.spotify.com/track/..."
											className="pl-9"
											required
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="edit-song-order">Order</Label>
									<Input
										id="edit-song-order"
										name="order"
										type="number"
										min={0}
										defaultValue={song?.order ?? 0}
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

					<div className="flex items-center gap-2 rounded-md border px-3 py-2">
						<Switch
							id="edit-song-active"
							checked={isActive}
							onCheckedChange={setIsActive}
						/>
						<Label htmlFor="edit-song-active" className="text-sm">
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
