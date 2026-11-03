import type {
	TranscriptionModel,
	TranscriptionModelId,
} from "./types";

export const TRANSCRIPTION_MODELS: TranscriptionModel[] = [
	{
		id: "whisper-tiny",
		name: "Tiny",
		huggingFaceId: "onnx-community/whisper-tiny",
		description: "Fastest, lower accuracy",
	},
	{
		id: "whisper-base",
		name: "Base",
		huggingFaceId: "onnx-community/whisper-base",
		description: "Fast, good for clear speech",
	},
	{
		id: "whisper-small",
		name: "Small",
		huggingFaceId: "onnx-community/whisper-small",
		description: "Good balance of speed and accuracy",
	},
	{
		id: "whisper-medium",
		name: "Medium",
		huggingFaceId: "onnx-community/whisper-medium",
		description: "Higher accuracy, slower",
	},
	{
		id: "whisper-large-v3-turbo",
		name: "Large v3 Turbo",
		huggingFaceId: "onnx-community/whisper-large-v3-turbo",
		description: "Best accuracy, requires WebGPU for good performance",
	},
];

export const DEFAULT_TRANSCRIPTION_MODEL: TranscriptionModelId =
	"whisper-base";

/** Models offered in the captions panel, with their first-time download size. */
export const CAPTION_QUALITY_OPTIONS: Array<{
	id: TranscriptionModelId;
	label: string;
	size: string;
}> = [
	{ id: "whisper-tiny", label: "Fastest", size: "40 MB" },
	{ id: "whisper-base", label: "Fast", size: "73 MB" },
	{ id: "whisper-small", label: "Accurate", size: "223 MB" },
];
