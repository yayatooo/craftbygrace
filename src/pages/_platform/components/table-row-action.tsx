import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
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
import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Switch } from "#/components/ui/switch";

type TableRowActionsProps = {
	id: string;
	name?: string;
	isActive: boolean;
	onEdit: () => void;
	onDelete: (id: string) => void | Promise<void>;
	onToggleActive: (id: string, value: boolean) => void | Promise<void>;
};

export function TableRowActions({
	id,
	name,
	isActive,
	onEdit,
	onDelete,
	onToggleActive,
}: TableRowActionsProps) {
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [isPending, setIsPending] = useState(false);

	async function handleDelete() {
		setIsPending(true);

		try {
			await onDelete(id);
			setDeleteOpen(false);
		} finally {
			setIsPending(false);
		}
	}

	async function handleToggleActive(value: boolean) {
		setIsPending(true);

		try {
			await onToggleActive(id, value);
		} finally {
			setIsPending(false);
		}
	}

	return (
		<>
			<div className="flex items-center justify-end gap-2">
				<Switch
					checked={isActive}
					disabled={isPending}
					onCheckedChange={handleToggleActive}
					aria-label="Toggle active status"
				/>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="size-8">
							<MoreHorizontal className="size-4" />
							<span className="sr-only">Open row actions</span>
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="end" className="w-40">
						<DropdownMenuItem onClick={onEdit}>
							<Pencil className="mr-2 size-4" />
							Edit
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<DropdownMenuItem
							className="text-destructive focus:text-destructive"
							onClick={() => setDeleteOpen(true)}
						>
							<Trash2 className="mr-2 size-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete this item?</AlertDialogTitle>
						<AlertDialogDescription>
							{name ? (
								<>
									This will permanently delete{" "}
									<span className="font-medium text-foreground">{name}</span>.
								</>
							) : (
								"This will permanently delete this item."
							)}{" "}
							This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							disabled={isPending}
							onClick={(event) => {
								event.preventDefault();
								void handleDelete();
							}}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isPending ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
