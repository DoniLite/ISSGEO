import type { Context, Next } from 'hono';
import { jwt } from 'hono/jwt';

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
