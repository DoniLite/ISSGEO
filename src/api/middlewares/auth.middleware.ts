import type { Context, Next } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { jwt, sign, verify } from "hono/jwt";

export const authMiddleware = jwt({
	secret: process.env.JWT_SECRET || "",
	cookie: "session",
});
export const adminMiddleware = async (c: Context, next: Next) => {
	const payload = c.get("jwtPayload");
	const roles = ["admin", "maintainer"];
	if (!roles.includes(payload.role)) {
		return c.json({ error: "Admin access required" }, 403);
	}
	await next();
};

export const authServerMiddleware = async (c: Context, next: Next) => {
	if (c.req.path === "/admin/login") {
		await next();
	}
	const sessionCookie = getCookie(c, "session");
	if (!sessionCookie) {
		return c.redirect("/admin/login", 301);
	}

	const secret = process.env.JWT_SECRET;

	if (!secret) {
		throw new HTTPException(500, {
			message: "some data are missing for this operation \n => JWT_SECRET",
		});
	}

	try {
		const payload = await verify(sessionCookie, secret);
		const expireDate = new Date();
		expireDate.setHours(expireDate.getHours() + 5);

		const newPayload = {
			userId: payload.id,
			role: payload.role,
			exp: expireDate.getTime(),
		};

		const token = await sign(newPayload, secret);

		setCookie(c, "session", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Lax",
			path: "/",
			maxAge: 60 * 60 * 5,
		});

		await next();
	} catch (e) {
		console.log("jwt error ===>", e);
		return c.redirect("/admin/login", 301);
	}
};
