import { useRouter } from "@tanstack/react-router";
import { ImageIcon, LinkIcon, Save, Upload, X } from "lucide-react";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Badge } from "#/components/ui/badge";
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
import { Textarea } from "#/components/ui/textarea";
import { updateProjectAction } from "#/features/projects/projects.actions";
import { projectsInputSchema } from "#/features/projects/projects.schema";
import type { ProjectItem } from "./project-table";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

type ProjectEditDialogProps = {
	project: ProjectItem | null;
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

export function ProjectEditDialog({
	project,
	open,
	onOpenChange,
}: ProjectEditDialogProps) {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const [isPending, setIsPending] = useState(false);
	const [pendingStep, setPendingStep] = useState<
		"idle" | "uploading" | "saving"
	>("idle");
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
	const [techStack, setTechStack] = useState<string[]>([]);
	const [techInput, setTechInput] = useState("");
	const [isCurrent, setIsCurrent] = useState(false);
	const [isSecret, setIsSecret] = useState(false);
	const [isActive, setIsActive] = useState(true);
	const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
	const [thumbnailFileName, setThumbnailFileName] = useState<string | null>(
		null,
	);
	const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
	const [shouldRemoveThumbnail, setShouldRemoveThumbnail] = useState(false);

	useEffect(() => {
		if (!project) {
			setName("");
			setSlug("");
			setIsSlugManuallyEdited(false);
			setTechStack([]);
			setTechInput("");
			setIsCurrent(false);
			setIsSecret(false);
			setIsActive(true);
			setThumbnailPreview(null);
			setThumbnailFileName(null);
			setThumbnailFile(null);
			setShouldRemoveThumbnail(false);
			return;
		}

		setName(project.name);
		setSlug(project.slug);
		setIsSlugManuallyEdited(false);
		setTechStack(project.techStack);
		setTechInput("");
		setIsCurrent(project.isCurrent);
		setIsSecret(project.isSecret);
		setIsActive(project.isActive);
		setThumbnailPreview(project.thumbnail);
		setThumbnailFileName(null);
		setThumbnailFile(null);
		setShouldRemoveThumbnail(false);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, [project]);

	useEffect(() => {
		return () => {
			if (thumbnailPreview?.startsWith("blob:")) {
				URL.revokeObjectURL(thumbnailPreview);
			}
		};
	}, [thumbnailPreview]);

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

	function addTechnology(value: string) {
		const technology = value.trim();

		if (!technology) return;

		const exists = techStack.some(
			(item) => item.toLowerCase() === technology.toLowerCase(),
		);

		if (exists) {
			setTechInput("");
			return;
		}

		setTechStack((items) => [...items, technology]);
		setTechInput("");
	}

	function handleTechKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (event.key !== "Enter" && event.key !== ",") return;

		event.preventDefault();
		addTechnology(techInput);
	}

	function removeTechnology(technology: string) {
		setTechStack((items) => items.filter((item) => item !== technology));
	}

	function resetSelectedThumbnail() {
		if (thumbnailPreview?.startsWith("blob:")) {
			URL.revokeObjectURL(thumbnailPreview);
		}

		setThumbnailPreview(
			shouldRemoveThumbnail ? null : (project?.thumbnail ?? null),
		);
		setThumbnailFileName(null);
		setThumbnailFile(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	function setSelectedThumbnail(file: File) {
		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
			resetSelectedThumbnail();
			toast.error("Project thumbnail must be a PNG, JPG, or WEBP image.");
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			resetSelectedThumbnail();
			toast.error("Project thumbnail must be 5 MB or smaller.");
			return;
		}

		if (thumbnailPreview?.startsWith("blob:")) {
			URL.revokeObjectURL(thumbnailPreview);
		}

		setThumbnailPreview(URL.createObjectURL(file));
		setThumbnailFileName(file.name);
		setThumbnailFile(file);
		setShouldRemoveThumbnail(false);
	}

	function handleThumbnailChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];

		if (!file) return;

		setSelectedThumbnail(file);
	}

	function removeExistingThumbnail() {
		if (thumbnailPreview?.startsWith("blob:")) {
			URL.revokeObjectURL(thumbnailPreview);
		}

		setThumbnailPreview(null);
		setThumbnailFileName(null);
		setThumbnailFile(null);
		setShouldRemoveThumbnail(true);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	function validateProjectInput(input: {
		name: string;
		slug: string;
		description: string;
		techStack: string[];
		isCurrent: boolean;
		isSecret: boolean;
		isActive: boolean;
		demoLink: string | null;
		repoLink: string | null;
		order: number;
	}) {
		if (!input.name) {
			toast.error("Project name is required.");
			return false;
		}

		if (!input.slug) {
			toast.error("Project slug is required.");
			return false;
		}

		if (!input.description) {
			toast.error("Project description is required.");
			return false;
		}

		if (input.techStack.length === 0) {
			toast.error("Add at least one technology.");
			return false;
		}

		const result = projectsInputSchema.safeParse({
			thumbnail: null,
			...input,
		});

		if (!result.success) {
			toast.error(result.error.issues[0]?.message ?? "Invalid project data.");
			return false;
		}

		return true;
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!project) return;

		const formData = new FormData(event.currentTarget);
		const description = formData.get("description")?.toString().trim() ?? "";
		const demoLink = formData.get("demoLink")?.toString().trim() ?? "";
		const repoLink = formData.get("repoLink")?.toString().trim() ?? "";
		const order = Number(formData.get("order") ?? 0);
		const input = {
			name: name.trim(),
			slug: slug.trim(),
			description,
			techStack,
			isCurrent,
			isSecret,
			isActive,
			demoLink: demoLink || null,
			repoLink: repoLink || null,
			order: Number.isNaN(order) ? 0 : order,
		};

		if (!validateProjectInput(input)) return;

		setIsPending(true);

		try {
			await updateProjectAction(
				{
					id: project.id,
					...input,
					currentThumbnail: project.thumbnail,
					thumbnailFile,
					shouldRemoveThumbnail,
				},
				{
					onUploading: () => setPendingStep("uploading"),
					onSaving: () => setPendingStep("saving"),
				},
			);

			toast.success("Project updated successfully");
			onOpenChange(false);
			await router.invalidate();
		} catch (error) {
			console.error("Failed to update project:", error);
			toast.error("Failed to update project.");
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
					<DialogTitle>Edit Project</DialogTitle>
					<DialogDescription>
						Update project details, thumbnail, tech stack, and visibility.
					</DialogDescription>
				</DialogHeader>

				<form
					key={project?.id ?? "empty"}
					className="space-y-6"
					onSubmit={handleSubmit}
				>
					<div className="grid gap-5 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="edit-project-name">Project Name</Label>
							<Input
								id="edit-project-name"
								name="name"
								placeholder="Tuwucook AI"
								value={name}
								onChange={(event) => handleNameChange(event.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="edit-project-slug">Slug</Label>
							<Input
								id="edit-project-slug"
								name="slug"
								placeholder="tuwucook-ai"
								value={slug}
								onChange={(event) => handleSlugChange(event.target.value)}
								required
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="edit-project-description">Description</Label>
						<Textarea
							id="edit-project-description"
							name="description"
							placeholder="AI cooking assistant that helps users generate recipes based on their kitchen ingredients."
							className="min-h-28 resize-none"
							defaultValue={project?.description ?? ""}
							required
						/>
					</div>

					<div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_160px]">
						<div className="space-y-2">
							<Label htmlFor="edit-project-thumbnail">Project Thumbnail</Label>

							<label
								htmlFor="edit-project-thumbnail"
								className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted/20 px-4 text-center transition-colors hover:bg-muted/40"
							>
								<Upload className="size-5 text-muted-foreground" />

								<div className="space-y-1">
									<p className="text-sm font-medium">
										{thumbnailFileName ?? "Choose project thumbnail"}
									</p>

									<p className="text-xs text-muted-foreground">
										PNG, JPG, WEBP up to 5MB
									</p>
								</div>

								<Input
									id="edit-project-thumbnail"
									name="thumbnailFile"
									type="file"
									accept="image/png,image/jpeg,image/webp"
									className="hidden"
									onChange={handleThumbnailChange}
									ref={fileInputRef}
								/>
							</label>
						</div>

						<div className="space-y-2">
							<Label>Preview</Label>

							<div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border bg-muted">
								{thumbnailPreview ? (
									<>
										<img
											src={thumbnailPreview}
											alt="Project thumbnail preview"
											className="size-full object-cover"
										/>

										<Button
											type="button"
											variant="secondary"
											size="icon"
											className="absolute right-2 top-2 size-7"
											onClick={
												thumbnailFile
													? resetSelectedThumbnail
													: removeExistingThumbnail
											}
											aria-label="Remove project thumbnail"
											disabled={isPending}
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

					<div className="space-y-2">
						<Label htmlFor="edit-project-tech-stack">Tech Stack</Label>
						<div className="flex min-h-10 flex-wrap items-center gap-2 rounded-md border bg-background px-3 py-2">
							{techStack.map((technology) => (
								<Badge key={technology} variant="secondary" className="gap-1">
									{technology}
									<button
										type="button"
										onClick={() => removeTechnology(technology)}
										className="rounded-sm text-muted-foreground hover:text-foreground"
										aria-label={`Remove ${technology}`}
									>
										<X className="size-3" />
									</button>
								</Badge>
							))}

							<input
								id="edit-project-tech-stack"
								value={techInput}
								onChange={(event) => setTechInput(event.target.value)}
								onKeyDown={handleTechKeyDown}
								placeholder={
									techStack.length === 0
										? "Next.js, Drizzle, PostgreSQL"
										: undefined
								}
								className="min-w-48 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
							/>
						</div>
						<p className="text-xs text-muted-foreground">
							Press Enter or comma to add a technology.
						</p>
					</div>

					<div className="grid gap-5 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="edit-project-demo-link">Demo Link</Label>
							<div className="relative">
								<LinkIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="edit-project-demo-link"
									name="demoLink"
									defaultValue={project?.demoLink ?? ""}
									placeholder="https://tuwucook.ai"
									className="pl-9"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="edit-project-repo-link">Repository Link</Label>
							<div className="relative">
								<LinkIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="edit-project-repo-link"
									name="repoLink"
									defaultValue={project?.repoLink ?? ""}
									placeholder="https://github.com/yayatooo/tuwucook"
									className="pl-9"
								/>
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="edit-project-order">Order</Label>
						<Input
							id="edit-project-order"
							name="order"
							type="number"
							min={0}
							defaultValue={project?.order ?? 0}
						/>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<div className="flex items-center gap-2 rounded-md border px-3 py-2">
							<Switch
								id="edit-project-active"
								checked={isActive}
								onCheckedChange={setIsActive}
							/>
							<Label htmlFor="edit-project-active" className="text-sm">
								Active
							</Label>
						</div>

						<div className="flex items-center gap-2 rounded-md border px-3 py-2">
							<Switch
								id="edit-project-current"
								checked={isCurrent}
								onCheckedChange={setIsCurrent}
							/>
							<Label htmlFor="edit-project-current" className="text-sm">
								Current Project
							</Label>
						</div>

						<div className="flex items-center gap-2 rounded-md border px-3 py-2">
							<Switch
								id="edit-project-secret"
								checked={isSecret}
								onCheckedChange={setIsSecret}
							/>
							<Label htmlFor="edit-project-secret" className="text-sm">
								Secret Project
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
									: "Save Changes"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
