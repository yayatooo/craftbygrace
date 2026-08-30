import { Link, useRouter } from "@tanstack/react-router";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { TitleText } from "#/components/title-text";
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
import { deleteBlogAction } from "#/features/blogs/blogs.actions";

export type BlogTableItem = {
	id: string;
	title: string;
	slug: string;
	excerpt: string | null;
	coverImage: string | null;
	contentType: string;
	content: string;
	status: string;
	tags: string[];
	readingTime: number | null;
	publishedAt: Date | null;
	isFeatured: boolean;
	createdAt: Date;
	updatedAt: Date;
};

type BlogsTableListProps = {
	data?: BlogTableItem[];
};

const dateFormatter = new Intl.DateTimeFormat("en", {
	day: "2-digit",
	month: "short",
	year: "numeric",
});

function getStatusBadgeVariant(status: string) {
	if (status === "published") {
		return "default";
	}

	if (status === "archived") {
		return "secondary";
	}

	return "outline";
}

function formatStatus(status: string) {
	return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatPublishedDate(date: Date | null) {
	if (!date) {
		return "—";
	}

	return dateFormatter.format(new Date(date));
}

function formatReadingTime(readingTime: number | null) {
	if (!readingTime) {
		return "—";
	}

	return `${readingTime} min read`;
}

function formatTagCount(count: number) {
	return `${count} ${count === 1 ? "tag" : "tags"}`;
}

export function BlogsTableList({ data = [] }: BlogsTableListProps) {
	const router = useRouter();
	const [selectedBlog, setSelectedBlog] = useState<BlogTableItem | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	async function handleDelete() {
		if (!selectedBlog) return;

		const blogToDelete = selectedBlog;

		setIsDeleting(true);

		try {
			await deleteBlogAction({
				id: blogToDelete.id,
			});

			toast.success("Blog deleted successfully");
			setSelectedBlog(null);
			await router.invalidate();
		} catch (error) {
			console.error("Failed to delete blog:", error);
			toast.error("Failed to delete blog.");
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<>
			<div className="w-full space-y-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<TitleText>Blogs</TitleText>
						<p className="text-sm text-muted-foreground">
							Manage your articles, drafts, and published stories.
						</p>
					</div>

					<Button className="text-white">
						<Link to="/admin/blogs/create">
							{/*<Plus className="size-4" />*/}
							Create Blog{" "}
						</Link>
					</Button>
				</div>

				<div className="overflow-hidden rounded-2xl border bg-background">
					<Table>
						<TableHeader>
							<TableRow className="bg-muted/40 hover:bg-muted/40">
								<TableHead>Blog</TableHead>
								<TableHead>Tags</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Featured</TableHead>
								<TableHead>Reading Time</TableHead>
								<TableHead>Published</TableHead>
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
										Input your data blog.
									</TableCell>
								</TableRow>
							) : (
								data.map((blog) => (
									<TableRow key={blog.id}>
										<TableCell>
											<div className="space-y-1">
												<p className="font-medium leading-none">{blog.title}</p>
												<p className="text-xs text-muted-foreground">
													/{blog.slug}
												</p>
											</div>
										</TableCell>

										<TableCell>
											<span className="text-sm text-muted-foreground">
												{formatTagCount(blog.tags.length)}
											</span>
										</TableCell>

										<TableCell>
											<Badge variant={getStatusBadgeVariant(blog.status)}>
												{formatStatus(blog.status)}
											</Badge>
										</TableCell>

										<TableCell>
											{blog.isFeatured ? (
												<Badge variant="secondary">Featured</Badge>
											) : (
												<span className="text-sm text-muted-foreground">—</span>
											)}
										</TableCell>

										<TableCell>
											<span className="text-sm text-muted-foreground">
												{formatReadingTime(blog.readingTime)}
											</span>
										</TableCell>

										<TableCell>
											<span className="text-sm text-muted-foreground">
												{formatPublishedDate(blog.publishedAt)}
											</span>
										</TableCell>

										<TableCell className="text-right">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="icon">
														<MoreHorizontal className="size-4" />
														<span className="sr-only">Open blog actions</span>
													</Button>
												</DropdownMenuTrigger>

												<DropdownMenuContent align="end" className="w-40">
													<DropdownMenuItem asChild>
														<Link
															to="/admin/blogs/edit/$slug"
															params={{ slug: blog.slug }}
														>
															<Pencil className="mr-2 size-4" />
															Edit
														</Link>
													</DropdownMenuItem>

													<DropdownMenuSeparator />

													<DropdownMenuItem
														className="text-destructive focus:text-destructive"
														onClick={() => setSelectedBlog(blog)}
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
			</div>

			<AlertDialog
				open={Boolean(selectedBlog)}
				onOpenChange={(open) => {
					if (!open && !isDeleting) setSelectedBlog(null);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete blog?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete{" "}
							<span className="font-medium text-foreground">
								{selectedBlog?.title}
							</span>{" "}
							from your blog list. This action cannot be undone.
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
