import type { SubtitleStyleOverrides } from "./types";

/**
 * Where the caption sits. The builder turns this into margins that suit the
 * canvas: vertical videos keep captions above the app UI at the bottom.
 */
export type CaptionPosition = "bottom" | "lower" | "center";

export interface CaptionPreset {
	id: string;
	name: string;
	group: "Short-form" | "Boxed" | "Clean" | "Character";
	fontFamily: string;
	/** font weight we ask Google Fonts for; display fonts only ship 400 */
	fontWeight: "normal" | "bold";
	fontStyle?: "normal" | "italic";
	/** size in app units for a 16:9 canvas; vertical canvases scale it down */
	fontSize: number;
	color: string;
	uppercase?: boolean;
	letterSpacing?: number;
	lineHeight?: number;
	/** outline, percent of the font size */
	stroke?: { width: number; color: string };
	/** shadow, blur and offset as percent of the font size */
	shadow?: { blur: number; offsetY: number; color: string };
	background?: {
		color: string;
		cornerRadius: number;
		paddingX: number;
		paddingY: number;
	};
	position: CaptionPosition;
}

export const CAPTION_PRESETS: CaptionPreset[] = [
	// Short-form: big, bold, readable on a phone without sound
	{ id: "bold-white", name: "Bold White", group: "Short-form", fontFamily: "Montserrat", fontWeight: "bold", fontSize: 6, color: "#FFFFFF", uppercase: true, stroke: { width: 12, color: "#000000" }, position: "lower" },
	{ id: "yellow-punch", name: "Yellow Punch", group: "Short-form", fontFamily: "Anton", fontWeight: "normal", fontSize: 7, color: "#FFE14D", uppercase: true, letterSpacing: 3, stroke: { width: 10, color: "#000000" }, position: "center" },
	{ id: "neon-green", name: "Neon Green", group: "Short-form", fontFamily: "Montserrat", fontWeight: "bold", fontSize: 6, color: "#3DFF6E", uppercase: true, stroke: { width: 12, color: "#000000" }, shadow: { blur: 0, offsetY: 8, color: "#000000" }, position: "lower" },
	{ id: "impact-shadow", name: "Impact Shadow", group: "Short-form", fontFamily: "Bebas Neue", fontWeight: "normal", fontSize: 8, color: "#FFFFFF", letterSpacing: 4, shadow: { blur: 18, offsetY: 6, color: "#000000E6" }, position: "center" },
	{ id: "comic-pop", name: "Comic Pop", group: "Short-form", fontFamily: "Bangers", fontWeight: "normal", fontSize: 7, color: "#FFD60A", letterSpacing: 3, stroke: { width: 12, color: "#111111" }, shadow: { blur: 0, offsetY: 7, color: "#111111" }, position: "lower" },
	{ id: "bubble", name: "Bubble", group: "Short-form", fontFamily: "Luckiest Guy", fontWeight: "normal", fontSize: 6.5, color: "#FFFFFF", stroke: { width: 14, color: "#000000" }, position: "lower" },
	{ id: "purple-pop", name: "Purple Pop", group: "Short-form", fontFamily: "Lilita One", fontWeight: "normal", fontSize: 6.5, color: "#FFFFFF", stroke: { width: 13, color: "#7A3CFF" }, position: "lower" },
	{ id: "glow", name: "Glow", group: "Short-form", fontFamily: "Montserrat", fontWeight: "bold", fontSize: 6, color: "#FFFFFF", uppercase: true, shadow: { blur: 45, offsetY: 0, color: "#00E5FF" }, position: "lower" },

	// Boxed: text on a solid label, readable on any footage
	{ id: "black-box", name: "Black Box", group: "Boxed", fontFamily: "Montserrat", fontWeight: "bold", fontSize: 5, color: "#FFFFFF", background: { color: "#000000D9", cornerRadius: 30, paddingX: 36, paddingY: 30 }, position: "lower" },
	{ id: "white-box", name: "White Box", group: "Boxed", fontFamily: "Montserrat", fontWeight: "bold", fontSize: 5, color: "#111111", background: { color: "#FFFFFF", cornerRadius: 30, paddingX: 36, paddingY: 30 }, position: "lower" },
	{ id: "highlighter", name: "Highlighter", group: "Boxed", fontFamily: "Poppins", fontWeight: "bold", fontSize: 5, color: "#111111", background: { color: "#FFE14D", cornerRadius: 12, paddingX: 30, paddingY: 24 }, position: "lower" },
	{ id: "pink-pill", name: "Pink Pill", group: "Boxed", fontFamily: "Poppins", fontWeight: "bold", fontSize: 5, color: "#FFFFFF", background: { color: "#FF3E8A", cornerRadius: 100, paddingX: 44, paddingY: 28 }, position: "lower" },
	{ id: "red-alert", name: "Red Alert", group: "Boxed", fontFamily: "Anton", fontWeight: "normal", fontSize: 6, color: "#FFFFFF", uppercase: true, letterSpacing: 1, background: { color: "#E8263A", cornerRadius: 8, paddingX: 30, paddingY: 22 }, position: "lower" },
	{ id: "news-blue", name: "News Blue", group: "Boxed", fontFamily: "DM Sans", fontWeight: "bold", fontSize: 4.6, color: "#FFFFFF", background: { color: "#1E40FF", cornerRadius: 6, paddingX: 34, paddingY: 26 }, position: "bottom" },

	// Clean: lectures, interviews, podcasts, YouTube
	{ id: "classic", name: "Classic", group: "Clean", fontFamily: "Arial", fontWeight: "bold", fontSize: 4.4, color: "#FFFFFF", stroke: { width: 7, color: "#000000" }, position: "bottom" },
	{ id: "cinema", name: "Cinema", group: "Clean", fontFamily: "Roboto", fontWeight: "normal", fontSize: 4.2, color: "#FFFFFF", shadow: { blur: 22, offsetY: 4, color: "#000000CC" }, position: "bottom" },
	{ id: "lecture", name: "Lecture", group: "Clean", fontFamily: "Inter", fontWeight: "normal", fontSize: 4, color: "#FFFFFF", background: { color: "#000000B3", cornerRadius: 14, paddingX: 32, paddingY: 24 }, position: "bottom" },
	{ id: "minimal", name: "Minimal", group: "Clean", fontFamily: "Poppins", fontWeight: "normal", fontSize: 4.4, color: "#FFFFFF", shadow: { blur: 14, offsetY: 3, color: "#00000099" }, position: "bottom" },
	{ id: "podcast", name: "Podcast", group: "Clean", fontFamily: "Space Grotesk", fontWeight: "bold", fontSize: 4.6, color: "#F5F5F5", background: { color: "#16161ACC", cornerRadius: 20, paddingX: 34, paddingY: 26 }, position: "bottom" },
	{ id: "elegant", name: "Elegant", group: "Clean", fontFamily: "Playfair Display", fontWeight: "normal", fontStyle: "italic", fontSize: 4.8, color: "#FFFFFF", shadow: { blur: 20, offsetY: 4, color: "#000000B3" }, position: "bottom" },

	// Character: a distinct look for a specific vibe
	{ id: "marker", name: "Marker", group: "Character", fontFamily: "Permanent Marker", fontWeight: "normal", fontSize: 5.5, color: "#FFFFFF", shadow: { blur: 0, offsetY: 6, color: "#000000" }, position: "lower" },
	{ id: "retro-game", name: "Retro Game", group: "Character", fontFamily: "Press Start 2P", fontWeight: "normal", fontSize: 3.2, color: "#FFFFFF", lineHeight: 1.6, stroke: { width: 14, color: "#000000" }, position: "lower" },
	{ id: "terminal", name: "Terminal", group: "Character", fontFamily: "VT323", fontWeight: "normal", fontSize: 6, color: "#3DFF6E", background: { color: "#000000E6", cornerRadius: 4, paddingX: 30, paddingY: 18 }, position: "bottom" },
	{ id: "sunset", name: "Sunset", group: "Character", fontFamily: "Lilita One", fontWeight: "normal", fontSize: 6.5, color: "#FF8A3D", stroke: { width: 12, color: "#3A0CA3" }, position: "lower" },
];

export const DEFAULT_CAPTION_PRESET_ID = "bold-white";

export function getCaptionPreset(id: string | null | undefined): CaptionPreset {
	return (
		CAPTION_PRESETS.find((preset) => preset.id === id) ??
		(CAPTION_PRESETS.find((preset) => preset.id === DEFAULT_CAPTION_PRESET_ID) as CaptionPreset)
	);
}

/** Vertical canvases are tall, so the same app-unit size would look huge. */
const PORTRAIT_FONT_SCALE = 0.72;

export function captionStyleFromPreset({
	preset,
	canvasSize,
}: {
	preset: CaptionPreset;
	canvasSize: { width: number; height: number };
}): SubtitleStyleOverrides {
	const portrait = canvasSize.height > canvasSize.width;
	const margin =
		preset.position === "bottom"
			? portrait ? 0.14 : 0.07
			: preset.position === "lower"
				? portrait ? 0.24 : 0.12
				: 0;
	return {
		fontFamily: preset.fontFamily,
		fontSize: preset.fontSize * (portrait ? PORTRAIT_FONT_SCALE : 1),
		color: preset.color,
		fontWeight: preset.fontWeight,
		fontStyle: preset.fontStyle ?? "normal",
		textAlign: "center",
		letterSpacing: preset.letterSpacing ?? 0,
		lineHeight: preset.lineHeight ?? 1.15,
		background: preset.background
			? { enabled: true, ...preset.background }
			: { enabled: false, color: "#000000" },
		placement:
			preset.position === "center"
				? { verticalAlign: "middle" }
				: { verticalAlign: "bottom", marginVerticalRatio: margin },
	};
}

/** Extra text params a preset sets that the subtitle style type doesn't cover. */
export function captionEffectParamsFromPreset({
	preset,
}: {
	preset: CaptionPreset;
}): Record<string, string | number> {
	return {
		textTransform: preset.uppercase ? "uppercase" : "none",
		"stroke.width": preset.stroke?.width ?? 0,
		"stroke.color": preset.stroke?.color ?? "#000000",
		"shadow.blur": preset.shadow?.blur ?? 0,
		"shadow.offsetY": preset.shadow?.offsetY ?? 0,
		"shadow.color": preset.shadow?.color ?? "#000000",
	};
}

/** Google Fonts weight to request for a preset. */
export function presetFontWeights(preset: CaptionPreset): number[] {
	return [preset.fontWeight === "bold" ? 700 : 400];
}
