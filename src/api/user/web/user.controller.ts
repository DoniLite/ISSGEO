import { ServiceFactory } from '@/factory/service.factory';
import { webFactory } from '@/factory/web.factory';
import type { PaginationQuery } from '@/lib/interfaces/pagination';

const userApp = webFactory.createApp();

userApp.get('/', (c) => {
  const service = ServiceFactory.getUserService();
  const query = c.req.query() as PaginationQuery;
  const rows = service.findPaginated(query);

  return c.json(rows);
});

userApp.post('/', async (c) => {
  const service = ServiceFactory.getUserService();
  const dto = await c.req.json();
  const res = await service.create(dto, c);
  if (!res) {
    return c.notFound();
  }
  return c.json(res);
});

userApp.patch('/:id', async (c) => {
  const service = ServiceFactory.getUserService();
  const id = c.req.param('id');
  const dto = await c.req.json();

  const res = await service.update(id, dto, c);

  if (!res) {
    return c.notFound();
  }

  return c.json({ updated: true, rows: res.length });
});

userApp.post('/login', async (c) => {
  const service = ServiceFactory.getUserService();
  const dto = await c.req.json();

  const res = await service.login(dto, c);

  if (!res) {
    return c.notFound();
  }

  return c.json(res);
});

userApp.post('/password', async (c) => {
  const service = ServiceFactory.getUserService();
  const dto = await c.req.json();

  const res = service.updatePassword(dto, c);

  if (!res) {
    return c.notFound();
  }

  return c.json(res);
});

export default userApp;
