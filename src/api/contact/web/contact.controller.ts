import { ServiceFactory } from '@/factory/service.factory';
import { webFactory } from '@/factory/web.factory';
import type { PaginationQuery } from '@/lib/interfaces/pagination';

const contactApp = webFactory.createApp();

contactApp.get('/', (c) => {
  const service = ServiceFactory.getContactService();
  const query = c.req.query() as PaginationQuery;
  const rows = service.findPaginated(query);

  return c.json(rows);
});

contactApp.post('/', async (c) => {
  const service = ServiceFactory.getContactService();
  const dto = await c.req.json();
  const data = await service.create(dto, c);
  if (!data) {
    return c.notFound();
  }
  return c.json(data);
});

contactApp.delete('/:id', async (c) => {
  const service = ServiceFactory.getContactService();
  const id = c.req.param('id');

  const res = await service.delete(id);

  if (!res) {
    return c.notFound();
  }

  return c.json({ deleted: res });
});

export default contactApp;
