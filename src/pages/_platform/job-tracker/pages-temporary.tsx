import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ExternalLink,
  FileText,
  MapPin,
  MoreHorizontal,
  Plus,
} from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";

type JobStatus =
  | "screening"
  | "interview"
  | "technical_test"
  | "offering"
  | "rejected";

type JobType =
  | "full_time"
  | "part_time"
  | "freelance"
  | "contract"
  | "internship";

type Platform =
  | "linkedin"
  | "glints"
  | "jobstreet"
  | "kalibrr"
  | "website"
  | "referral"
  | "other";

type WorkType = "onsite" | "hybrid" | "remote";

type JobTrackerItem = {
  id: string;
  name: string;
  company: string;
  location: string;
  role: string;
  cv: string | null;
  type: JobType;
  platform: Platform;
  workType: WorkType;
  status: JobStatus;
  remarks: string | null;
  createdAt: string;
};

const jobApplications: JobTrackerItem[] = [
  {
    id: "1",
    name: "Frontend Engineer Application",
    company: "Craft Studio",
    location: "Jakarta, Indonesia",
    role: "Frontend Engineer",
    cv: "/cv/frontend-engineer.pdf",
    type: "full_time",
    platform: "linkedin",
    workType: "hybrid",
    status: "screening",
    remarks: "Applied with portfolio link and updated React projects.",
    createdAt: "2026-06-16",
  },
  {
    id: "2",
    name: "Full Stack Developer Application",
    company: "Northstar Digital",
    location: "Remote",
    role: "Full Stack Developer",
    cv: "/cv/fullstack-developer.pdf",
    type: "contract",
    platform: "website",
    workType: "remote",
    status: "technical_test",
    remarks: "Need to submit take-home test this week.",
    createdAt: "2026-06-14",
  },
  {
    id: "3",
    name: "Product Engineer Application",
    company: "Maven Labs",
    location: "Singapore",
    role: "Product Engineer",
    cv: null,
    type: "full_time",
    platform: "referral",
    workType: "remote",
    status: "interview",
    remarks: "Intro call scheduled with engineering manager.",
    createdAt: "2026-06-10",
  },
  {
    id: "4",
    name: "React Developer Application",
    company: "DesignOps",
    location: "Bandung, Indonesia",
    role: "React Developer",
    cv: "/cv/react-developer.pdf",
    type: "freelance",
    platform: "glints",
    workType: "onsite",
    status: "rejected",
    remarks: "Rejected after screening. Stack was too design-system focused.",
    createdAt: "2026-06-08",
  },
];

export function JobTrackerPage() {
  const total = jobApplications.length;
  const screening = jobApplications.filter(
    (job) => job.status === "screening",
  ).length;
  const interview = jobApplications.filter(
    (job) => job.status === "interview",
  ).length;
  const technical = jobApplications.filter(
    (job) => job.status === "technical_test",
  ).length;
  const rejected = jobApplications.filter(
    (job) => job.status === "rejected",
  ).length;

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Job Tracker</h1>
          <p className="text-sm text-muted-foreground">
            Track your job applications, interview progress, CV version, and
            notes.
          </p>
        </div>

        <Button className="w-fit">
          <Plus className="size-4" />
          Add Application
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <TrackerSummaryCard
          title="Total Applied"
          value={total}
          description="All tracked applications"
        />
        <TrackerSummaryCard
          title="Screening"
          value={screening}
          description="Waiting for first response"
        />
        <TrackerSummaryCard
          title="Interview"
          value={interview}
          description="Interview stage"
        />
        <TrackerSummaryCard
          title="Technical Test"
          value={technical}
          description="Assessment stage"
        />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <TabsList className="rounded-xl">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <p className="text-sm text-muted-foreground">
            {rejected} rejected · {total - rejected} active
          </p>
        </div>

        <TabsContent value="all" className="space-y-4">
          <JobApplicationList data={jobApplications} />
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <JobApplicationList
            data={jobApplications.filter((job) => job.status !== "rejected")}
          />
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <JobApplicationList
            data={jobApplications.filter((job) => job.status === "rejected")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TrackerSummaryCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <Card className="rounded-2xl shadow-none">
      <CardHeader className="space-y-1 pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function JobApplicationList({ data }: { data: JobTrackerItem[] }) {
  return (
    <div className="grid gap-4">
      {data.map((job) => (
        <JobApplicationCard key={job.id} job={job} />
      ))}
    </div>
  );
}

function JobApplicationCard({ job }: { job: JobTrackerItem }) {
  return (
    <Card className="rounded-2xl shadow-none transition-colors hover:bg-muted/30">
      <CardContent className="p-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getStatusBadgeVariant(job.status)}>
                {formatStatus(job.status)}
              </Badge>
              <Badge variant="outline">{formatJobType(job.type)}</Badge>
              <Badge variant="outline">{formatWorkType(job.workType)}</Badge>
              <Badge variant="secondary">{formatPlatform(job.platform)}</Badge>
            </div>

            <div>
              <h2 className="truncate text-base font-semibold">{job.role}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{job.name}</p>
            </div>

            <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Building2 className="size-4" />
                <span className="truncate">{job.company}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                <span className="truncate">{job.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays className="size-4" />
                <span>{formatDate(job.createdAt)}</span>
              </div>
            </div>

            {job.remarks ? (
              <p className="line-clamp-2 rounded-xl bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                {job.remarks}
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-2 md:flex-col md:items-end">
            {job.cv ? (
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                asChild
              >
                <a href={job.cv} target="_blank" rel="noreferrer">
                  <FileText className="size-4" />
                  CV
                </a>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                disabled
              >
                <FileText className="size-4" />
                No CV
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9">
                  <MoreHorizontal className="size-4" />
                  <span className="sr-only">Open job actions</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem>
                  <BriefcaseBusiness className="mr-2 size-4" />
                  Update Status
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="mr-2 size-4" />
                  Edit Notes
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ExternalLink className="mr-2 size-4" />
                  Open Platform
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getStatusBadgeVariant(status: JobStatus) {
  if (status === "rejected") return "destructive";
  if (status === "offering") return "default";
  if (status === "interview") return "secondary";
  if (status === "technical_test") return "secondary";

  return "outline";
}

function formatStatus(status: JobStatus) {
  const labels: Record<JobStatus, string> = {
    screening: "Screening",
    interview: "Interview",
    technical_test: "Technical Test",
    offering: "Offering",
    rejected: "Rejected",
  };

  return labels[status];
}

function formatJobType(type: JobType) {
  const labels: Record<JobType, string> = {
    full_time: "Full-time",
    part_time: "Part-time",
    freelance: "Freelance",
    contract: "Contract",
    internship: "Internship",
  };

  return labels[type];
}

function formatWorkType(type: WorkType) {
  const labels: Record<WorkType, string> = {
    onsite: "On-site",
    hybrid: "Hybrid",
    remote: "Remote",
  };

  return labels[type];
}

function formatPlatform(platform: Platform) {
  const labels: Record<Platform, string> = {
    linkedin: "LinkedIn",
    glints: "Glints",
    jobstreet: "JobStreet",
    kalibrr: "Kalibrr",
    website: "Website",
    referral: "Referral",
    other: "Other",
  };

  return labels[platform];
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
