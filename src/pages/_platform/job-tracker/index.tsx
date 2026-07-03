import { JobTrackerPage } from "./job-tracker-page";

export type JobApplicationItem = {
  id: string;
  name: string;
  company: string;
  location: string;
  role: string;
  cv: string | null;
  type: string;
  platform: string;
  workType: string;
  status: string | null;
  remarks: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type JobTrackerAdminProps = {
  applications?: JobApplicationItem[];
};

export default function JobTrackerAdmin({
  applications = [],
}: JobTrackerAdminProps) {
  return (
    <section className="flex flex-col gap-4">
      {/*<TitleText>Job Tracker</TitleText>*/}
      <JobTrackerPage applications={applications} />
    </section>
  );
}
