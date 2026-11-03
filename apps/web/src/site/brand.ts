export const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL ?? "https://getreeltab.vercel.app";

export const SITE_INFO = {
	title: "Reeltab",
	description:
		"A free, open-source video editor that runs in your browser. Edit any video and add auto subtitles, with no watermark.",
	url: SITE_URL,
	openGraphImage: "/open-graph/default.jpg",
	twitterImage: "/open-graph/default.jpg",
	favicon: "/favicon.ico",
};

export const DEFAULT_LOGO_URL = "/logos/reelcut/logo.svg";
