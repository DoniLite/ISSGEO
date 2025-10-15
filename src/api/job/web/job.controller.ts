import buildQuery from '@/api/helpers/buildQuery';
import { ServiceFactory } from '@/factory/service.factory';
import { webFactory } from '@/factory/web.factory';

const jobApp = webFactory.createApp();

jobApp.get('/', async (c) => {
  const service = ServiceFactory.getJobService();
  const query = buildQuery(c.req.query());
  const rows = await service.findPaginated(query);

  return c.json(rows);
});

jobApp.post('/', async (c) => {
  const service = ServiceFactory.getJobService();
  const dto = await c.req.json();
  const data = await service.create(dto, c);
  if (!data) {
    return c.notFound();
  }
  return c.json(data);
});

jobApp.patch('/:id', async (c) => {
  const service = ServiceFactory.getJobService();
  const id = c.req.param('id');
  const dto = await c.req.json();

  console.log('patch id ===>', id);
  console.log('patch dto ===>', dto);

  const res = await service.update(id, dto, c);
  console.log('patch res ===>', res)
  if (!res) {
    return c.notFound();
  }

  return c.json({ updated: true, rows: res.length });
});

jobApp.delete('/:id', async (c) => {
  const service = ServiceFactory.getJobService();
  const id = c.req.param('id');

  const res = await service.delete(id);

  if (!res) {
    return c.notFound();
  }

  return c.json({ deleted: res });
});

export default jobApp;
