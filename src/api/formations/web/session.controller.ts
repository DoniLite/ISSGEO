import { ServiceFactory } from '@/factory/service.factory';
import { webFactory } from '@/factory/web.factory';
import type { PaginationQuery } from '@/lib/interfaces/pagination';

const sessionApp = webFactory.createApp();

sessionApp.get('/', async (c) => {
  const service = ServiceFactory.getSessionService();
  const query = c.req.query() as PaginationQuery;
  const rows = await service.findPaginated(query);

  return c.json(rows);
});

sessionApp.post('/', async (c) => {
  const service = ServiceFactory.getSessionService();
  const dto = await c.req.json();
  const data = await service.create(dto, c);
  if (!data) {
    return c.notFound();
  }
  return c.json(data);
});

sessionApp.patch('/:id', async (c) => {
  const service = ServiceFactory.getSessionService();
  const id = c.req.param('id');
  const dto = await c.req.json();

  const res = await service.update(id, dto, c);
  if (!res) {
    return c.notFound();
  }

  return c.json({ updated: true, rows: res.length });
});

sessionApp.delete('/:id', async (c) => {
  const service = ServiceFactory.getSessionService();
  const id = c.req.param('id');

  const res = await service.delete(id);

  if (!res) {
    return c.notFound();
  }

  return c.json({ deleted: res });
});

export default sessionApp;
