import type { EditorCore } from "@/core";
import {
	AddTrackCommand,
	BatchCommand,
	InsertElementCommand,
} from "@/commands";
import { buildSubtitleTextElement } from "./build-subtitle-text-element";
import type { SubtitleCue } from "./types";
import type { CaptionPreset } from "./presets";

export function insertCaptionChunksAsTextTrack({
	editor,
	captions,
	preset,
}: {
	editor: EditorCore;
	captions: SubtitleCue[];
	preset?: CaptionPreset;
}): string | null {
	if (captions.length === 0) {
		return null;
	}

	const addTrackCommand = new AddTrackCommand({ type: "text", index: 0 });
	const trackId = addTrackCommand.getTrackId();
	const canvasSize = editor.project.getActive().settings.canvasSize;
	const insertCommands = captions.map(
		(caption, index) =>
			new InsertElementCommand({
				placement: { mode: "explicit", trackId },
				element: buildSubtitleTextElement({
					index,
					caption,
					canvasSize,
					preset,
				}),
			}),
	);
	editor.command.execute({
		command: new BatchCommand([addTrackCommand, ...insertCommands]),
	});

	return trackId;
}
