import {
	IconCamera,
	IconChartBar,
	IconDashboard,
	IconFileAi,
	IconFileCv,
	IconFileDescription,
	IconFileWord,
	IconFolder,
	IconHelp,
	IconListDetails,
	IconMovie,
	IconMusic,
	IconPencil,
	IconRocket,
	IconSettings,
} from "@tabler/icons-react";
import { Code } from "lucide-react";
import type * as React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavDocuments } from "./nav-documents";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

const data = {
	user: {
		name: "Rahmat Hidayat",
		email: "admin@craftbygrace.com",
		avatar: "/avatar.jpg",
	},
	navMain: [
		{
			title: "Dashboard",
			url: "/admin/dashboard",
			icon: IconDashboard,
		},
		{
			title: "Gallery",
			url: "/admin/gallery",
			icon: IconListDetails,
		},
		{
			title: "Experiences",
			url: "/admin/experiences",
			icon: IconChartBar,
		},
		{
			title: "Projects",
			url: "/admin/projects",
			icon: IconFolder,
		},
		{
			title: "Movies",
			url: "/admin/movies",
			icon: IconMovie,
		},
		{
			title: "Songs",
			url: "/admin/songs",
			icon: IconMusic,
		},
		{
			title: "Blogs",
			url: "/admin/blogs",
			icon: IconPencil,
		},
	],
	navClouds: [
		{
			title: "Capture",
			icon: IconCamera,
			isActive: true,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
		{
			title: "Proposal",
			icon: IconFileDescription,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
		{
			title: "Prompts",
			icon: IconFileAi,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
	],
	navSecondary: [
		{
			title: "Settings",
			url: "/admin/settings",
			icon: IconSettings,
		},
		{
			title: "Get Help",
			url: "#",
			icon: IconHelp,
		},
	],
	documents: [
		{
			name: "Job Tracker",
			url: "/admin/job-tracker",
			icon: IconRocket,
		},
		{
			name: "Resume",
			url: "#",
			icon: IconFileCv,
		},
		{
			name: "Word Assistant",
			url: "#",
			icon: IconFileWord,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:p-1.5!"
						>
							<div>
								<Code className="size-5!" />
								<span className="text-base font-semibold">Hello Yato !</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavDocuments items={data.documents} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
