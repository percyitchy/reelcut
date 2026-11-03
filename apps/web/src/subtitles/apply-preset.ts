import type { EditorCore } from "@/core";
import type { TextElement, TimelineElement } from "@/timeline";
import { loadFullFont } from "@/fonts/google-fonts";
import { SYSTEM_FONTS } from "@/fonts/system-fonts";
import { mediaTimeToSeconds } from "@/wasm";
import { buildSubtitleTextElement } from "./build-subtitle-text-element";
import {
	captionEffectParamsFromPreset,
	captionStyleFromPreset,
	type CaptionPreset,
} from "./presets";

const CAPTION_NAME = /^Caption \d+$/;

export function isCaptionElement(element: { name: string }): boolean {
	return CAPTION_NAME.test(element.name);
}

/** Captions are the text elements the captions panel created ("Caption 12"). */
export function findCaptionElements({
	editor,
}: {
	editor: EditorCore;
}): Array<{ trackId: string; element: TextElement }> {
	const tracks = editor.scenes.getActiveScene().tracks;
	const found: Array<{ trackId: string; element: TextElement }> = [];
	for (const track of tracks.overlay) {
		if (track.type !== "text") continue;
		for (const element of track.elements) {
			if (CAPTION_NAME.test(element.name)) {
				found.push({ trackId: track.id, element });
			}
		}
	}
	return found;
}

/** Loads the preset's font so text is measured and drawn with the right glyphs. */
export async function loadPresetFont({
	preset,
}: {
	preset: CaptionPreset;
}): Promise<void> {
	if (SYSTEM_FONTS.has(preset.fontFamily)) return;
	await loadFullFont({ family: preset.fontFamily });
}

/**
 * Restyles every caption in the active scene with one preset, re-wrapping
 * each line and placing it for the canvas size. One undo step.
 */
export async function applyCaptionPreset({
	editor,
	preset,
	onlyElementIds,
}: {
	editor: EditorCore;
	preset: CaptionPreset;
	/** restyle just these captions instead of all of them */
	onlyElementIds?: string[];
}): Promise<number> {
	await loadPresetFont({ preset });
	const captions = findCaptionElements({ editor }).filter(
		({ element }) => !onlyElementIds || onlyElementIds.includes(element.id),
	);
	if (captions.length === 0) return 0;

	const canvasSize = editor.project.getActive().settings.canvasSize;
	const updates = captions.map(({ trackId, element }, index) => {
		const text = String(element.params.content ?? "")
			.replace(/\s*\n\s*/g, " ")
			.trim();
		const rebuilt = buildSubtitleTextElement({
			index,
			caption: {
				text,
				startTime: mediaTimeToSeconds({ time: element.startTime }),
				duration: mediaTimeToSeconds({ time: element.duration }),
			},
			canvasSize,
			preset,
		});
		const patch: Partial<TimelineElement> = {
			params: {
				...element.params,
				...rebuilt.params,
				// keep the caption's own opacity and blend mode
				opacity: element.params.opacity ?? rebuilt.params.opacity,
				blendMode: element.params.blendMode ?? rebuilt.params.blendMode,
				stylePreset: preset.id,
			},
		};
		return { trackId, elementId: element.id, patch };
	});

	editor.timeline.updateElements({ updates });
	return updates.length;
}

/**
 * Styles a regular text element: colours, font, outline, shadow and label,
 * keeping its own text, size and position.
 */
export async function applyPresetToText({
	editor,
	preset,
	trackId,
	element,
}: {
	editor: EditorCore;
	preset: CaptionPreset;
	trackId: string;
	element: TextElement;
}): Promise<void> {
	await loadPresetFont({ preset });
	const canvasSize = editor.project.getActive().settings.canvasSize;
	const style = captionStyleFromPreset({ preset, canvasSize });
	const background = style.background ?? { enabled: false, color: "#000000" };
	editor.timeline.updateElements({
		updates: [
			{
				trackId,
				elementId: element.id,
				patch: {
					params: {
						...element.params,
						fontFamily: preset.fontFamily,
						fontWeight: preset.fontWeight,
						fontStyle: preset.fontStyle ?? "normal",
						color: preset.color,
						letterSpacing: preset.letterSpacing ?? 0,
						"background.enabled": background.enabled,
						"background.color": background.color,
						...(preset.background
							? {
									"background.cornerRadius": preset.background.cornerRadius,
									"background.paddingX": preset.background.paddingX,
									"background.paddingY": preset.background.paddingY,
								}
							: {}),
						...captionEffectParamsFromPreset({ preset }),
						stylePreset: preset.id,
					},
				},
			},
		],
	});
}
