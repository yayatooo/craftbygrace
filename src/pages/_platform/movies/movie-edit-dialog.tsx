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
import { updateMovieFn } from "#/features/movies/movies.function";

export type MovieItem = {
	id: string;
	name: string;
	type: string;
	image: string | null;
	link: string | null;
	isActive: boolean;
	order: number;
};

type UploadPosterResponse = {
	key: string;
	url: string;
};

type MovieEditDialogProps = {
	movie: MovieItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function MovieEditDialog({
	movie,
	open,
	onOpenChange,
}: MovieEditDialogProps) {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const [isPending, setIsPending] = useState(false);
	const [isActive, setIsActive] = useState(true);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [imageFileName, setImageFileName] = useState<string | null>(null);
	const [posterFile, setPosterFile] = useState<File | null>(null);

	useEffect(() => {
		if (!movie) {
			setIsActive(true);
			setImagePreview(null);
			setImageFileName(null);
			setPosterFile(null);
			return;
		}

		setIsActive(movie.isActive);
		setImagePreview(movie.image);
		setImageFileName(null);
		setPosterFile(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, [movie]);

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

		if (imagePreview?.startsWith("blob:")) {
			URL.revokeObjectURL(imagePreview);
		}

		setImagePreview(URL.createObjectURL(file));
		setImageFileName(file.name);
		setPosterFile(file);
	}

	function removeSelectedImage() {
		if (imagePreview?.startsWith("blob:")) {
			URL.revokeObjectURL(imagePreview);
		}

		setImagePreview(movie?.image ?? null);
		setImageFileName(null);
		setPosterFile(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	async function uploadPoster(file: File) {
		const uploadFormData = new FormData();
		uploadFormData.set("posterFile", file);

		const response = await fetch("/api/movies/poster", {
			method: "POST",
			body: uploadFormData,
		});

		const result = await response.json().catch(() => null);

		if (!response.ok) {
			const message =
				result && typeof result.error === "string"
					? result.error
					: "Poster upload failed. Please try again.";

			throw new Error(message);
		}

		return result as UploadPosterResponse;
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!movie) return;

		const formData = new FormData(event.currentTarget);
		const name = formData.get("name")?.toString().trim() ?? "";
		const type = formData.get("type")?.toString().trim() ?? "";
		const link = formData.get("link")?.toString().trim() ?? "";
		const order = Number(formData.get("order") ?? 0);

		setIsPending(true);
		let uploadedPosterKey: string | null = null;

		try {
			let image = movie.image;

			if (posterFile) {
				try {
					const uploadResult = await uploadPoster(posterFile);
					uploadedPosterKey = uploadResult.key;
					image = uploadResult.url;
				} catch (error) {
					console.error("Failed to upload replacement movie poster:", error);
					toast.error(
						error instanceof Error
							? `Poster upload failed: ${error.message}`
							: "Poster upload failed. Please try again.",
					);
					return;
				}
			}

			try {
				await updateMovieFn({
					data: {
						id: movie.id,
						data: {
							name,
							type,
							image,
							link: link || null,
							isActive,
							order,
						},
					},
				});
			} catch (error) {
				if (uploadedPosterKey) {
					console.error(
						"Movie update failed after poster upload. Orphaned R2 object key:",
						uploadedPosterKey,
					);
				}

				throw error;
			}

			toast.success("Movie updated successfully");
			onOpenChange(false);
			await router.invalidate();
		} catch (error) {
			console.error("Failed to update movie:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to update movie.",
			);
		} finally {
			setIsPending(false);
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
					<DialogTitle>Edit Movie</DialogTitle>
					<DialogDescription>
						Update movie details and poster display information.
					</DialogDescription>
				</DialogHeader>

				<form
					key={movie?.id ?? "empty"}
					className="space-y-6"
					onSubmit={handleSubmit}
				>
					<div className="grid gap-5 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="edit-movie-name">Movie Name</Label>
							<Input
								id="edit-movie-name"
								name="name"
								defaultValue={movie?.name ?? ""}
								placeholder="Interstellar"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="edit-movie-type">Type</Label>
							<Input
								id="edit-movie-type"
								name="type"
								defaultValue={movie?.type ?? ""}
								placeholder="Movie, Series, Anime, Documentary"
							/>
						</div>
					</div>

					<div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_160px]">
						<div className="space-y-2">
							<Label htmlFor="edit-movie-image">Movie Poster</Label>

							<label
								htmlFor="edit-movie-image"
								className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted/20 px-4 text-center transition-colors hover:bg-muted/40"
							>
								<Upload className="size-5 text-muted-foreground" />

								<div className="space-y-1">
									<p className="text-sm font-medium">
										{imageFileName ?? "Choose replacement poster"}
									</p>

									<p className="text-xs text-muted-foreground">
										PNG, JPG, WEBP up to 5MB
									</p>
								</div>

								<Input
									id="edit-movie-image"
									name="posterFile"
									type="file"
									accept="image/png,image/jpeg,image/webp"
									className="hidden"
									onChange={handleImageChange}
									ref={fileInputRef}
								/>
							</label>

							<p className="text-xs text-muted-foreground">
								Leave unchanged to keep the current poster.
							</p>

							<div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_120px]">
								<div className="space-y-2">
									<Label htmlFor="edit-movie-link">Link</Label>
									<div className="relative">
										<LinkIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
										<Input
											id="edit-movie-link"
											name="link"
											defaultValue={movie?.link ?? ""}
											placeholder="https://letterboxd.com/..."
											className="pl-9"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="edit-movie-order">Order</Label>
									<Input
										id="edit-movie-order"
										name="order"
										type="number"
										min={0}
										defaultValue={movie?.order ?? 0}
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
											alt="Movie poster preview"
											className="size-full object-cover"
										/>

										{posterFile ? (
											<Button
												type="button"
												variant="secondary"
												size="icon"
												className="absolute right-2 top-2 size-7"
												onClick={removeSelectedImage}
												aria-label="Remove selected image"
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
						</div>
					</div>

					<div className="flex items-center gap-2 rounded-md border px-3 py-2">
						<Switch
							id="edit-movie-active"
							checked={isActive}
							onCheckedChange={setIsActive}
						/>
						<Label htmlFor="edit-movie-active" className="text-sm">
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
							{isPending ? "Saving..." : "Save Movie"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
