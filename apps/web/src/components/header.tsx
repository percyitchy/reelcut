import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { DEFAULT_LOGO_URL } from "@/site/brand";
import { SOCIAL_LINKS } from "@/site/social";

export function Header() {
	return (
		<header className="bg-background/90 sticky top-0 z-10 border-b backdrop-blur">
			<div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3">
				<Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
					<Image
						src={DEFAULT_LOGO_URL}
						alt=""
						className="invert dark:invert-0"
						width={26}
						height={26}
					/>
					<span className="text-lg">Reeltab</span>
				</Link>
				<div className="flex items-center gap-2">
					<Link
						href={SOCIAL_LINKS.github}
						target="_blank"
						rel="noopener noreferrer"
						className="text-muted-foreground hover:text-foreground hidden text-sm sm:inline"
					>
						GitHub
					</Link>
					<Link href="/projects">
						<Button className="text-sm">
							Open the editor
							<ArrowRight className="size-4" />
						</Button>
					</Link>
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
