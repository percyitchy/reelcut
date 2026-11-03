import type { EditorCore } from "@/core";
import type { TextElement, TimelineElement } from "@/timeline";
import { loadFullFont } from "@/fonts/google-fonts";
import { SYSTEM_FONTS } from "@/fonts/system-fonts";
import { mediaTimeToSeconds } from "@/wasm";
import { buildSubtitleTextElement } from "./build-subtitle-text-element";
import type { CaptionPreset } from "./presets";

const CAPTION_NAME = /^Caption \d+$/;

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
}: {
	editor: EditorCore;
	preset: CaptionPreset;
}): Promise<number> {
	await loadPresetFont({ preset });
	const captions = findCaptionElements({ editor });
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
			},
		};
		return { trackId, elementId: element.id, patch };
	});

	editor.timeline.updateElements({ updates });
	return updates.length;
}
