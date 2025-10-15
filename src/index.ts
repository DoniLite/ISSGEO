import 'reflect-metadata';
import 'dotenv/config';
import { Hono } from 'hono';
import { render } from './entry-server';
import { serveStatic } from 'hono/bun';
import { compress } from 'hono/compress';
import { HTTPException } from 'hono/http-exception';
import api from './api/index.controller';

const app = new Hono();

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    console.error(error.cause);
    return error.getResponse();
  }

  return c.redirect('/error');
});

app.use('/static/*', serveStatic({ root: './' }));
if (process.env.NODE_ENV === 'production') {
  app.use(compress());
}

app.route('/api', api);

app.get('*', async (c) => {
  return render({ request: c.req.raw });
});

export default app;
