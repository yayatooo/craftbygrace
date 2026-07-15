import { useRouter } from "@tanstack/react-router";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
import { Switch } from "#/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import {
	deleteSkillAction,
	toggleSkillActiveAction,
} from "#/features/settings/skills.actions";

import { DeleteSkillDialog } from "./delete-skill-dialog";
import { SkillFormDialog } from "./skill-form-dialog";

export type SkillItem = {
	id: string;
	name: string;
	slug: string;
	icon: string;
	isActive: boolean;
	order: number;
	createdAt: Date;
	updatedAt: Date;
};

type SkillsTableProps = {
	data?: SkillItem[];
};

export function SkillsTable({ data = [] }: SkillsTableProps) {
	const router = useRouter();

	const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
	const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [togglingSkillId, setTogglingSkillId] = useState<string | null>(null);

	function handleAdd() {
		setEditingSkill(null);
		setIsFormOpen(true);
	}

	function handleEdit(skill: SkillItem) {
		setEditingSkill(skill);
		setIsFormOpen(true);
	}

	async function handleToggleActive(skill: SkillItem, value: boolean) {
		setTogglingSkillId(skill.id);

		try {
			await toggleSkillActiveAction({
				id: skill.id,
				isActive: value,
			});

			toast.success(value ? "Skill enabled" : "Skill disabled");
			await router.invalidate();
		} catch (error) {
			console.error("Failed to update skill status:", error);
			toast.error("Failed to update skill status.");
		} finally {
			setTogglingSkillId(null);
		}
	}

	async function handleDelete() {
		if (!selectedSkill) return;

		const skillToDelete = selectedSkill;

		setIsDeleting(true);

		try {
			await deleteSkillAction({
				id: skillToDelete.id,
			});

			toast.success("Skill deleted successfully");
			setSelectedSkill(null);
			await router.invalidate();
		} catch (error) {
			console.error("Failed to delete skill:", error);
			toast.error("Failed to delete skill.");
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<>
			<Card className="shadow-none">
				<CardHeader>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
						<div className="space-y-1">
							<CardTitle className="text-xl">Skills</CardTitle>
							<CardDescription>
								Manage public skills, icons, status, and manual display order.
							</CardDescription>
						</div>

						<Button type="button" onClick={handleAdd}>
							<Plus className="size-4" />
							Add Skill
						</Button>
					</div>
				</CardHeader>

				<CardContent>
					<div className="overflow-hidden rounded-2xl border bg-background">
						<Table>
							<TableHeader>
								<TableRow className="bg-muted/40 hover:bg-muted/40">
									<TableHead className="w-18">Icon</TableHead>
									<TableHead>Skill</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="w-22.5">Order</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{data.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={5}
											className="h-24 text-center text-muted-foreground"
										>
											No skills yet.
										</TableCell>
									</TableRow>
								) : (
									data.map((skill) => (
										<TableRow key={skill.id}>
											<TableCell>
												<div className="flex size-12 items-center justify-center overflow-hidden rounded-md border bg-muted">
													<img
														src={skill.icon}
														alt={skill.name}
														className="size-full object-contain p-2"
													/>
												</div>
											</TableCell>

											<TableCell>
												<div className="space-y-1">
													<p className="font-medium leading-none">
														{skill.name}
													</p>
													<p className="text-xs text-muted-foreground">
														/{skill.slug}
													</p>
												</div>
											</TableCell>

											<TableCell>
												<div className="flex items-center gap-3">
													<Switch
														checked={skill.isActive}
														disabled={togglingSkillId === skill.id}
														onCheckedChange={(value) =>
															handleToggleActive(skill, value)
														}
														aria-label={`Toggle ${skill.name} active status`}
													/>

													<Badge
														variant={skill.isActive ? "default" : "secondary"}
													>
														{skill.isActive ? "Active" : "Inactive"}
													</Badge>
												</div>
											</TableCell>

											<TableCell>
												<span className="text-sm text-muted-foreground">
													{skill.order}
												</span>
											</TableCell>

											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="icon">
															<MoreHorizontal className="size-4" />
															<span className="sr-only">
																Open skill actions
															</span>
														</Button>
													</DropdownMenuTrigger>

													<DropdownMenuContent align="end" className="w-40">
														<DropdownMenuItem onClick={() => handleEdit(skill)}>
															<Pencil className="mr-2 size-4" />
															Edit
														</DropdownMenuItem>

														<DropdownMenuSeparator />

														<DropdownMenuItem
															className="text-destructive focus:text-destructive"
															onClick={() => setSelectedSkill(skill)}
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
				</CardContent>
			</Card>

			<SkillFormDialog
				skill={editingSkill}
				open={isFormOpen}
				onOpenChange={(open) => {
					setIsFormOpen(open);

					if (!open) {
						setEditingSkill(null);
					}
				}}
			/>

			<DeleteSkillDialog
				skill={selectedSkill}
				open={Boolean(selectedSkill)}
				isDeleting={isDeleting}
				onOpenChange={(open) => {
					if (!open) setSelectedSkill(null);
				}}
				onConfirm={() => {
					void handleDelete();
				}}
			/>
		</>
	);
}
