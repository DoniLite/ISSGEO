import { ServiceFactory } from '@/factory/service.factory';
import { webFactory } from '@/factory/web.factory';
import type { PaginationQuery } from '@/lib/interfaces/pagination';

const courseApp = webFactory.createApp();

courseApp.get('/', (c) => {
  const service = ServiceFactory.getCourseService();
  const query = c.req.query() as PaginationQuery;
  const rows = service.findPaginated(query);

  return c.json(rows);
});

courseApp.post('/', async (c) => {
  const service = ServiceFactory.getCourseService();
  const dto = await c.req.json();
  const data = await service.create(dto, c);
  if (!data) {
    return c.notFound();
  }
  return c.json(data);
});

courseApp.patch('/:id', async (c) => {
  const service = ServiceFactory.getCourseService();
  const id = c.req.param('id');
  const dto = await c.req.json();

  const res = await service.update(id, dto, c);
  if (!res) {
    return c.notFound();
  }

  return c.json({ updated: true, rows: res.length });
});

courseApp.delete('/:id', async (c) => {
  const service = ServiceFactory.getCourseService();
  const id = c.req.param('id');

  const res = await service.delete(id);

  if (!res) {
    return c.notFound();
  }

  return c.json({ deleted: res });
});

courseApp.get('/key-competency', async (c) => {
  const service = ServiceFactory.getCourseService();
  const query = c.req.query() as PaginationQuery;
  const rows = service.findPaginatedCompetency(query);

  return c.json(rows);
});

courseApp.post('/key-competency', async (c) => {
  const service = ServiceFactory.getCourseService();
  const dto = await c.req.json();
  const data = await service.createCompetency(dto, c);
  if (!data) {
    return c.notFound();
  }
  return c.json(data);
});

courseApp.patch('/key-competency/:id', async (c) => {
  const service = ServiceFactory.getCourseService();
  const id = c.req.param('id');
  const dto = await c.req.json();

  const res = await service.updateCompetency(id, dto, c);
  if (!res) {
    return c.notFound();
  }

  return c.json({ updated: true, rows: res.length });
});

courseApp.delete('/key-competency/:id', async (c) => {
  const service = ServiceFactory.getCourseService();
  const id = c.req.param('id');

  const res = await service.deleteCompetency(id);

  if (!res) {
    return c.notFound();
  }

  return c.json({ deleted: res });
});

export default courseApp;
