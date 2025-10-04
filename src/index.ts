import { Hono } from 'hono';
import { render } from './entry-server';
import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono();

app.use('/static/*', serveStatic({ root: './' }));

app.get('*', async (c) => {
  return render({ request: c.req.raw });
});

export default app;
