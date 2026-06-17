import { ChartAreaInteractive } from "../components/chart-area-interactive";

export default function DashboardAdmin() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-base font-semibold sm:text-lg">Dashboard</h1>
      <ChartAreaInteractive />
    </section>
  );
}
