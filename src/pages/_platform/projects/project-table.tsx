import { useState } from "react";
import {
  ExternalLink,
  EyeOff,
  FolderGit2,
  ImageIcon,
  MoreHorizontal,
  Pencil,
  Star,
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

type ProjectItem = {
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
};

const projectsData: ProjectItem[] = [
  {
    id: "1",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=400&auto=format&fit=crop",
    name: "Tuwucook AI",
    slug: "tuwucook-ai",
    description:
      "AI cooking assistant that helps users generate recipes based on their kitchen ingredients.",
    techStack: ["TanStack", "Hono", "Drizzle", "PostgreSQL"],
    isCurrent: true,
    isSecret: false,
    isActive: true,
    demoLink: "https://tuwucook.ai",
    repoLink: "https://github.com/yayatooo/tuwucook",
    order: 1,
  },
  {
    id: "2",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop",
    name: "Benson Dashboard",
    slug: "benson-dashboard",
    description:
      "Business management dashboard for export, import, inventory, sales, and expenses.",
    techStack: ["Next.js", "Drizzle", "PostgreSQL", "Docker"],
    isCurrent: true,
    isSecret: true,
    isActive: true,
    demoLink: null,
    repoLink: null,
    order: 2,
  },
  {
    id: "3",
    thumbnail: null,
    name: "Markas Mobil",
    slug: "markas-mobil",
    description:
      "Used-car showroom website with admin dashboard, car management, and sold listing.",
    techStack: ["Next.js", "Prisma", "PostgreSQL", "R2"],
    isCurrent: false,
    isSecret: false,
    isActive: false,
    demoLink: "https://markasmobil.com",
    repoLink: null,
    order: 3,
  },
];

export function ProjectTable() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null,
  );

  function handleEdit(project: ProjectItem) {
    console.log("edit project:", project);
  }

  function handleToggleActive(project: ProjectItem, value: boolean) {
    console.log("toggle active:", project.id, value);
  }

  function handleToggleCurrent(project: ProjectItem, value: boolean) {
    console.log("toggle current:", project.id, value);
  }

  function handleDelete() {
    if (!selectedProject) return;

    console.log("delete project:", selectedProject.id);
    setSelectedProject(null);
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-18">Image</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Tech Stack</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-22.5">Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projectsData.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div className="flex size-12 items-center justify-center overflow-hidden rounded-md border bg-muted">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="size-5 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="max-w-md space-y-2">
                    <div>
                      <p className="font-medium leading-none">{project.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        /{project.slug}
                      </p>
                    </div>

                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {project.isCurrent ? (
                        <Badge variant="default" className="gap-1">
                          <Star className="size-3" />
                          Current
                        </Badge>
                      ) : null}

                      {project.isSecret ? (
                        <Badge variant="secondary" className="gap-1">
                          <EyeOff className="size-3" />
                          NDA
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex max-w-60 flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={project.isActive}
                        onCheckedChange={(value) =>
                          handleToggleActive(project, value)
                        }
                        aria-label={`Toggle ${project.name} active status`}
                      />

                      <Badge
                        variant={project.isActive ? "default" : "secondary"}
                      >
                        {project.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3">
                      <Switch
                        checked={project.isCurrent}
                        onCheckedChange={(value) =>
                          handleToggleCurrent(project, value)
                        }
                        aria-label={`Toggle ${project.name} current status`}
                      />

                      <span className="text-xs text-muted-foreground">
                        Current project
                      </span>
                    </div>
                  </div>
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
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={Boolean(selectedProject)}
        onOpenChange={(open) => {
          if (!open) setSelectedProject(null);
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
