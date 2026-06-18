import { useState } from "react";
import {
  ExternalLink,
  ImageIcon,
  MoreHorizontal,
  Music2,
  Pencil,
  Trash2,
} from "lucide-react";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Switch } from "#/components/ui/switch";
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

type SongItem = {
  id: string;
  name: string;
  writer: string;
  image: string | null;
  link: string;
  isActive: boolean;
  order: number;
};

const songsData: SongItem[] = [
  {
    id: "1",
    name: "Sweet Disposition",
    writer: "The Temper Trap",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=400&auto=format&fit=crop",
    link: "https://open.spotify.com/",
    isActive: true,
    order: 1,
  },
  {
    id: "2",
    name: "The Less I Know The Better",
    writer: "Tame Impala",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=400&auto=format&fit=crop",
    link: "https://open.spotify.com/",
    isActive: true,
    order: 2,
  },
  {
    id: "3",
    name: "505",
    writer: "Arctic Monkeys",
    image: null,
    link: "https://open.spotify.com/",
    isActive: false,
    order: 3,
  },
];

export function SongTable() {
  const [selectedSong, setSelectedSong] = useState<SongItem | null>(null);

  function handleEdit(song: SongItem) {
    console.log("edit song:", song);
  }

  function handleToggleActive(song: SongItem, value: boolean) {
    console.log("toggle active:", song.id, value);
  }

  function handleDelete() {
    if (!selectedSong) return;

    console.log("delete song:", selectedSong.id);
    setSelectedSong(null);
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
            {songsData.map((song) => (
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
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={Boolean(selectedSong)}
        onOpenChange={(open) => {
          if (!open) setSelectedSong(null);
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
