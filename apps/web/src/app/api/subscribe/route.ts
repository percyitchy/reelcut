import { type NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { webEnv } from "@/env/web";
import {
	ACCESS_COOKIE,
	ACCESS_MAX_AGE,
	normalizeEmail,
	signAccess,
	verifyAccess,
} from "@/access/token";

const redis = new Redis({
	url: webEnv.UPSTASH_REDIS_REST_URL,
	token: webEnv.UPSTASH_REDIS_REST_TOKEN,
});

const EDITOR_URL = webEnv.EDITOR_URL || "/projects";
const LIMIT_PER_HOUR = 20;

/** GET tells the landing page whether this browser already has access. */
export async function GET(request: NextRequest) {
	const secret = webEnv.ACCESS_SECRET;
	const token = request.cookies.get(ACCESS_COOKIE)?.value;
	const email = secret ? await verifyAccess(token, secret) : null;
	return NextResponse.json(
		{ gate: Boolean(secret), access: Boolean(email), email, editorUrl: email ? EDITOR_URL : null },
		{ headers: { "Cache-Control": "no-store" } },
	);
}

/** POST stores the email and grants access with a signed cookie. */
export async function POST(request: NextRequest) {
	let body: { email?: unknown; company?: unknown } = {};
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "invalid_body" }, { status: 400 });
	}

	// Honeypot: real people never fill the hidden "company" field.
	if (body.company) return NextResponse.json({ ok: true, editorUrl: null });

	const email = normalizeEmail(body.email);
	if (!email) return NextResponse.json({ error: "invalid_email" }, { status: 400 });

	const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
	const rlKey = `reelcut:rl:${ip}`;

	try {
		const pipe = redis.pipeline();
		pipe.incr(rlKey);
		pipe.expire(rlKey, 3600, "NX");
		pipe.hsetnx("reelcut:emails", email, new Date().toISOString());
		const [count] = (await pipe.exec()) as [number, number, number];
		if (count > LIMIT_PER_HOUR) {
			return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
		}
	} catch (error) {
		console.error("subscribe: storage failed", error);
		return NextResponse.json({ error: "storage_failed" }, { status: 502 });
	}

	const secret = webEnv.ACCESS_SECRET;
	if (!secret) {
		// Without a secret there is no gate: the email is saved and the editor stays open.
		return NextResponse.json({ ok: true, editorUrl: EDITOR_URL });
	}

	const response = NextResponse.json({ ok: true, editorUrl: EDITOR_URL });
	response.cookies.set(ACCESS_COOKIE, await signAccess(email, secret), {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: ACCESS_MAX_AGE,
	});
	return response;
}
