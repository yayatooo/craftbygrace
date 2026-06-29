import { useRouter } from "@tanstack/react-router";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { deleteGalleryItemAction } from "#/features/gallery/gallery.actions";
import { GalleryEditDialog } from "./gallery-edit-dialog";

export type GalleryItem = {
	id: string;
	name: string;
	image: string;
	alt: string | null;
	isActive: boolean;
	order: number;
	createdAt: Date;
	updatedAt: Date;
};

type GalleryTableProps = {
	data?: GalleryItem[];
};

export function GalleryTable({ data = [] }: GalleryTableProps) {
	const router = useRouter();

	const [selectedGalleryItem, setSelectedGalleryItem] =
		useState<GalleryItem | null>(null);
	const [editingGalleryItem, setEditingGalleryItem] =
		useState<GalleryItem | null>(null);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	function handleEdit(item: GalleryItem) {
		setEditingGalleryItem(item);
		setIsEditOpen(true);
	}

	async function handleDelete() {
		if (!selectedGalleryItem) return;

		const galleryItemToDelete = selectedGalleryItem;

		setIsDeleting(true);

		try {
			await deleteGalleryItemAction({
				id: galleryItemToDelete.id,
			});

			toast.success("Gallery photo deleted successfully");
			setSelectedGalleryItem(null);
			await router.invalidate();
		} catch (error) {
			console.error("Failed to delete gallery photo:", error);
			toast.error("Failed to delete gallery photo.");
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
							<TableHead className="w-18">Image</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Alt Text</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="w-22.5">Order</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{data.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="h-24 text-center text-muted-foreground"
								>
									Belum ada data gallery.
								</TableCell>
							</TableRow>
						) : (
							data.map((item) => (
								<TableRow key={item.id}>
									<TableCell>
										<div className="aspect-square size-12 overflow-hidden rounded-md border bg-muted">
											<img
												src={item.image}
												alt={item.alt ?? item.name}
												className="size-full object-cover"
											/>
										</div>
									</TableCell>

									<TableCell>
										<p className="font-medium leading-none">{item.name}</p>
									</TableCell>

									<TableCell>
										{item.alt ? (
											<span className="text-sm text-foreground">
												{item.alt}
											</span>
										) : (
											<span className="text-sm text-muted-foreground">
												No alt text
											</span>
										)}
									</TableCell>

									<TableCell>
										<Badge variant={item.isActive ? "default" : "secondary"}>
											{item.isActive ? "Active" : "Inactive"}
										</Badge>
									</TableCell>

									<TableCell>
										<span className="text-sm text-muted-foreground">
											{item.order}
										</span>
									</TableCell>

									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="size-4" />
													<span className="sr-only">
														Open gallery item actions
													</span>
												</Button>
											</DropdownMenuTrigger>

											<DropdownMenuContent align="end" className="w-40">
												<DropdownMenuItem onClick={() => handleEdit(item)}>
													<Pencil className="mr-2 size-4" />
													Edit
												</DropdownMenuItem>

												<DropdownMenuSeparator />

												<DropdownMenuItem
													className="text-destructive focus:text-destructive"
													onClick={() => setSelectedGalleryItem(item)}
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
				open={Boolean(selectedGalleryItem)}
				onOpenChange={(open) => {
					if (!open && !isDeleting) setSelectedGalleryItem(null);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete gallery photo?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete{" "}
							<span className="font-medium text-foreground">
								{selectedGalleryItem?.name}
							</span>{" "}
							from your gallery. This action cannot be undone.
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

			<GalleryEditDialog
				galleryItem={editingGalleryItem}
				open={isEditOpen}
				onOpenChange={(open) => {
					setIsEditOpen(open);

					if (!open) {
						setEditingGalleryItem(null);
					}
				}}
			/>
		</>
	);
}
