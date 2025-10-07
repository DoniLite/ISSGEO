import 'reflect-metadata';
import { Hono } from 'hono';
import { render } from './entry-server';
import { serveStatic } from 'hono/bun';
import { compress } from 'hono/compress';

const app = new Hono();

app.use('/static/*', serveStatic({ root: './' }));
if (process.env.NODE_ENV === 'production') {
  app.use(compress());
}

export const routes = app.get('*', async (c) => {
  return render({ request: c.req.raw });
});

export default app;
