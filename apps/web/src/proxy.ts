import { type NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, verifyAccess } from "@/access/token";

// Gate the editor behind the email form. Everything else stays public.
export async function proxy(request: NextRequest) {
	const secret = process.env.ACCESS_SECRET;
	if (!secret) return NextResponse.next(); // no secret configured: gate is off

	const email = await verifyAccess(request.cookies.get(ACCESS_COOKIE)?.value, secret);
	if (email) return NextResponse.next();

	const url = request.nextUrl.clone();
	url.pathname = "/";
	url.search = "";
	url.hash = "access";
	return NextResponse.redirect(url);
}

export const config = {
	matcher: ["/projects", "/projects/:path*", "/editor/:path*"],
};
