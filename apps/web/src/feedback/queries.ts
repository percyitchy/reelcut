import { Redis } from "@upstash/redis";
import { webEnv } from "@/env/web";
import { generateUUID } from "@/utils/id";
import type { FeedbackEntry, SubmitFeedbackInput } from "./types";

const redis = new Redis({
	url: webEnv.UPSTASH_REDIS_REST_URL,
	token: webEnv.UPSTASH_REDIS_REST_TOKEN,
});

export async function submitFeedback({
	message,
}: SubmitFeedbackInput): Promise<FeedbackEntry> {
	const entry = { id: generateUUID(), message, createdAt: new Date().toISOString() };
	await redis.lpush("reelcut:feedback", JSON.stringify(entry));
	return entry;
}
