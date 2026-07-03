import { useNavigate, useRouter } from "@tanstack/react-router";
import { Save } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { Textarea } from "#/components/ui/textarea";
import {
  createJobApplicationAction,
  updateJobApplicationAction,
} from "#/features/job-tracker/job-tracker.actions";
import {
  jobTypeValues,
  platformValues,
  trackerStatusValues,
  workTypeValues,
} from "#/features/job-tracker/job-tracker.schema";

import type { JobApplicationItem } from ".";

type JobTrackerInputFormProps =
  | {
      mode: "create";
    }
  | {
      mode: "edit";
      application: JobApplicationItem;
    };

type JobTypeValue = (typeof jobTypeValues)[number];
type PlatformValue = (typeof platformValues)[number];
type TrackerStatusValue = (typeof trackerStatusValues)[number];
type WorkTypeValue = (typeof workTypeValues)[number];

const defaultType: JobTypeValue = "full_time";
const defaultPlatform: PlatformValue = "linkeidn";
const defaultWorkType: WorkTypeValue = "Remote";
const defaultStatus: TrackerStatusValue = "screening";

export function JobTrackerInputForm(props: JobTrackerInputFormProps) {
  const { mode } = props;
  const application = mode === "edit" ? props.application : null;
  const router = useRouter();
  const navigate = useNavigate();

  const [isPending, setIsPending] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [cv, setCv] = useState("");
  const [type, setType] = useState<JobTypeValue>(defaultType);
  const [platform, setPlatform] = useState<PlatformValue>(defaultPlatform);
  const [workType, setWorkType] = useState<WorkTypeValue>(defaultWorkType);
  const [status, setStatus] = useState<TrackerStatusValue>(defaultStatus);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (!application) return;

    setName(application.name);
    setCompany(application.company);
    setRole(application.role);
    setLocation(application.location);
    setCv(application.cv ?? "");
    setType(asJobTypeValue(application.type));
    setPlatform(asPlatformValue(application.platform));
    setWorkType(asWorkTypeValue(application.workType));
    setStatus(asTrackerStatusValue(application.status));
    setRemarks(application.remarks ?? "");
  }, [application]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const input = {
      name: readFormValue(formData, "name"),
      company: readFormValue(formData, "company"),
      role: readFormValue(formData, "role"),
      location: readFormValue(formData, "location"),
      cv: readOptionalFormValue(formData, "cv"),
      type,
      platform,
      workType,
      status,
      remarks: readOptionalFormValue(formData, "remarks"),
    };

    setIsPending(true);

    try {
      if (mode === "create") {
        await createJobApplicationAction(input);
        toast.success("Job application created successfully");
        resetCreateState();
        form.reset();
      } else {
        await updateJobApplicationAction({
          ...input,
          id: props.application.id,
        });
        toast.success("Job application updated successfully");
      }

      await navigate({
        to: "/admin/job-tracker",
      });

      await router.invalidate({
        sync: true,
      });
    } catch (error) {
      console.error(`Failed to ${mode} job application:`, error);
      toast.error(
        mode === "create"
          ? "Failed to create job application."
          : "Failed to update job application.",
      );
    } finally {
      setIsPending(false);
    }
  }

  function resetCreateState() {
    setName("");
    setCompany("");
    setRole("");
    setLocation("");
    setCv("");
    setType(defaultType);
    setPlatform(defaultPlatform);
    setWorkType(defaultWorkType);
    setStatus(defaultStatus);
    setRemarks("");
  }

  return (
    <Card className="w-full shadow-none">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "New Application" : "Application"}
        </CardTitle>
        <CardDescription>
          Save the application details using the current tracker fields.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="application-name">Application Name</Label>
              <Input
                id="application-name"
                name="name"
                placeholder="Frontend Engineer Application"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="application-company">Company</Label>
              <Input
                id="application-company"
                name="company"
                placeholder="Craft Studio"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                disabled={isPending}
                required
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="application-role">Role</Label>
              <Input
                id="application-role"
                name="role"
                placeholder="Frontend Engineer"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                disabled={isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="application-location">Location</Label>
              <Input
                id="application-location"
                name="location"
                placeholder="Jakarta, Indonesia"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                disabled={isPending}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="application-cv">CV Link</Label>
            <Input
              id="application-cv"
              name="cv"
              type="url"
              placeholder="https://drive.google.com/file/d/..."
              value={cv}
              onChange={(event) => setCv(event.target.value)}
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              Paste a Google Drive, Notion, Dropbox, or other document link.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="application-type">Job Type</Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as JobTypeValue)}
                disabled={isPending}
              >
                <SelectTrigger id="application-type" className="w-full">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypeValues.map((value) => (
                    <SelectItem key={value} value={value}>
                      {formatJobType(value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="application-platform">Platform</Label>
              <Select
                value={platform}
                onValueChange={(value) => setPlatform(value as PlatformValue)}
                disabled={isPending}
              >
                <SelectTrigger id="application-platform" className="w-full">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platformValues.map((value) => (
                    <SelectItem key={value} value={value}>
                      {formatPlatform(value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="application-work-type">Work Type</Label>
              <Select
                value={workType}
                onValueChange={(value) => setWorkType(value as WorkTypeValue)}
                disabled={isPending}
              >
                <SelectTrigger id="application-work-type" className="w-full">
                  <SelectValue placeholder="Select work type" />
                </SelectTrigger>
                <SelectContent>
                  {workTypeValues.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="application-status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value as TrackerStatusValue)
                }
                disabled={isPending}
              >
                <SelectTrigger id="application-status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {trackerStatusValues.map((value) => (
                    <SelectItem key={value} value={value}>
                      {formatStatus(value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="application-remarks">Remarks</Label>
            <Textarea
              id="application-remarks"
              name="remarks"
              placeholder="Applied with portfolio link and updated React projects."
              className="min-h-28 resize-none"
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="flex justify-end gap-3 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => navigate({ to: "/admin/job-tracker" })}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              <Save className="size-4" />
              {isPending
                ? "Saving..."
                : mode === "edit"
                  ? "Save Changes"
                  : "Save Application"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function readFormValue(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() ?? "";
}

function readOptionalFormValue(formData: FormData, key: string) {
  const value = readFormValue(formData, key);

  return value === "" ? null : value;
}

function asJobTypeValue(value: string) {
  return jobTypeValues.includes(value as JobTypeValue)
    ? (value as JobTypeValue)
    : defaultType;
}

function asPlatformValue(value: string) {
  return platformValues.includes(value as PlatformValue)
    ? (value as PlatformValue)
    : defaultPlatform;
}

function asWorkTypeValue(value: string) {
  return workTypeValues.includes(value as WorkTypeValue)
    ? (value as WorkTypeValue)
    : defaultWorkType;
}

function asTrackerStatusValue(value: string | null) {
  return value && trackerStatusValues.includes(value as TrackerStatusValue)
    ? (value as TrackerStatusValue)
    : defaultStatus;
}

function formatStatus(status: string) {
  const labels: Record<string, string> = {
    screening: "Screening",
    interview: "Interview",
    rejected: "Rejected",
    signoff: "Signoff",
    accepted: "Accepted",
    draft: "Draft",
  };

  return labels[status] ?? titleCase(status);
}

function formatJobType(type: string) {
  const labels: Record<string, string> = {
    full_time: "Full-time",
    part_time: "Part-time",
    freelance: "Freelance",
    contract: "Contract",
    internship: "Internship",
    self_employed: "Self-employed",
  };

  return labels[type] ?? titleCase(type);
}

function formatPlatform(platform: string) {
  const labels: Record<string, string> = {
    linkeidn: "LinkedIn",
    jobstreet: "JobStreet",
    jobsdb: "JobsDB",
    "twitter/X": "Twitter/X",
  };

  return labels[platform] ?? titleCase(platform);
}

function titleCase(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
