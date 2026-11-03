"use client";

import { useEffect } from "react";
import { CAPTION_PRESETS, type CaptionPreset } from "@/subtitles/presets";

const PREVIEW_FONTS_HREF = `https://fonts.googleapis.com/css2?${[
	...new Set(CAPTION_PRESETS.map((preset) => preset.fontFamily)),
]
	.filter((family) => family !== "Arial")
	.map((family) => `family=${family.replace(/ /g, "+")}`)
	.join("&")}&display=swap`;

/** Loads every preset font once so the style thumbnails look like the real thing. */
export function useCaptionPreviewFonts() {
	useEffect(() => {
		if (document.querySelector("link[data-caption-preview-fonts]")) return;
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = PREVIEW_FONTS_HREF;
		link.dataset.captionPreviewFonts = "true";
		document.head.appendChild(link);
	}, []);
}

export function PresetPreview({
	preset,
	sizePx = 15,
}: {
	preset: CaptionPreset;
	sizePx?: number;
}) {
	const size = sizePx * (preset.fontFamily === "Press Start 2P" ? 0.6 : 1);
	const strokePx = preset.stroke ? (size * preset.stroke.width) / 100 : 0;
	const shadow = preset.shadow
		? `0 ${(size * preset.shadow.offsetY) / 100}px ${(size * preset.shadow.blur) / 100}px ${preset.shadow.color}`
		: undefined;
	return (
		<span
			style={{
				fontFamily: `"${preset.fontFamily}", sans-serif`,
				fontWeight: preset.fontWeight === "bold" ? 700 : 400,
				fontStyle: preset.fontStyle ?? "normal",
				fontSize: `${size}px`,
				lineHeight: 1.15,
				letterSpacing: `${(preset.letterSpacing ?? 0) / 4}px`,
				color: preset.color,
				WebkitTextStroke: strokePx ? `${strokePx * 2}px ${preset.stroke?.color}` : undefined,
				paintOrder: "stroke fill",
				textShadow: shadow,
				background: preset.background?.color,
				borderRadius: preset.background
					? `${Math.min(preset.background.cornerRadius, 40) / 6}px`
					: undefined,
				padding: preset.background ? "2px 7px" : undefined,
				whiteSpace: "nowrap",
			}}
		>
			{preset.uppercase ? "ABC" : "Abc"}
		</span>
	);
}

/** CapCut-style grid of text styles. */
export function CaptionStyleGrid({
	selectedId,
	busyId,
	onPick,
	columns = 3,
}: {
	selectedId: string | null;
	busyId?: string | null;
	onPick: (preset: CaptionPreset) => void;
	columns?: 2 | 3;
}) {
	useCaptionPreviewFonts();
	return (
		<div
			className="grid gap-2"
			style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
		>
			{CAPTION_PRESETS.map((preset) => {
				const selected = preset.id === selectedId;
				return (
					<button
						key={preset.id}
						type="button"
						onClick={() => onPick(preset)}
						disabled={Boolean(busyId)}
						aria-pressed={selected}
						aria-label={preset.name}
						title={preset.name}
						className={`relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-lg border transition ${
							selected
								? "border-primary ring-primary/40 ring-2"
								: "border-transparent hover:border-foreground/30"
						}`}
						style={{
							background:
								"linear-gradient(160deg, #39445f 0%, #5b4466 55%, #26262f 100%)",
						}}
					>
						<PresetPreview preset={preset} sizePx={columns === 3 ? 20 : 15} />
						<span className="absolute right-0 bottom-1 left-0 truncate px-1 text-center text-[10px] font-medium text-white/75">
							{busyId === preset.id ? "Applying…" : preset.name}
						</span>
					</button>
				);
			})}
		</div>
	);
}
