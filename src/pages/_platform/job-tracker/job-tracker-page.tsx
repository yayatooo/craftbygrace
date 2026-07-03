import { Link, useRouter } from "@tanstack/react-router";
import {
	BriefcaseBusiness,
	Building2,
	CalendarDays,
	FileText,
	MapPin,
	MoreHorizontal,
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
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { deleteJobApplicationAction } from "#/features/job-tracker/job-tracker.actions";

import type { JobApplicationItem } from ".";

type JobTrackerPageProps = {
	applications?: JobApplicationItem[];
};

type FilterValue = "all" | "active" | "rejected";

const dateFormatter = new Intl.DateTimeFormat("en", {
	month: "short",
	day: "numeric",
	year: "numeric",
});

export function JobTrackerPage({ applications = [] }: JobTrackerPageProps) {
	const router = useRouter();
	const [filter, setFilter] = useState<FilterValue>("all");
	const [selectedApplication, setSelectedApplication] =
		useState<JobApplicationItem | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const total = applications.length;
	const screening = applications.filter(
		(application) => application.status === "screening",
	).length;
	const interview = applications.filter(
		(application) => application.status === "interview",
	).length;
	const accepted = applications.filter(
		(application) => application.status === "accepted",
	).length;
	const rejected = applications.filter(
		(application) => application.status === "rejected",
	).length;
	const active = applications.filter(isActiveApplication).length;
	const filteredApplications = filterApplications(applications, filter);

	async function handleDelete() {
		if (!selectedApplication) return;

		const applicationToDelete = selectedApplication;

		setIsDeleting(true);

		try {
			await deleteJobApplicationAction({
				id: applicationToDelete.id,
			});

			toast.success("Job application deleted successfully");
			setSelectedApplication(null);
			await router.invalidate();
		} catch (error) {
			console.error("Failed to delete job application:", error);
			toast.error("Failed to delete job application.");
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<>
			<div className="w-full space-y-6">
				<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
					<div>
						<h1 className="text-xl font-semibold tracking-tight">
							Job Tracker
						</h1>
						<p className="text-sm text-muted-foreground">
							Track your job applications, interview progress, CV version, and
							notes.
						</p>
					</div>

					<Button className="w-fit text-white">
						<Link to="/admin/job-tracker/create">
							{/*<Plus className="size-4" />*/}
							Add Application
						</Link>
					</Button>
				</div>

				<div className="grid gap-4 md:grid-cols-4">
					<TrackerSummaryCard
						title="Total Applied"
						value={total}
						description="All tracked applications"
					/>
					<TrackerSummaryCard
						title="Screening"
						value={screening}
						description="Waiting for first response"
					/>
					<TrackerSummaryCard
						title="Interview"
						value={interview}
						description="Interview stage"
					/>
					<TrackerSummaryCard
						title="Accepted"
						value={accepted}
						description="Successful applications"
					/>
				</div>

				<Tabs
					value={filter}
					onValueChange={(value) => setFilter(value as FilterValue)}
					className="space-y-4"
				>
					<div className="flex items-center justify-between gap-4">
						<TabsList className="rounded-xl">
							<TabsTrigger value="all">All</TabsTrigger>
							<TabsTrigger value="active">Active</TabsTrigger>
							<TabsTrigger value="rejected">Rejected</TabsTrigger>
						</TabsList>

						<p className="text-sm text-muted-foreground">
							{rejected} rejected · {active} active
						</p>
					</div>

					<JobApplicationList
						data={filteredApplications}
						hasApplications={applications.length > 0}
						onDeleteSelect={setSelectedApplication}
					/>
				</Tabs>
			</div>

			<AlertDialog
				open={Boolean(selectedApplication)}
				onOpenChange={(open) => {
					if (!open && !isDeleting) setSelectedApplication(null);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete application?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete{" "}
							<span className="font-medium text-foreground">
								{selectedApplication?.name}
							</span>{" "}
							at{" "}
							<span className="font-medium text-foreground">
								{selectedApplication?.company}
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
		</>
	);
}

function TrackerSummaryCard({
	title,
	value,
	description,
}: {
	title: string;
	value: number;
	description: string;
}) {
	return (
		<Card className="rounded-2xl shadow-none">
			<CardHeader className="space-y-1 pb-2">
				<CardDescription>{title}</CardDescription>
				<CardTitle className="text-2xl">{value}</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-xs text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	);
}

export function JobApplicationList({
	data,
	hasApplications,
	onDeleteSelect,
}: {
	data: JobApplicationItem[];
	hasApplications: boolean;
	onDeleteSelect: (application: JobApplicationItem) => void;
}) {
	if (data.length === 0) {
		return (
			<Card className="rounded-2xl shadow-none">
				<CardContent className="flex min-h-32 items-center justify-center p-5 text-center text-sm text-muted-foreground">
					{hasApplications
						? "Tidak ada application pada filter ini."
						: "Belum ada job application."}
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid gap-4">
			{data.map((application) => (
				<JobApplicationCard
					key={application.id}
					application={application}
					onDeleteSelect={onDeleteSelect}
				/>
			))}
		</div>
	);
}

function JobApplicationCard({
	application,
	onDeleteSelect,
}: {
	application: JobApplicationItem;
	onDeleteSelect: (application: JobApplicationItem) => void;
}) {
	return (
		<Card className="rounded-2xl shadow-none transition-colors hover:bg-muted/30">
			<CardContent className="p-5">
				<div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
					<div className="min-w-0 flex-1 space-y-4">
						<div className="flex flex-wrap items-center gap-2">
							<Badge variant={getStatusBadgeVariant(application.status)}>
								{formatStatus(application.status)}
							</Badge>
							<Badge variant="outline">{formatJobType(application.type)}</Badge>
							<Badge variant="outline">
								{formatWorkType(application.workType)}
							</Badge>
							<Badge variant="secondary">
								{formatPlatform(application.platform)}
							</Badge>
						</div>

						<div>
							<h2 className="truncate text-base font-semibold">
								{application.role}
							</h2>
							<p className="mt-1 text-sm text-muted-foreground">
								{application.name}
							</p>
						</div>

						<div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
							<div className="flex items-center gap-2">
								<Building2 className="size-4" />
								<span className="truncate">{application.company}</span>
							</div>

							<div className="flex items-center gap-2">
								<MapPin className="size-4" />
								<span className="truncate">{application.location}</span>
							</div>

							<div className="flex items-center gap-2">
								<CalendarDays className="size-4" />
								<span>{formatDate(application.createdAt)}</span>
							</div>
						</div>

						{application.remarks ? (
							<p className="line-clamp-2 rounded-xl bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
								{application.remarks}
							</p>
						) : null}
					</div>

					<div className="flex items-center justify-between gap-2 md:flex-col md:items-end">
						{application.cv ? (
							<Button
								variant="outline"
								size="sm"
								className="rounded-xl"
								asChild
							>
								<a href={application.cv} target="_blank" rel="noreferrer">
									<FileText className="size-4" />
									CV
								</a>
							</Button>
						) : null}

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="size-9">
									<MoreHorizontal className="size-4" />
									<span className="sr-only">Open job actions</span>
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent align="end" className="w-44">
								<DropdownMenuItem
									onClick={() =>
										console.log("Update status placeholder", application.id)
									}
								>
									<BriefcaseBusiness className="mr-2 size-4" />
									Update Status
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link
										to="/admin/job-tracker/edit/$id"
										params={{ id: application.id }}
									>
										<FileText className="mr-2 size-4" />
										Edit
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-destructive focus:text-destructive"
									onClick={() => onDeleteSelect(application)}
								>
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function filterApplications(
	applications: JobApplicationItem[],
	filter: FilterValue,
) {
	if (filter === "rejected") {
		return applications.filter(
			(application) => application.status === "rejected",
		);
	}

	if (filter === "active") {
		return applications.filter(isActiveApplication);
	}

	return applications;
}

function isActiveApplication(application: JobApplicationItem) {
	return application.status !== "rejected" && application.status !== "accepted";
}

function getStatusBadgeVariant(status: string | null) {
	if (status === "rejected") return "destructive";
	if (status === "accepted") return "default";
	if (status === "interview") return "secondary";

	return "outline";
}

function formatStatus(status: string | null) {
	const labels: Record<string, string> = {
		screening: "Screening",
		interview: "Interview",
		rejected: "Rejected",
		signoff: "Signoff",
		accepted: "Accepted",
		draft: "Draft",
	};

	return status ? (labels[status] ?? titleCase(status)) : "Draft";
}

function formatJobType(type: string) {
	const labels: Record<string, string> = {
		full_time: "Full-time",
		part_time: "Part-time",
		freelance: "Freelance",
		contract: "Contract",
		internship: "Internship",
		self_employed: "Self-employed",
	};

	return labels[type] ?? titleCase(type);
}

function formatWorkType(type: string) {
	const labels: Record<string, string> = {
		"On-site": "On-site",
		Hybrid: "Hybrid",
		Remote: "Remote",
	};

	return labels[type] ?? titleCase(type);
}

function formatPlatform(platform: string) {
	const labels: Record<string, string> = {
		linkeidn: "LinkedIn",
		jobstreet: "JobStreet",
		jobsdb: "JobsDB",
		"twitter/X": "Twitter/X",
	};

	return labels[platform] ?? titleCase(platform);
}

function titleCase(value: string) {
	return value
		.replace(/[_-]+/g, " ")
		.split(" ")
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function formatDate(date: Date) {
	return dateFormatter.format(new Date(date));
}
