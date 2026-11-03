import type { Metadata } from "next";
import { BasePage } from "@/app/base-page";
import { SOCIAL_LINKS } from "@/site/social";

export const metadata: Metadata = {
	title: "Privacy Policy - Reelcut",
	description:
		"How Reelcut handles your data: your videos stay on your device, and we store only the email you give us.",
};

const link = "text-primary hover:underline";

export default function PrivacyPage() {
	return (
		<BasePage
			title="Privacy policy"
			description="What we store, what we don't, and how to reach us."
		>
			<section className="flex flex-col gap-3 rounded-2xl border p-6">
				<h2 className="text-xl font-semibold">Quick summary</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>Your videos and projects never leave your device.</li>
					<li>Auto captions run in your browser, so your audio is not uploaded.</li>
					<li>The only personal data we store is the email you enter to get access.</li>
					<li>We don&apos;t sell your email or share it with advertisers.</li>
					<li>We don&apos;t run analytics or tracking scripts.</li>
				</ul>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">Your email</h2>
				<p>
					When you enter your email to unlock the editor, we store it together
					with the time you signed up. We use it to give you access and to tell
					you about important updates to Reelcut. The list is kept in an Upstash
					Redis database run for this site.
				</p>
				<p>
					To have your email deleted, message us on{" "}
					<a href={SOCIAL_LINKS.x} target="_blank" rel="noopener noreferrer" className={link}>
						X (@zodchiii)
					</a>{" "}
					and we will remove it.
				</p>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">Your videos and projects</h2>
				<p>
					Footage is loaded from your computer and edited in your browser.
					Projects, thumbnails and settings are saved in your browser&apos;s own
					storage (IndexedDB and the Origin Private File System). We never
					receive your files, and you can clear them at any time in your browser
					settings.
				</p>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">Cookies and local storage</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong>reelcut_access</strong>: a cookie that remembers you entered
						your email, so the editor opens without asking again. It lasts one
						year.
					</li>
					<li>Browser storage for your projects, preferences and editor state.</li>
				</ul>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">Third-party services</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong>Vercel</strong> hosts the site.
					</li>
					<li>
						<strong>Upstash</strong> stores the email list, feedback messages and
						rate limits.
					</li>
					<li>
						<strong>Hugging Face</strong> serves the open speech models that
						auto captions download to your browser the first time you use them.
					</li>
					<li>
						<strong>Freesound</strong> answers sound effect searches, if you use
						the sound library.
					</li>
				</ul>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">Open source</h2>
				<p>
					Reelcut is a fork of{" "}
					<a href={SOCIAL_LINKS.upstream} target="_blank" rel="noopener noreferrer" className={link}>
						OpenCut
					</a>{" "}
					released under the MIT license. You can read every line of the code{" "}
					<a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className={link}>
						on GitHub
					</a>
					.
				</p>
			</section>
		</BasePage>
	);
}
