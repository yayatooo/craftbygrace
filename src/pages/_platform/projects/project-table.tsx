import { useRouter } from "@tanstack/react-router";
import {
	ExternalLink,
	FolderGit2,
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { deleteProjectAction } from "#/features/projects/projects.actions";
import { ProjectEditDialog } from "./project-edit-dialog";

export type ProjectItem = {
	id: string;
	thumbnail: string | null;
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
	createdAt: Date;
	updatedAt: Date;
};

type ProjectTableProps = {
	data?: ProjectItem[];
};

export function ProjectTable({ data = [] }: ProjectTableProps) {
	const router = useRouter();

	const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
		null,
	);
	const [editingProject, setEditingProject] = useState<ProjectItem | null>(
		null,
	);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	function handleEdit(project: ProjectItem) {
		setEditingProject(project);
		setIsEditOpen(true);
	}

	async function handleDelete() {
		if (!selectedProject) return;

		const projectToDelete = selectedProject;

		setIsDeleting(true);

		try {
			await deleteProjectAction({
				id: projectToDelete.id,
			});

			toast.success("Project deleted successfully");
			setSelectedProject(null);
			await router.invalidate();
		} catch (error) {
			console.error("Failed to delete project:", error);
			toast.error("Failed to delete project.");
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
							<TableHead>Project</TableHead>
							<TableHead>Tech Stack</TableHead>
							<TableHead>Current</TableHead>
							<TableHead>Active</TableHead>
							<TableHead>Secret</TableHead>
							<TableHead className="w-22.5">Order</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{data.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={7}
									className="h-24 text-center text-muted-foreground"
								>
									Belum ada data project.
								</TableCell>
							</TableRow>
						) : (
							data.map((project) => (
								<TableRow key={project.id}>
									<TableCell>
										<div className="space-y-1">
											<p className="font-medium leading-none">{project.name}</p>
											<p className="text-xs text-muted-foreground">
												/{project.slug}
											</p>
										</div>
									</TableCell>

									<TableCell>
										<span className="text-sm text-muted-foreground">
											{formatTechStackCount(project.techStack.length)}
										</span>
									</TableCell>

									<TableCell>
										<Badge
											variant={project.isCurrent ? "default" : "secondary"}
										>
											{project.isCurrent ? "Current" : "Not Current"}
										</Badge>
									</TableCell>

									<TableCell>
										<Badge variant={project.isActive ? "default" : "secondary"}>
											{project.isActive ? "Active" : "Inactive"}
										</Badge>
									</TableCell>

									<TableCell>
										<Badge variant={project.isSecret ? "secondary" : "outline"}>
											{project.isSecret ? "Secret" : "Public"}
										</Badge>
									</TableCell>

									<TableCell>
										<span className="text-sm text-muted-foreground">
											{project.order}
										</span>
									</TableCell>

									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="size-4" />
													<span className="sr-only">Open project actions</span>
												</Button>
											</DropdownMenuTrigger>

											<DropdownMenuContent align="end" className="w-44">
												<DropdownMenuItem onClick={() => handleEdit(project)}>
													<Pencil className="mr-2 size-4" />
													Edit
												</DropdownMenuItem>

												{project.demoLink ? (
													<DropdownMenuItem asChild>
														<a
															href={project.demoLink}
															target="_blank"
															rel="noreferrer"
														>
															<ExternalLink className="mr-2 size-4" />
															Open Demo
														</a>
													</DropdownMenuItem>
												) : null}

												{project.repoLink ? (
													<DropdownMenuItem asChild>
														<a
															href={project.repoLink}
															target="_blank"
															rel="noreferrer"
														>
															<FolderGit2 className="mr-2 size-4" />
															Open Repo
														</a>
													</DropdownMenuItem>
												) : null}

												<DropdownMenuSeparator />

												<DropdownMenuItem
													className="text-destructive focus:text-destructive"
													onClick={() => setSelectedProject(project)}
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
				open={Boolean(selectedProject)}
				onOpenChange={(open) => {
					if (!open && !isDeleting) setSelectedProject(null);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete project?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete{" "}
							<span className="font-medium text-foreground">
								{selectedProject?.name}
							</span>{" "}
							from your project list. This action cannot be undone.
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

			<ProjectEditDialog
				project={editingProject}
				open={isEditOpen}
				onOpenChange={(open) => {
					setIsEditOpen(open);

					if (!open) {
						setEditingProject(null);
					}
				}}
			/>
		</>
	);
}

function formatTechStackCount(count: number) {
	return `${count} ${count === 1 ? "technology" : "technologies"}`;
}
