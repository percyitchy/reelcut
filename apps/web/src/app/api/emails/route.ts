import { type NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { webEnv } from "@/env/web";

const redis = new Redis({
	url: webEnv.UPSTASH_REDIS_REST_URL,
	token: webEnv.UPSTASH_REDIS_REST_TOKEN,
});

/** GET /api/emails?key=ADMIN_KEY returns every signup as CSV. */
export async function GET(request: NextRequest) {
	const key = webEnv.ADMIN_KEY;
	if (!key || request.nextUrl.searchParams.get("key") !== key) {
		return new NextResponse("Unauthorized", { status: 401 });
	}
	const all = ((await redis.hgetall<Record<string, string>>("reelcut:emails")) ?? {}) as Record<string, string>;
	const rows = Object.entries(all).sort((a, b) => String(a[1]).localeCompare(String(b[1])));
	const csv =
		"email,signed_up_at\n" +
		rows.map(([email, at]) => `"${email.replace(/"/g, '""')}",${at}`).join("\n");
	return new NextResponse(csv, {
		headers: {
			"Content-Type": "text/csv; charset=utf-8",
			"Content-Disposition": 'attachment; filename="reelcut-emails.csv"',
			"Cache-Control": "no-store",
		},
	});
}
