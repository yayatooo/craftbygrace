import { useRouter } from "@tanstack/react-router";
import {
	ExternalLink,
	ImageIcon,
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
import { deleteMovieFn } from "#/features/movies/movies.function";
import { MovieEditDialog, type MovieItem } from "./movie-edit-dialog";

type MovieTableProps = {
	data?: MovieItem[];
};

export function MovieTable({ data = [] }: MovieTableProps) {
	const router = useRouter();

	const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);
	const [editingMovie, setEditingMovie] = useState<MovieItem | null>(null);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	function handleEdit(movie: MovieItem) {
		setEditingMovie(movie);
		setIsEditOpen(true);
	}

	function handleToggleActive(movie: MovieItem, value: boolean) {
		console.log("toggle active:", movie.id, value);
	}

	async function handleDelete() {
		if (!selectedMovie) return;

		const movieToDelete = selectedMovie;

		setIsDeleting(true);

		try {
			// R2 poster cleanup will be handled later; this only deletes the DB record.
			await deleteMovieFn({
				data: {
					id: movieToDelete.id,
				},
			});

			toast.success("Movie deleted successfully");
			setSelectedMovie(null);
			await router.invalidate();
		} catch (error) {
			console.error("Failed to delete movie:", error);
			toast.error("Failed to delete movie.");
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
							<TableHead>Movie</TableHead>
							<TableHead>Type</TableHead>
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
									Input data movie
								</TableCell>
							</TableRow>
						) : (
							data.map((movie) => (
								<TableRow key={movie.id}>
									<TableCell>
										<div className="flex size-12 items-center justify-center overflow-hidden rounded-md border bg-muted">
											{movie.image ? (
												<img
													src={movie.image}
													alt={movie.name}
													className="size-full object-cover"
												/>
											) : (
												<ImageIcon className="size-5 text-muted-foreground" />
											)}
										</div>
									</TableCell>

									<TableCell>
										<div className="space-y-1">
											<p className="font-medium leading-none">{movie.name}</p>

											{movie.link ? (
												<a
													href={movie.link}
													target="_blank"
													rel="noreferrer"
													className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
												>
													Open link
													<ExternalLink className="size-3" />
												</a>
											) : (
												<p className="text-xs text-muted-foreground">
													No external link
												</p>
											)}
										</div>
									</TableCell>

									<TableCell>
										<Badge variant="outline">{movie.type}</Badge>
									</TableCell>

									<TableCell>
										<div className="flex items-center gap-3">
											<Switch
												checked={movie.isActive}
												onCheckedChange={(value) =>
													handleToggleActive(movie, value)
												}
												aria-label={`Toggle ${movie.name} active status`}
											/>

											<Badge variant={movie.isActive ? "default" : "secondary"}>
												{movie.isActive ? "Active" : "Inactive"}
											</Badge>
										</div>
									</TableCell>

									<TableCell>
										<span className="text-sm text-muted-foreground">
											{movie.order}
										</span>
									</TableCell>

									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="size-4" />
													<span className="sr-only">Open movie actions</span>
												</Button>
											</DropdownMenuTrigger>

											<DropdownMenuContent align="end" className="w-40">
												<DropdownMenuItem onClick={() => handleEdit(movie)}>
													<Pencil className="mr-2 size-4" />
													Edit
												</DropdownMenuItem>

												{movie.link ? (
													<DropdownMenuItem asChild>
														<a
															href={movie.link}
															target="_blank"
															rel="noreferrer"
														>
															<ExternalLink className="mr-2 size-4" />
															Open Link
														</a>
													</DropdownMenuItem>
												) : null}

												<DropdownMenuSeparator />

												<DropdownMenuItem
													className="text-destructive focus:text-destructive"
													onClick={() => setSelectedMovie(movie)}
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
				open={Boolean(selectedMovie)}
				onOpenChange={(open) => {
					if (!open && !isDeleting) setSelectedMovie(null);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete movie?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete{" "}
							<span className="font-medium text-foreground">
								{selectedMovie?.name}
							</span>{" "}
							from your movie list. This action cannot be undone.
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

			<MovieEditDialog
				movie={editingMovie}
				open={isEditOpen}
				onOpenChange={(open) => {
					setIsEditOpen(open);

					if (!open) {
						setEditingMovie(null);
					}
				}}
			/>
		</>
	);
}
