// Signed access token for the email gate: base64url(email) + "." + HMAC-SHA256.
// Uses Web Crypto so the same code runs in route handlers and in the proxy.

export const ACCESS_COOKIE = "reeltab_access";
export const ACCESS_MAX_AGE = 60 * 60 * 24 * 365;

const enc = new TextEncoder();

function toB64url(bytes: Uint8Array): string {
	let bin = "";
	for (const b of bytes) bin += String.fromCharCode(b);
	return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string): Uint8Array {
	const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
	const bin = atob(b64);
	return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function hmac(secret: string, data: string): Promise<Uint8Array> {
	const key = await crypto.subtle.importKey(
		"raw",
		enc.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	return new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

export async function signAccess(email: string, secret: string): Promise<string> {
	const id = toB64url(enc.encode(email));
	const mac = toB64url(await hmac(secret, id));
	return `${id}.${mac}`;
}

/** Returns the email when the token is valid, otherwise null. */
export async function verifyAccess(
	token: string | undefined | null,
	secret: string,
): Promise<string | null> {
	if (!token) return null;
	const dot = token.indexOf(".");
	if (dot <= 0 || dot === token.length - 1) return null;
	const id = token.slice(0, dot);
	const given = token.slice(dot + 1);
	let expected: string;
	try {
		expected = toB64url(await hmac(secret, id));
	} catch {
		return null;
	}
	if (expected.length !== given.length) return null;
	let diff = 0;
	for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ given.charCodeAt(i);
	if (diff !== 0) return null;
	try {
		return new TextDecoder().decode(fromB64url(id));
	} catch {
		return null;
	}
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(raw: unknown): string | null {
	const email = String(raw ?? "").trim().toLowerCase();
	if (email.length > 254 || !EMAIL_RE.test(email)) return null;
	return email;
}
