import { ServiceFactory } from '@/factory/service.factory';
import { webFactory } from '@/factory/web.factory';
import type { PaginationQuery } from '@/lib/interfaces/pagination';

const testimonialsApp = webFactory.createApp();

testimonialsApp.get('/', async (c) => {
  const service = ServiceFactory.getTestimonialService();
  const query = c.req.query() as PaginationQuery;
  const rows = await service.findPaginated(query);

  return c.json(rows);
});

testimonialsApp.post('/', async (c) => {
  const service = ServiceFactory.getTestimonialService();
  const dto = await c.req.json();
  const data = await service.create(dto, c);
  if (!data) {
    return c.notFound();
  }
  return c.json(data);
});

testimonialsApp.delete('/:id', async (c) => {
  const service = ServiceFactory.getTestimonialService();
  const id = c.req.param('id');

  const res = await service.delete(id);

  if (!res) {
    return c.notFound();
  }

  return c.json({ deleted: res });
});

export default testimonialsApp;
