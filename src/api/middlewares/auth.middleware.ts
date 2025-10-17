import type { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { jwt, verify } from 'hono/jwt';

export const authMiddleware = jwt({
  secret: process.env.JWT_SECRET || '',
  cookie: 'session',
});
export const adminMiddleware = async (c: Context, next: Next) => {
  const payload = c.get('jwtPayload');
  if (payload.role !== 'admin') {
    return c.json({ error: 'Admin access required' }, 403);
  }
  await next();
};

export const authServerMiddleware = async (c: Context, next: Next) => {
  if (c.req.path === '/admin/login') {
    await next();
  }
  const sessionCookie = getCookie(c, 'session');
  if (!sessionCookie) {
    return c.redirect('/admin/login', 301);
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new HTTPException(500, {
      message: 'some data are missing for this operation \n => JWT_SECRET',
    });
  }

  try {
    await verify(sessionCookie, secret);
    await next();
  } catch (e) {
    console.log('jwt error ===>', e);
    return c.redirect('/admin/login', 301);
  }
};
