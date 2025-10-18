import 'reflect-metadata';
import 'dotenv/config';
import { Hono } from 'hono';
import { render } from './entry-server';
import { serveStatic } from 'hono/bun';
// import { compress } from 'hono/compress';
import { logger } from 'hono/logger';
import { HTTPException } from 'hono/http-exception';
import api from './api/index.controller';
import { ServiceFactory } from './factory/service.factory';
import { authServerMiddleware } from './api/middlewares/auth.middleware';

const app = new Hono();

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    console.error(error.cause);
    return error.getResponse();
  }

  console.log(error);
  return c.redirect('/error', 301);
});

app.notFound((c) => {
  return c.json({ message: `the ${c.req.path} path doesn't exist` }, 404);
});

app.use(logger());
app.use('/admin/*', authServerMiddleware);
app.use('/static/*', serveStatic({ root: './' }));
// if (process.env.NODE_ENV === 'production') {
//   app.use(compress());
// }

app.route('/api', api);

app.get('/me', async (c) => {
  console.log('called');
  const service = ServiceFactory.getUserService();
  const res = await service.getMe(c);

  return c.json(res);
});

// console.log(app.routes)

app.get('*', async (c) => {
  return render({ request: c.req.raw });
});

export default app;
