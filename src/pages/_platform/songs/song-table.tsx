import { useRouter } from "@tanstack/react-router";
import {
	ExternalLink,
	ImageIcon,
	MoreHorizontal,
	Music2,
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
import { deleteSongAction } from "#/features/songs/songs.actions";
import { SongEditDialog, type SongItem } from "./song-edit-dialog";

type SongTableProps = {
	data?: SongItem[];
};

export function SongTable({ data = [] }: SongTableProps) {
	const router = useRouter();

	const [selectedSong, setSelectedSong] = useState<SongItem | null>(null);
	const [editingSong, setEditingSong] = useState<SongItem | null>(null);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	function handleEdit(song: SongItem) {
		setEditingSong(song);
		setIsEditOpen(true);
	}

	function handleToggleActive(song: SongItem, value: boolean) {
		console.log("toggle active:", song.id, value);
	}

	async function handleDelete() {
		if (!selectedSong) return;

		const songToDelete = selectedSong;

		setIsDeleting(true);

		try {
			await deleteSongAction({
				id: songToDelete.id,
			});

			toast.success("Song deleted successfully");
			setSelectedSong(null);
			await router.invalidate();
		} catch (error) {
			console.error("Failed to delete song:", error);
			toast.error("Failed to delete song.");
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
							<TableHead>Song</TableHead>
							<TableHead>Writer</TableHead>
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
									Belum ada data song.
								</TableCell>
							</TableRow>
						) : (
							data.map((song) => (
								<TableRow key={song.id}>
									<TableCell>
										<div className="flex size-12 items-center justify-center overflow-hidden rounded-md border bg-muted">
											{song.image ? (
												<img
													src={song.image}
													alt={song.name}
													className="size-full object-cover"
												/>
											) : (
												<ImageIcon className="size-5 text-muted-foreground" />
											)}
										</div>
									</TableCell>

									<TableCell>
										<div className="space-y-1">
											<p className="font-medium leading-none">{song.name}</p>

											<a
												href={song.link}
												target="_blank"
												rel="noreferrer"
												className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
											>
												Open song
												<ExternalLink className="size-3" />
											</a>
										</div>
									</TableCell>

									<TableCell>
										<Badge variant="outline">{song.writer}</Badge>
									</TableCell>

									<TableCell>
										<div className="flex items-center gap-3">
											<Switch
												checked={song.isActive}
												onCheckedChange={(value) =>
													handleToggleActive(song, value)
												}
												aria-label={`Toggle ${song.name} active status`}
											/>

											<Badge variant={song.isActive ? "default" : "secondary"}>
												{song.isActive ? "Active" : "Inactive"}
											</Badge>
										</div>
									</TableCell>

									<TableCell>
										<span className="text-sm text-muted-foreground">
											{song.order}
										</span>
									</TableCell>

									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="size-4" />
													<span className="sr-only">Open song actions</span>
												</Button>
											</DropdownMenuTrigger>

											<DropdownMenuContent align="end" className="w-40">
												<DropdownMenuItem onClick={() => handleEdit(song)}>
													<Pencil className="mr-2 size-4" />
													Edit
												</DropdownMenuItem>

												<DropdownMenuItem asChild>
													<a href={song.link} target="_blank" rel="noreferrer">
														<Music2 className="mr-2 size-4" />
														Open Song
													</a>
												</DropdownMenuItem>

												<DropdownMenuSeparator />

												<DropdownMenuItem
													className="text-destructive focus:text-destructive"
													onClick={() => setSelectedSong(song)}
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
				open={Boolean(selectedSong)}
				onOpenChange={(open) => {
					if (!open && !isDeleting) setSelectedSong(null);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete song?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete{" "}
							<span className="font-medium text-foreground">
								{selectedSong?.name}
							</span>{" "}
							from your song list. This action cannot be undone.
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

			<SongEditDialog
				song={editingSong}
				open={isEditOpen}
				onOpenChange={(open) => {
					setIsEditOpen(open);

					if (!open) {
						setEditingSong(null);
					}
				}}
			/>
		</>
	);
}
