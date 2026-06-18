import { useState } from "react";
import {
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  ImageIcon,
} from "lucide-react";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
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

type MovieItem = {
  id: string;
  name: string;
  type: string;
  image: string | null;
  link: string | null;
  isActive: boolean;
  order: number;
};

const moviesData: MovieItem[] = [
  {
    id: "1",
    name: "Interstellar",
    type: "Movie",
    image:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=400&auto=format&fit=crop",
    link: "https://letterboxd.com/film/interstellar/",
    isActive: true,
    order: 1,
  },
  {
    id: "2",
    name: "The Social Network",
    type: "Movie",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400&auto=format&fit=crop",
    link: "https://letterboxd.com/film/the-social-network/",
    isActive: true,
    order: 2,
  },
  {
    id: "3",
    name: "Chef",
    type: "Movie",
    image:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=400&auto=format&fit=crop",
    link: null,
    isActive: false,
    order: 3,
  },
];

export function MovieTable() {
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);

  function handleEdit(movie: MovieItem) {
    console.log("edit movie:", movie);
  }

  function handleToggleActive(movie: MovieItem, value: boolean) {
    console.log("toggle active:", movie.id, value);
  }

  function handleDelete() {
    if (!selectedMovie) return;

    console.log("delete movie:", selectedMovie.id);
    setSelectedMovie(null);
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
            {moviesData.map((movie) => (
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
                          <a href={movie.link} target="_blank" rel="noreferrer">
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
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={Boolean(selectedMovie)}
        onOpenChange={(open) => {
          if (!open) setSelectedMovie(null);
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
