"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useEditor } from "@/editor/use-editor";
import type { TextElement } from "@/timeline";
import type { CaptionPreset } from "@/subtitles/presets";
import {
	applyCaptionPreset,
	applyPresetToText,
	findCaptionElements,
	isCaptionElement,
} from "@/subtitles/apply-preset";
import { CaptionStyleGrid } from "./caption-style-grid";

const PRESET_STORAGE_KEY = "reeltab:caption-preset";

/** Properties panel tab: pick a ready-made text style, like CapCut. */
export function TextStylesTab({
	element,
	trackId,
}: {
	element: TextElement;
	trackId: string;
}) {
	const editor = useEditor();
	const isCaption = isCaptionElement(element);
	const [scope, setScope] = useState<"all" | "one">("all");
	const [busyId, setBusyId] = useState<string | null>(null);
	const selectedId =
		typeof element.params.stylePreset === "string" ? element.params.stylePreset : null;

	const handlePick = async (preset: CaptionPreset) => {
		setBusyId(preset.id);
		try {
			if (isCaption) {
				const count = await applyCaptionPreset({
					editor,
					preset,
					onlyElementIds: scope === "one" ? [element.id] : undefined,
				});
				try {
					if (scope === "all") localStorage.setItem(PRESET_STORAGE_KEY, preset.id);
				} catch {}
				toast.success(`${preset.name} applied`, {
					description:
						scope === "all"
							? `Restyled all ${count} captions. Press Cmd+Z to undo.`
							: "Restyled this caption. Press Cmd+Z to undo.",
				});
			} else {
				await applyPresetToText({ editor, preset, trackId, element });
			}
		} catch (error) {
			console.error("Applying text style failed:", error);
			toast.error("Couldn't apply the style", {
				description: error instanceof Error ? error.message : "Try again.",
			});
		} finally {
			setBusyId(null);
		}
	};

	const captionCount = isCaption ? findCaptionElements({ editor }).length : 0;

	return (
		<div className="flex flex-col gap-3 p-3">
			{isCaption && (
				<div className="bg-accent grid grid-cols-2 gap-1 rounded-lg p-1 text-sm">
					{(["all", "one"] as const).map((value) => (
						<button
							key={value}
							type="button"
							onClick={() => setScope(value)}
							className={`rounded-md px-2 py-1.5 font-medium transition-colors ${
								scope === value
									? "bg-background text-foreground shadow-sm"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							{value === "all" ? `All captions (${captionCount})` : "This caption"}
						</button>
					))}
				</div>
			)}
			<CaptionStyleGrid
				selectedId={selectedId}
				busyId={busyId}
				onPick={(preset) => void handlePick(preset)}
				columns={3}
			/>
		</div>
	);
}
