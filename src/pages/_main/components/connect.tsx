import type { IconType } from "react-icons";
import { BsMailbox2 } from "react-icons/bs";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { cn } from "#/lib/utils";

type SocialLink = {
	label: string;
	href: string;
	icon: IconType;
	hoverClassName: string;
	className?: string;
};

const socialLinks: SocialLink[] = [
	{
		label: "GitHub",
		href: "https://github.com",
		icon: FaGithub,
		hoverClassName: "hover:border-[#181717] hover:bg-[#181717]",
	},
	{
		label: "Twitter",
		href: "https://twitter.com",
		icon: FaTwitter,
		hoverClassName: "hover:border-[#1da1f2] hover:bg-[#1da1f2]",
	},
	{
		label: "Instagram",
		href: "https://instagram.com",
		icon: FaInstagram,
		hoverClassName: "hover:border-[#e4405f] hover:bg-[#e4405f]",
	},
	{
		label: "LinkedIn",
		href: "https://www.linkedin.com",
		icon: FaLinkedin,
		hoverClassName: "hover:border-[#0a66c2] hover:bg-[#0a66c2]",
	},
	{
		label: "Email",
		href: "mailto:hello@craftbygrace.com",
		icon: BsMailbox2,
		hoverClassName: "hover:border-[#ea4335] hover:bg-[#ea4335]",
		className: "col-span-2 sm:col-span-1",
	},
];

export default function Connect() {
	return (
		<section id="connect" className="flex scroll-mt-8 flex-col gap-4 py-12">
			<h1 className="text-base font-semibold sm:text-lg">Connect with me</h1>
			<div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
				{socialLinks.map((item) => (
					<a
						key={item.label}
						href={item.href}
						aria-label={item.label}
						target={item.href.startsWith("mailto:") ? undefined : "_blank"}
						rel={item.href.startsWith("mailto:") ? undefined : "noreferrer"}
						className={cn(
							"group flex h-20 min-w-0 flex-col items-center justify-center gap-2 rounded-lg border border-border bg-secondary text-foreground transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
							item.hoverClassName,
							item.className,
						)}
					>
						<item.icon className="size-7 shrink-0 transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:text-white" />
					</a>
				))}
			</div>
		</section>
	);
}
