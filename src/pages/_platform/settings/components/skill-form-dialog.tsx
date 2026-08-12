import { useRouter } from "@tanstack/react-router";
import { ImageIcon, Save, Upload, X } from "lucide-react";
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
import {
	createSkillAction,
	updateSkillAction,
} from "#/features/settings/skills.actions";
import { skillFieldsSchema } from "#/features/settings/skills.schema";

import type { SkillItem } from "./skills-table";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
	"image/png",
	"image/jpeg",
	"image/webp",
	"image/svg+xml",
];

type SkillFormDialogProps = {
	skill: SkillItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

function generateSlug(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "")
		.replace(/-+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export function SkillFormDialog({
	skill,
	open,
	onOpenChange,
}: SkillFormDialogProps) {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const isEditing = Boolean(skill);

	const [isPending, setIsPending] = useState(false);
	const [pendingStep, setPendingStep] = useState<
		"idle" | "uploading" | "saving"
	>("idle");
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
	const [isActive, setIsActive] = useState(true);
	const [iconPreview, setIconPreview] = useState<string | null>(null);
	const [iconFileName, setIconFileName] = useState<string | null>(null);
	const [iconFile, setIconFile] = useState<File | null>(null);

	useEffect(() => {
		if (!open) return;

		if (!skill) {
			setName("");
			setSlug("");
			setIsSlugManuallyEdited(false);
			setIsActive(true);
			setIconPreview(null);
			setIconFileName(null);
			setIconFile(null);
		} else {
			setName(skill.name);
			setSlug(skill.slug);
			setIsSlugManuallyEdited(false);
			setIsActive(skill.isActive);
			setIconPreview(skill.icon);
			setIconFileName(null);
			setIconFile(null);
		}

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, [skill, open]);

	useEffect(() => {
		return () => {
			if (iconPreview?.startsWith("blob:")) {
				URL.revokeObjectURL(iconPreview);
			}
		};
	}, [iconPreview]);

	function handleNameChange(value: string) {
		setName(value);

		if (!isSlugManuallyEdited) {
			setSlug(generateSlug(value));
		}
	}

	function handleSlugChange(value: string) {
		setIsSlugManuallyEdited(true);
		setSlug(generateSlug(value));
	}

	function resetSelectedIcon() {
		if (iconPreview?.startsWith("blob:")) {
			URL.revokeObjectURL(iconPreview);
		}

		setIconPreview(skill?.icon ?? null);
		setIconFileName(null);
		setIconFile(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	function setSelectedIcon(file: File) {
		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
			resetSelectedIcon();
			toast.error("Skill icon must be a PNG, JPG, WEBP, or SVG image.");
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			resetSelectedIcon();
			toast.error("Skill icon must be 5 MB or smaller.");
			return;
		}

		if (iconPreview?.startsWith("blob:")) {
			URL.revokeObjectURL(iconPreview);
		}

		setIconPreview(URL.createObjectURL(file));
		setIconFileName(file.name);
		setIconFile(file);
	}

	function handleIconChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];

		if (!file) return;

		setSelectedIcon(file);
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const order = Number(formData.get("order") ?? 0);
		const input = {
			name: name.trim(),
			slug: slug.trim(),
			isActive,
			order: Number.isNaN(order) ? 0 : order,
		};
		const result = skillFieldsSchema.safeParse(input);

		if (!result.success) {
			toast.error(result.error.issues[0]?.message ?? "Invalid skill data.");
			return;
		}

		if (!isEditing && !iconFile) {
			toast.error("Skill icon is required.");
			return;
		}

		setIsPending(true);

		try {
			if (skill) {
				await updateSkillAction(
					{
						id: skill.id,
						...result.data,
						iconFile,
					},
					{
						onUploading: () => setPendingStep("uploading"),
						onSaving: () => setPendingStep("saving"),
					},
				);

				toast.success("Skill updated successfully");
			} else if (iconFile) {
				await createSkillAction(
					{
						...result.data,
						iconFile,
					},
					{
						onUploading: () => setPendingStep("uploading"),
						onSaving: () => setPendingStep("saving"),
					},
				);

				toast.success("Skill created successfully");
			}

			onOpenChange(false);
			await router.invalidate();
		} catch (error) {
			console.error("Failed to save skill:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to save skill.",
			);
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
					<DialogTitle>{isEditing ? "Edit Skill" : "Add Skill"}</DialogTitle>
					<DialogDescription>
						Manage skill display details, icon, order, and status.
					</DialogDescription>
				</DialogHeader>

				<form
					key={skill?.id ?? "new"}
					className="space-y-6"
					onSubmit={handleSubmit}
				>
					<div className="grid gap-5 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="skill-name">Name</Label>
							<Input
								id="skill-name"
								name="name"
								value={name}
								onChange={(event) => handleNameChange(event.target.value)}
								placeholder="React"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="skill-slug">Slug</Label>
							<Input
								id="skill-slug"
								name="slug"
								value={slug}
								onChange={(event) => handleSlugChange(event.target.value)}
								placeholder="react"
								required
							/>
						</div>
					</div>

					<div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_160px]">
						<div className="space-y-2">
							<Label htmlFor="skill-icon">Icon</Label>
							<label
								htmlFor="skill-icon"
								className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted/20 px-4 text-center transition-colors hover:bg-muted/40"
							>
								<Upload className="size-5 text-muted-foreground" />

								<div className="space-y-1">
									<p className="text-sm font-medium">
										{iconFileName ??
											(isEditing
												? "Choose replacement icon"
												: "Choose skill icon")}
									</p>
									<p className="text-xs text-muted-foreground">
										PNG, JPG, WEBP, SVG up to 5MB
									</p>
								</div>

								<Input
									id="skill-icon"
									name="skillIconFile"
									type="file"
									accept="image/png,image/jpeg,image/webp,image/svg+xml"
									className="hidden"
									onChange={handleIconChange}
									ref={fileInputRef}
								/>
							</label>
						</div>

						<div className="space-y-2">
							<Label>Preview</Label>
							<div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border bg-muted">
								{iconPreview ? (
									<>
										<img
											src={iconPreview}
											alt="Skill icon preview"
											className="size-full object-contain p-4"
										/>

										{iconFile ? (
											<Button
												type="button"
												variant="secondary"
												size="icon"
												className="absolute right-2 top-2 size-7"
												onClick={resetSelectedIcon}
												disabled={isPending}
												aria-label="Remove selected skill icon"
											>
												<X className="size-3.5" />
											</Button>
										) : null}
									</>
								) : (
									<div className="flex flex-col items-center gap-2 px-3 text-center text-muted-foreground">
										<ImageIcon className="size-5" />
										<span className="text-xs">No icon selected</span>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="grid gap-5 md:grid-cols-[120px_minmax(0,1fr)]">
						<div className="space-y-2">
							<Label htmlFor="skill-order">Order</Label>
							<Input
								id="skill-order"
								name="order"
								type="number"
								min={0}
								defaultValue={skill?.order ?? 0}
							/>
						</div>

						<div className="flex items-center gap-2 self-end rounded-md border px-3 py-2">
							<Switch
								id="skill-active"
								checked={isActive}
								onCheckedChange={setIsActive}
							/>
							<Label htmlFor="skill-active" className="text-sm">
								Active
							</Label>
						</div>
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
									: isEditing
										? "Save Changes"
										: "Create Skill"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
