import { ServiceFactory } from '@/factory/service.factory';
import { webFactory } from '@/factory/web.factory';
import type { PaginationQuery } from '@/lib/interfaces/pagination';

const thematicApp = webFactory.createApp();

thematicApp.get('/', (c) => {
  const service = ServiceFactory.getThematicService();
  const query = c.req.query() as PaginationQuery;
  const rows = service.findPaginated(query);

  return c.json(rows);
});

thematicApp.post('/', async (c) => {
  const service = ServiceFactory.getThematicService();
  const dto = await c.req.json();
  const data = await service.create(dto, c);
  if (!data) {
    return c.notFound();
  }
  return c.json(data);
});

thematicApp.patch('/:id', async (c) => {
  const service = ServiceFactory.getThematicService();
  const id = c.req.param('id');
  const dto = await c.req.json();

  const res = await service.update(id, dto, c);
  if (!res) {
    return c.notFound();
  }

  return c.json({ updated: true, rows: res.length });
});

thematicApp.delete('/:id', async (c) => {
  const service = ServiceFactory.getThematicService();
  const id = c.req.param('id');

  const res = await service.delete(id);

  if (!res) {
    return c.notFound();
  }

  return c.json({ deleted: res });
});

export default thematicApp;
