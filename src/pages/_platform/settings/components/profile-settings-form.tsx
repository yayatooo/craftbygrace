import { useRouter } from "@tanstack/react-router";
import { BadgeCheck, ImageIcon, Save, Upload, X } from "lucide-react";
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
import { Textarea } from "#/components/ui/textarea";
import { updateProfileSettingsAction } from "#/features/settings/settings.actions";
import { profileSettingsInputSchema } from "#/features/settings/settings.schema";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

export type ProfileSettings = {
	name: string;
	image: string | null;
	username: string | null;
	headline: string | null;
	bio: string | null;
	isVerified: boolean;
	updatedAt: Date;
};

type ProfileSettingsFormProps = {
	profile: ProfileSettings;
};

function normalizeUsername(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "")
		.replace(/-+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export function ProfileSettingsForm({ profile }: ProfileSettingsFormProps) {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const [isPending, setIsPending] = useState(false);
	const [pendingStep, setPendingStep] = useState<
		"idle" | "uploading" | "saving"
	>("idle");
	const [isVerified, setIsVerified] = useState(profile.isVerified);
	const [imagePreview, setImagePreview] = useState<string | null>(
		profile.image,
	);
	const [imageFileName, setImageFileName] = useState<string | null>(null);
	const [profileFile, setProfileFile] = useState<File | null>(null);

	useEffect(() => {
		setIsVerified(profile.isVerified);
		setImagePreview(profile.image);
		setImageFileName(null);
		setProfileFile(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, [profile]);

	useEffect(() => {
		return () => {
			if (imagePreview?.startsWith("blob:")) {
				URL.revokeObjectURL(imagePreview);
			}
		};
	}, [imagePreview]);

	function resetSelectedImage() {
		if (imagePreview?.startsWith("blob:")) {
			URL.revokeObjectURL(imagePreview);
		}

		setImagePreview(profile.image);
		setImageFileName(null);
		setProfileFile(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	function setSelectedImage(file: File) {
		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
			resetSelectedImage();
			toast.error("Profile photo must be a PNG, JPG, or WEBP image.");
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			resetSelectedImage();
			toast.error("Profile photo must be 5 MB or smaller.");
			return;
		}

		if (imagePreview?.startsWith("blob:")) {
			URL.revokeObjectURL(imagePreview);
		}

		setImagePreview(URL.createObjectURL(file));
		setImageFileName(file.name);
		setProfileFile(file);
	}

	function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];

		if (!file) return;

		setSelectedImage(file);
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const name = formData.get("name")?.toString().trim() ?? "";
		const username = normalizeUsername(
			formData.get("username")?.toString() ?? "",
		);
		const headline = formData.get("headline")?.toString().trim() ?? "";
		const bio = formData.get("bio")?.toString().trim() ?? "";

		const input = {
			name,
			username: username || null,
			headline: headline || null,
			bio: bio || null,
			isVerified,
		};
		const result = profileSettingsInputSchema.safeParse(input);

		if (!result.success) {
			toast.error(result.error.issues[0]?.message ?? "Invalid profile data.");
			return;
		}

		setIsPending(true);

		try {
			await updateProfileSettingsAction(
				{
					...result.data,
					currentImage: profile.image,
					profileFile,
				},
				{
					onUploading: () => setPendingStep("uploading"),
					onSaving: () => setPendingStep("saving"),
				},
			);

			toast.success("Profile settings updated successfully");
			await router.invalidate();
		} catch (error) {
			console.error("Failed to update profile settings:", error);
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to update profile settings.",
			);
		} finally {
			setIsPending(false);
			setPendingStep("idle");
		}
	}

	return (
		<Card className="shadow-none">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-xl">
					<BadgeCheck className="size-5" />
					Public Profile
				</CardTitle>
				<CardDescription>
					Update the public profile shown across your portfolio.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<form
					key={String(profile.updatedAt)}
					className="space-y-6"
					onSubmit={handleSubmit}
				>
					<div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_180px]">
						<div className="space-y-2">
							<Label htmlFor="profile-photo">Profile Photo</Label>

							<label
								htmlFor="profile-photo"
								className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted/20 px-4 text-center transition-colors hover:bg-muted/40"
							>
								<Upload className="size-5 text-muted-foreground" />

								<div className="space-y-1">
									<p className="text-sm font-medium">
										{imageFileName ?? "Choose profile photo"}
									</p>
									<p className="text-xs text-muted-foreground">
										PNG, JPG, WEBP up to 5MB
									</p>
								</div>

								<Input
									id="profile-photo"
									name="profileFile"
									type="file"
									accept="image/png,image/jpeg,image/webp"
									className="hidden"
									onChange={handleImageChange}
									ref={fileInputRef}
								/>
							</label>

							<p className="text-xs text-muted-foreground">
								Leave unchanged to keep the current profile photo.
							</p>
						</div>

						<div className="space-y-2">
							<Label>Preview</Label>
							<div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border bg-muted">
								{imagePreview ? (
									<>
										<img
											src={imagePreview}
											alt="Profile preview"
											className="size-full object-cover"
										/>

										{profileFile ? (
											<Button
												type="button"
												variant="secondary"
												size="icon"
												className="absolute right-2 top-2 size-7"
												onClick={resetSelectedImage}
												disabled={isPending}
												aria-label="Remove selected profile photo"
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

					<div className="grid gap-5 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="profile-name">Name</Label>
							<Input
								id="profile-name"
								name="name"
								defaultValue={profile.name}
								placeholder="Yaya Tooo"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="profile-username">Username</Label>
							<Input
								id="profile-username"
								name="username"
								defaultValue={profile.username ?? ""}
								placeholder="yayatooo"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="profile-headline">Headline</Label>
						<Input
							id="profile-headline"
							name="headline"
							defaultValue={profile.headline ?? ""}
							placeholder="Frontend engineer building sharp portfolio systems"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="profile-bio">Bio</Label>
						<Textarea
							id="profile-bio"
							name="bio"
							defaultValue={profile.bio ?? ""}
							placeholder="Short public bio"
							className="min-h-32 resize-none"
						/>
					</div>

					<div className="flex items-center gap-2 rounded-md border px-3 py-2">
						<Switch
							id="profile-verified"
							checked={isVerified}
							onCheckedChange={setIsVerified}
						/>
						<Label htmlFor="profile-verified" className="text-sm">
							Verified badge
						</Label>
					</div>

					<div className="flex justify-end">
						<Button type="submit" disabled={isPending}>
							<Save className="size-4" />
							{pendingStep === "uploading"
								? "Uploading..."
								: pendingStep === "saving"
									? "Saving..."
									: "Save Profile"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
