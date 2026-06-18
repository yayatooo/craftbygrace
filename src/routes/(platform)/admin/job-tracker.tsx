import JobTrackerAdmin from "#/pages/_platform/job-tracker";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(platform)/admin/job-tracker")({
  component: RouteComponent,
});

function RouteComponent() {
  return <JobTrackerAdmin />;
}
