import { describe, expect, test } from "bun:test";
import { normalizeEmail, signAccess, verifyAccess } from "./token";

const SECRET = "test-secret-at-least-16-chars";

describe("access token", () => {
	test("round-trips an email", async () => {
		const token = await signAccess("you@mail.com", SECRET);
		expect(await verifyAccess(token, SECRET)).toBe("you@mail.com");
	});

	test("rejects a token signed with another secret", async () => {
		const token = await signAccess("you@mail.com", "another-secret-0123456789");
		expect(await verifyAccess(token, SECRET)).toBeNull();
	});

	test("rejects a tampered email", async () => {
		const token = await signAccess("you@mail.com", SECRET);
		const [, mac] = token.split(".");
		const forged = `${btoa("admin@mail.com").replace(/=+$/, "")}.${mac}`;
		expect(await verifyAccess(forged, SECRET)).toBeNull();
	});

	test("rejects empty and malformed tokens", async () => {
		for (const t of [undefined, null, "", "abc", ".", "abc.", ".abc", "1"]) {
			expect(await verifyAccess(t as string, SECRET)).toBeNull();
		}
	});
});

describe("normalizeEmail", () => {
	test("trims and lowercases", () => {
		expect(normalizeEmail("  You@Mail.COM ")).toBe("you@mail.com");
	});
	test("rejects invalid input", () => {
		for (const v of ["", "bad", "a@b", "a@b.c", "@mail.com", "a b@mail.com", null, undefined, 42]) {
			expect(normalizeEmail(v)).toBeNull();
		}
	});
	test("rejects addresses over 254 characters", () => {
		expect(normalizeEmail(`${"a".repeat(250)}@mail.com`)).toBeNull();
	});
});
