import { useRouter } from "@tanstack/react-router";
import {
	BriefcaseBusiness,
	Building2,
	CalendarDays,
	ImageIcon,
	MapPin,
	Save,
	Upload,
	X,
} from "lucide-react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { Switch } from "#/components/ui/switch";
import {
	type ExperienceJobType,
	updateExperienceAction,
} from "#/features/experiences/experiences.actions";
import type { ExperienceItem } from "./experience-table";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

const jobTypeOptions: Array<{ value: ExperienceJobType; label: string }> = [
	{ value: "full_time", label: "Full-time" },
	{ value: "part_time", label: "Part-time" },
	{ value: "freelance", label: "Freelance" },
	{ value: "contract", label: "Contract" },
	{ value: "internship", label: "Internship" },
	{ value: "self_employed", label: "Self-employed" },
];

type ExperienceEditDialogProps = {
	experience: ExperienceItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

function toDateInputValue(value: Date | string | null) {
	if (!value) return "";

	const date = value instanceof Date ? value : new Date(value);

	if (Number.isNaN(date.getTime())) return "";

	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, "0");
	const day = String(date.getUTCDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

function isExperienceJobType(value: string): value is ExperienceJobType {
	return jobTypeOptions.some((option) => option.value === value);
}

export function ExperienceEditDialog({
	experience,
	open,
	onOpenChange,
}: ExperienceEditDialogProps) {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const [isPending, setIsPending] = useState(false);
	const [pendingStep, setPendingStep] = useState<
		"idle" | "uploading" | "saving"
	>("idle");
	const [isCurrent, setIsCurrent] = useState(false);
	const [typeJob, setTypeJob] = useState<ExperienceJobType>("full_time");
	const [endDate, setEndDate] = useState("");
	const [logoPreview, setLogoPreview] = useState<string | null>(null);
	const [logoFileName, setLogoFileName] = useState<string | null>(null);
	const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);
	const [shouldRemoveCompanyLogo, setShouldRemoveCompanyLogo] = useState(false);

	useEffect(() => {
		if (!experience) {
			setIsCurrent(false);
			setTypeJob("full_time");
			setEndDate("");
			setLogoPreview(null);
			setLogoFileName(null);
			setCompanyLogoFile(null);
			setShouldRemoveCompanyLogo(false);
			return;
		}

		setIsCurrent(experience.isCurrent);
		setTypeJob(
			isExperienceJobType(experience.typeJob)
				? experience.typeJob
				: "full_time",
		);
		setEndDate(
			experience.isCurrent ? "" : toDateInputValue(experience.endDate),
		);
		setLogoPreview(experience.companyLogo);
		setLogoFileName(null);
		setCompanyLogoFile(null);
		setShouldRemoveCompanyLogo(false);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, [experience]);

	useEffect(() => {
		return () => {
			if (logoPreview?.startsWith("blob:")) {
				URL.revokeObjectURL(logoPreview);
			}
		};
	}, [logoPreview]);

	function handleCurrentChange(value: boolean) {
		setIsCurrent(value);

		if (value) {
			setEndDate("");
		}
	}

	function setSelectedLogo(file: File) {
		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
			resetSelectedLogo();
			toast.error("Company logo must be a PNG, JPG, or WEBP image.");
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			resetSelectedLogo();
			toast.error("Company logo must be 5 MB or smaller.");
			return;
		}

		if (logoPreview?.startsWith("blob:")) {
			URL.revokeObjectURL(logoPreview);
		}

		setLogoPreview(URL.createObjectURL(file));
		setLogoFileName(file.name);
		setCompanyLogoFile(file);
		setShouldRemoveCompanyLogo(false);
	}

	function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];

		if (!file) return;

		setSelectedLogo(file);
	}

	function resetSelectedLogo() {
		if (logoPreview?.startsWith("blob:")) {
			URL.revokeObjectURL(logoPreview);
		}

		setLogoPreview(
			shouldRemoveCompanyLogo ? null : (experience?.companyLogo ?? null),
		);
		setLogoFileName(null);
		setCompanyLogoFile(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	function removeExistingLogo() {
		if (logoPreview?.startsWith("blob:")) {
			URL.revokeObjectURL(logoPreview);
		}

		setLogoPreview(null);
		setLogoFileName(null);
		setCompanyLogoFile(null);
		setShouldRemoveCompanyLogo(true);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	function restoreExistingLogo() {
		setLogoPreview(experience?.companyLogo ?? null);
		setLogoFileName(null);
		setCompanyLogoFile(null);
		setShouldRemoveCompanyLogo(false);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	function validateDates(startDate: string, nextEndDate: string | null) {
		if (!startDate) {
			toast.error("Start date is required.");
			return false;
		}

		if (!isCurrent && !nextEndDate) {
			toast.error("End date is required unless this is a current position.");
			return false;
		}

		if (nextEndDate && new Date(nextEndDate) < new Date(startDate)) {
			toast.error("End date cannot be earlier than start date.");
			return false;
		}

		return true;
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!experience) return;

		const formData = new FormData(event.currentTarget);
		const companyName = formData.get("companyName")?.toString().trim() ?? "";
		const role = formData.get("role")?.toString().trim() ?? "";
		const startDate = formData.get("startDate")?.toString() ?? "";
		const nextEndDate = isCurrent ? null : endDate || null;
		const location = formData.get("location")?.toString().trim() ?? "";
		const order = Number(formData.get("order") ?? 0);

		if (!validateDates(startDate, nextEndDate)) return;

		setIsPending(true);

		try {
			await updateExperienceAction(
				{
					id: experience.id,
					companyName,
					role,
					startDate,
					endDate: nextEndDate,
					isCurrent,
					typeJob,
					location: location || null,
					order,
					currentCompanyLogo: experience.companyLogo,
					companyLogoFile,
					shouldRemoveCompanyLogo,
				},
				{
					onUploading: () => setPendingStep("uploading"),
					onSaving: () => setPendingStep("saving"),
				},
			);

			toast.success("Experience updated successfully");
			onOpenChange(false);
			await router.invalidate();
		} catch (error) {
			console.error("Failed to update experience:", error);
			toast.error("Failed to update experience.");
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
					<DialogTitle>Edit Experience</DialogTitle>
					<DialogDescription>
						Update work history, freelance work, or professional path details.
					</DialogDescription>
				</DialogHeader>

				<form
					key={experience?.id ?? "empty"}
					className="space-y-6"
					onSubmit={handleSubmit}
				>
					<div className="grid gap-5 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="edit-experience-company">Company Name</Label>
							<div className="relative">
								<Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="edit-experience-company"
									name="companyName"
									defaultValue={experience?.companyName ?? ""}
									placeholder="Evindo Global Putra"
									className="pl-9"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="edit-experience-role">Role</Label>
							<div className="relative">
								<BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="edit-experience-role"
									name="role"
									defaultValue={experience?.role ?? ""}
									placeholder="Full Stack Developer"
									className="pl-9"
									required
								/>
							</div>
						</div>
					</div>

					<div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_160px]">
						<div className="space-y-2">
							<Label htmlFor="edit-experience-company-logo">Company Logo</Label>

							<label
								htmlFor="edit-experience-company-logo"
								className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted/20 px-4 text-center transition-colors hover:bg-muted/40"
							>
								<Upload className="size-5 text-muted-foreground" />

								<div className="space-y-1">
									<p className="text-sm font-medium">
										{logoFileName ?? "Choose company logo"}
									</p>

									<p className="text-xs text-muted-foreground">
										PNG, JPG, WEBP up to 5MB
									</p>
								</div>

								<Input
									id="edit-experience-company-logo"
									name="companyLogoFile"
									type="file"
									accept="image/png,image/jpeg,image/webp"
									className="hidden"
									onChange={handleLogoChange}
									ref={fileInputRef}
								/>
							</label>
						</div>

						<div className="space-y-2">
							<Label>Preview</Label>

							<div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border bg-muted">
								{logoPreview ? (
									<>
										<img
											src={logoPreview}
											alt="Company logo preview"
											className="size-full object-cover"
										/>

										<Button
											type="button"
											variant="secondary"
											size="icon"
											className="absolute right-2 top-2 size-7"
											onClick={
												companyLogoFile ? resetSelectedLogo : removeExistingLogo
											}
											aria-label="Remove company logo"
											disabled={isPending}
										>
											<X className="size-3.5" />
										</Button>
									</>
								) : (
									<div className="flex flex-col items-center gap-2 px-3 text-center text-muted-foreground">
										<ImageIcon className="size-5" />
										<span className="text-xs">No logo selected</span>
									</div>
								)}
							</div>

							{shouldRemoveCompanyLogo && experience?.companyLogo ? (
								<Button
									type="button"
									variant="outline"
									size="sm"
									disabled={isPending}
									onClick={restoreExistingLogo}
								>
									Restore Logo
								</Button>
							) : null}
						</div>
					</div>

					<div className="grid gap-5 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="edit-experience-start-date">Start Date</Label>
							<div className="relative">
								<CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="edit-experience-start-date"
									name="startDate"
									type="date"
									defaultValue={toDateInputValue(experience?.startDate ?? null)}
									className="pl-9"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="edit-experience-end-date">End Date</Label>
							<div className="relative">
								<CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="edit-experience-end-date"
									name="endDate"
									type="date"
									value={endDate}
									onChange={(event) => setEndDate(event.target.value)}
									className="pl-9"
									disabled={isCurrent}
									required={!isCurrent}
								/>
							</div>
							<p className="text-xs text-muted-foreground">
								{isCurrent
									? "End date is not required for a current position."
									: "End date is required unless this is your current role."}
							</p>
						</div>
					</div>

					<div className="grid gap-5 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="edit-experience-type-job">Job Type</Label>
							<Select
								value={typeJob}
								onValueChange={(value) =>
									setTypeJob(value as ExperienceJobType)
								}
							>
								<SelectTrigger id="edit-experience-type-job" name="typeJob">
									<SelectValue placeholder="Select job type" />
								</SelectTrigger>
								<SelectContent>
									{jobTypeOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="edit-experience-location">Location</Label>
							<div className="relative">
								<MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="edit-experience-location"
									name="location"
									defaultValue={experience?.location ?? ""}
									placeholder="Jakarta, Indonesia"
									className="pl-9"
								/>
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="edit-experience-order">Order</Label>
						<Input
							id="edit-experience-order"
							name="order"
							type="number"
							min={0}
							defaultValue={experience?.order ?? 0}
						/>
					</div>

					<div className="flex items-center gap-2 rounded-md border px-3 py-2">
						<Switch
							id="edit-experience-current"
							checked={isCurrent}
							onCheckedChange={handleCurrentChange}
						/>
						<Label htmlFor="edit-experience-current" className="text-sm">
							Current Position
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
