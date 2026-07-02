import { useRouter } from "@tanstack/react-router";
import {
	BriefcaseBusiness,
	Building2,
	CalendarDays,
	MapPin,
	MoreHorizontal,
	Pencil,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "#/components/ui/alert-dialog";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Switch } from "#/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { deleteExperienceAction } from "#/features/experiences/experiences.actions";
import { ExperienceEditDialog } from "./experience-edit-dialog";

type JobType =
	| "full_time"
	| "part_time"
	| "freelance"
	| "contract"
	| "internship"
	| "self_employed";

export type ExperienceItem = {
	id: string;
	companyName: string;
	role: string;
	companyLogo: string | null;
	startDate: Date;
	endDate: Date | null;
	isCurrent: boolean;
	typeJob: string;
	location: string | null;
	order: number;
	createdAt: Date;
	updatedAt: Date;
};

type ExperienceTableProps = {
	data?: ExperienceItem[];
};

export function ExperienceTable({ data = [] }: ExperienceTableProps) {
	const router = useRouter();

	const [selectedExperience, setSelectedExperience] =
		useState<ExperienceItem | null>(null);
	const [editingExperience, setEditingExperience] =
		useState<ExperienceItem | null>(null);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	function handleEdit(experience: ExperienceItem) {
		setEditingExperience(experience);
		setIsEditOpen(true);
	}

	function handleToggleCurrent(experience: ExperienceItem, value: boolean) {
		console.log("toggle current:", experience.id, value);
	}

	async function handleDelete() {
		if (!selectedExperience) return;

		const experienceToDelete = selectedExperience;

		setIsDeleting(true);

		try {
			await deleteExperienceAction({
				id: experienceToDelete.id,
			});

			toast.success("Experience deleted successfully");
			setSelectedExperience(null);
			await router.invalidate();
		} catch (error) {
			console.error("Failed to delete experience:", error);
			toast.error("Failed to delete experience.");
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<>
			<div className="overflow-hidden rounded-2xl border bg-background">
				<Table>
					<TableHeader>
						<TableRow className="bg-muted/40 hover:bg-muted/40">
							<TableHead>Company</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Period</TableHead>
							<TableHead>Location</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="w-22.5">Order</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{data.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={8}
									className="h-24 text-center text-muted-foreground"
								>
									Belum ada data experience.
								</TableCell>
							</TableRow>
						) : (
							data.map((experience) => (
								<TableRow key={experience.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<div className="flex aspect-square size-10 items-center justify-center overflow-hidden rounded-md border bg-muted">
												{experience.companyLogo ? (
													<img
														src={experience.companyLogo}
														alt={experience.companyName}
														className="size-full object-cover"
													/>
												) : (
													<Building2 className="size-4 text-muted-foreground" />
												)}
											</div>

											<p className="font-medium leading-none">
												{experience.companyName}
											</p>
										</div>
									</TableCell>

									<TableCell>
										<p className="font-medium leading-none">
											{experience.role}
										</p>
									</TableCell>

									<TableCell>
										<Badge variant="outline">
											{formatJobType(experience.typeJob)}
										</Badge>
									</TableCell>

									<TableCell>
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<CalendarDays className="size-4" />
											<span>{formatPeriod(experience)}</span>
										</div>
									</TableCell>

									<TableCell>
										{experience.location ? (
											<div className="flex items-center gap-2 text-sm text-muted-foreground">
												<MapPin className="size-4" />
												<span>{experience.location}</span>
											</div>
										) : (
											<span className="text-sm text-muted-foreground">-</span>
										)}
									</TableCell>

									<TableCell>
										<div className="flex items-center gap-3">
											<Switch
												checked={experience.isCurrent}
												onCheckedChange={(value) =>
													handleToggleCurrent(experience, value)
												}
												aria-label={`Toggle ${experience.role} current status`}
											/>

											<Badge
												variant={experience.isCurrent ? "default" : "secondary"}
											>
												{experience.isCurrent ? "Current" : "Past"}
											</Badge>
										</div>
									</TableCell>

									<TableCell>
										<span className="text-sm text-muted-foreground">
											{experience.order}
										</span>
									</TableCell>

									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="size-4" />
													<span className="sr-only">
														Open experience actions
													</span>
												</Button>
											</DropdownMenuTrigger>

											<DropdownMenuContent align="end" className="w-44">
												<DropdownMenuItem
													onClick={() => handleEdit(experience)}
												>
													<Pencil className="mr-2 size-4" />
													Edit
												</DropdownMenuItem>

												<DropdownMenuItem>
													<BriefcaseBusiness className="mr-2 size-4" />
													View Detail
												</DropdownMenuItem>

												<DropdownMenuSeparator />

												<DropdownMenuItem
													className="text-destructive focus:text-destructive"
													onClick={() => setSelectedExperience(experience)}
												>
													<Trash2 className="mr-2 size-4" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<AlertDialog
				open={Boolean(selectedExperience)}
				onOpenChange={(open) => {
					if (!open && !isDeleting) setSelectedExperience(null);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete experience?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete{" "}
							<span className="font-medium text-foreground">
								{selectedExperience?.role}
							</span>{" "}
							at{" "}
							<span className="font-medium text-foreground">
								{selectedExperience?.companyName}
							</span>
							. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={(event) => {
								event.preventDefault();
								void handleDelete();
							}}
							disabled={isDeleting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isDeleting ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<ExperienceEditDialog
				experience={editingExperience}
				open={isEditOpen}
				onOpenChange={(open) => {
					setIsEditOpen(open);

					if (!open) {
						setEditingExperience(null);
					}
				}}
			/>
		</>
	);
}

function formatJobType(type: string) {
	const labels: Record<JobType, string> = {
		full_time: "Full-time",
		part_time: "Part-time",
		freelance: "Freelance",
		contract: "Contract",
		internship: "Internship",
		self_employed: "Self-employed",
	};

	return type in labels ? labels[type as JobType] : type;
}

function formatPeriod(experience: ExperienceItem) {
	const startDate = formatDate(experience.startDate);

	if (experience.isCurrent) {
		return `${startDate} — Present`;
	}

	return `${startDate} — ${
		experience.endDate ? formatDate(experience.endDate) : "-"
	}`;
}

function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en", {
		month: "short",
		year: "numeric",
	}).format(new Date(date));
}
