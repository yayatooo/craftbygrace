import {
	Timeline,
	TimelineContent,
	TimelineDate,
	TimelineHeader,
	TimelineIndicator,
	TimelineItem,
	TimelineSeparator,
	TimelineTitle,
} from "#/components/ui/timeline.tsx";

const items = [
	{
		title: "Overview",
		description:
			"Dive deep into your business flow—uncover goals, scope, and key details. We clarify everything upfront to ensure a rock-solid foundation.",
		id: 1,
		subtitle: " Align on Vision",
	},
	{
		title: "Design",
		description:
			"Build intuitive designs prioritizing user experience, project needs, and peak performance. Every pixel serves your objectives.",
		id: 2,
		subtitle: "Craft user-first experience",
	},
	{
		title: "Development",
		description:
			"Select the optimal languages and frameworks tailored to your scope. We develop fast, clean, and scalable—delivering code that powers growth.",
		id: 3,
		subtitle: "Code with Percision",
	},
	{
		title: "Staging",
		description:
			"Run phase-by-phase checkpoints, share progress with you, and align every step to business goals. Feedback loops keep us on track.",
		id: 4,
		subtitle: "Validate & Iterate",
	},
	{
		title: "Deploy",
		description:
			"Roll out to production on your approved servers. Rigorous testing confirms flawless functions and top-tier performance—live and thriving.",
		id: 5,
		subtitle: "Launch with confidence",
	},
];

export default function TimelineWorkflow() {
	return (
		<section className="scroll-mt-8 py-8 flex flex-col gap-4">
			<h1 className="text-base font-semibold sm:text-lg">Workflow</h1>
			<p>
				For Flawless Delivery I build high-performing web apps using the Agile,
				breaking it into five streamlined phases for efficiency, transparency,
				and results that exceed expectations.
			</p>
			<div className="pt-8">
				<Timeline defaultValue={5}>
					{items.map((item) => (
						<TimelineItem
							className="sm:group-data-[orientation=vertical]/timeline:ms-32"
							key={item.id}
							step={item.id}
						>
							<TimelineHeader>
								<TimelineSeparator />
								<TimelineDate className="sm:group-data-[orientation=vertical]/timeline:-left-32 sm:group-data-[orientation=vertical]/timeline:absolute sm:group-data-[orientation=vertical]/timeline:w-20 sm:group-data-[orientation=vertical]/timeline:text-right">
									{item.title}
								</TimelineDate>
								<TimelineTitle className="sm:-mt-0.5">
									{item.subtitle}
								</TimelineTitle>
								<TimelineIndicator />
							</TimelineHeader>
							<TimelineContent>{item.description}</TimelineContent>
						</TimelineItem>
					))}
				</Timeline>
			</div>
		</section>
	);
}
