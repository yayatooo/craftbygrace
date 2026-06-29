import { useRouter } from "@tanstack/react-router";
import { Film, ImageIcon, LinkIcon, Save, Upload, X } from "lucide-react";
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
import { createMovieAction } from "#/features/movies/movies.actions";

export function MovieFormCard() {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const [isPending, setIsPending] = useState(false);
	const [pendingStep, setPendingStep] = useState<
		"idle" | "uploading" | "saving"
	>("idle");
	const [isActive, setIsActive] = useState(true);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [imageFileName, setImageFileName] = useState<string | null>(null);
	const [posterFile, setPosterFile] = useState<File | null>(null);

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

	function removeImage() {
		if (imagePreview?.startsWith("blob:")) {
			URL.revokeObjectURL(imagePreview);
		}

		setImagePreview(null);
		setImageFileName(null);
		setPosterFile(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const form = event.currentTarget;
		const formData = new FormData(form);

		const name = formData.get("name")?.toString().trim() ?? "";
		const type = formData.get("type")?.toString().trim() ?? "";
		const link = formData.get("link")?.toString().trim() ?? "";
		const order = Number(formData.get("order") ?? 0);

		setIsPending(true);

		try {
			await createMovieAction(
				{
					name,
					type,
					link: link || null,
					isActive,
					order,
					posterFile,
				},
				{
					onUploading: () => setPendingStep("uploading"),
					onSaving: () => setPendingStep("saving"),
				},
			);

			toast.success("Movie created successfully");

			form.reset();
			removeImage();
			setIsActive(true);

			await router.invalidate();
		} catch (error) {
			console.error("Failed to create movie:", error);

			toast.error("Failed to create movie.");
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
							<Film className="size-5" />
							Add Movie
						</CardTitle>
						<CardDescription>
							Add movies, series, or documentaries that you want to show on your
							portfolio.
						</CardDescription>
					</div>

					<div className="flex items-center gap-2 rounded-md border px-3 py-2">
						<Switch
							id="movie-active"
							checked={isActive}
							onCheckedChange={setIsActive}
						/>
						<Label htmlFor="movie-active" className="text-sm">
							Active
						</Label>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<form className="space-y-6" onSubmit={handleSubmit}>
					<div className="grid gap-5 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="movie-name">Movie Name</Label>
							<Input id="movie-name" name="name" placeholder="Interstellar" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="movie-type">Type</Label>
							<Input
								id="movie-type"
								name="type"
								placeholder="Movie, Series, Anime, Documentary"
							/>
						</div>
					</div>

					<div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_160px]">
						<div className="space-y-2">
							<Label htmlFor="movie-image">Movie Poster</Label>

							<label
								htmlFor="movie-image"
								className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted/20 px-4 text-center transition-colors hover:bg-muted/40"
							>
								<Upload className="size-5 text-muted-foreground" />

								<div className="space-y-1">
									<p className="text-sm font-medium">
										{imageFileName ?? "Choose poster image"}
									</p>

									<p className="text-xs text-muted-foreground">
										PNG, JPG, WEBP up to 5MB
									</p>
								</div>

								<Input
									id="movie-image"
									name="posterFile"
									type="file"
									accept="image/png,image/jpeg,image/webp"
									className="hidden"
									onChange={handleImageChange}
									ref={fileInputRef}
								/>
							</label>

							<p className="text-xs text-muted-foreground">
								Poster will be uploaded to your R2 bucket when the form is
								saved.
							</p>

							<div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_120px]">
								<div className="space-y-2">
									<Label htmlFor="movie-link">Link</Label>
									<div className="relative">
										<LinkIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
										<Input
											id="movie-link"
											name="link"
											placeholder="https://letterboxd.com/..."
											className="pl-9"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="movie-order">Order</Label>
									<Input
										id="movie-order"
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
											alt="Movie poster preview"
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
									: "Save Movie"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
