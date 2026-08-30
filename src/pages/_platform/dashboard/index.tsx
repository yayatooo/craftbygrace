import { TitleText } from "#/components/title-text";
import { ChartAreaInteractive } from "../components/chart-area-interactive";

export default function DashboardAdmin() {
	return (
		<section className="flex flex-col gap-4">
			<TitleText>Dashboard Admin</TitleText>
			<ChartAreaInteractive />
		</section>
	);
}
