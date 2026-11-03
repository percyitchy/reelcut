import Link from "next/link";
import { SOCIAL_LINKS } from "@/site/social";

const links = [
	{ label: "Home", href: "/" },
	{ label: "Privacy", href: "/privacy" },
	{ label: "Terms", href: "/terms" },
	{ label: "Source code", href: SOCIAL_LINKS.github },
	{ label: "@zodchiii", href: SOCIAL_LINKS.x },
];

export function Footer() {
	return (
		<footer className="bg-background border-t">
			<div className="text-muted-foreground mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm md:flex-row md:items-center md:justify-between">
				<span>
					© {new Date().getFullYear()} Reelcut · A fork of{" "}
					<Link
						href={SOCIAL_LINKS.upstream}
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-foreground underline underline-offset-4"
					>
						OpenCut
					</Link>{" "}
					· MIT license
				</span>
				<nav className="flex flex-wrap gap-5">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="hover:text-foreground transition-colors"
							target={link.href.startsWith("http") ? "_blank" : undefined}
							rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
						>
							{link.label}
						</Link>
					))}
				</nav>
			</div>
		</footer>
	);
}
