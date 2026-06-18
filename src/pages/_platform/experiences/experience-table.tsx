import { useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  MapPin,
  MoreHorizontal,
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

type JobType =
  | "full_time"
  | "part_time"
  | "freelance"
  | "contract"
  | "internship"
  | "self_employed";

type ExperienceItem = {
  id: string;
  companyName: string;
  role: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  typeJob: JobType;
  location: string | null;
  order: number;
};

const experiencesData: ExperienceItem[] = [
  {
    id: "1",
    companyName: "Evindo Global Putra",
    role: "Full Stack Developer",
    startDate: "2023-03-01",
    endDate: null,
    isCurrent: true,
    typeJob: "full_time",
    location: "Jakarta, Indonesia",
    order: 1,
  },
  {
    id: "2",
    companyName: "Mendix Project Team",
    role: "Mendix Pro Developer",
    startDate: "2025-01-01",
    endDate: null,
    isCurrent: true,
    typeJob: "freelance",
    location: "Remote",
    order: 2,
  },
  {
    id: "3",
    companyName: "Personal Product Lab",
    role: "Product Builder",
    startDate: "2024-06-01",
    endDate: "2025-12-31",
    isCurrent: false,
    typeJob: "self_employed",
    location: "Remote",
    order: 3,
  },
];

export function ExperienceTable() {
  const [selectedExperience, setSelectedExperience] =
    useState<ExperienceItem | null>(null);

  function handleEdit(experience: ExperienceItem) {
    console.log("edit experience:", experience);
  }

  function handleToggleCurrent(experience: ExperienceItem, value: boolean) {
    console.log("toggle current:", experience.id, value);
  }

  function handleDelete() {
    if (!selectedExperience) return;

    console.log("delete experience:", selectedExperience.id);
    setSelectedExperience(null);
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Experience</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-22.5">Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {experiencesData.map((experience) => (
              <TableRow key={experience.id}>
                <TableCell>
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium leading-none">
                        {experience.role}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Building2 className="size-3.5" />
                        <span>{experience.companyName}</span>
                      </div>
                    </div>

                    {experience.location ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="size-3.5" />
                        <span>{experience.location}</span>
                      </div>
                    ) : null}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="outline">
                    {formatJobType(experience.typeJob)}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="size-4" />
                    <span>
                      {formatDate(experience.startDate)} -{" "}
                      {experience.endDate
                        ? formatDate(experience.endDate)
                        : "Present"}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={experience.isCurrent}
                      onCheckedChange={(value) =>
                        handleToggleCurrent(experience, value)
                      }
                      aria-label={`Toggle ${experience.role} current status`}
                    />

                    <Badge
                      variant={experience.isCurrent ? "default" : "secondary"}
                    >
                      {experience.isCurrent ? "Current" : "Past"}
                    </Badge>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {experience.order}
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Open experience actions</span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => handleEdit(experience)}>
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <BriefcaseBusiness className="mr-2 size-4" />
                        View Detail
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setSelectedExperience(experience)}
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
        open={Boolean(selectedExperience)}
        onOpenChange={(open) => {
          if (!open) setSelectedExperience(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete experience?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {selectedExperience?.role}
              </span>{" "}
              at{" "}
              <span className="font-medium text-foreground">
                {selectedExperience?.companyName}
              </span>
              . This action cannot be undone.
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

function formatJobType(type: JobType) {
  const labels: Record<JobType, string> = {
    full_time: "Full-time",
    part_time: "Part-time",
    freelance: "Freelance",
    contract: "Contract",
    internship: "Internship",
    self_employed: "Self-employed",
  };

  return labels[type];
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
