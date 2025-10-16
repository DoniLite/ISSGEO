import buildQuery from '@/api/helpers/buildQuery';
import {
  adminMiddleware,
  authMiddleware,
} from '@/api/middlewares/auth.middleware';
import { BaseController } from '@/core/base.controller';
import type { TrainingTableType } from '@/db';
import { ServiceFactory } from '@/factory/service.factory';
import { webFactory } from '@/factory/web.factory';
import type { CreateCourseDTO, UpdateCourseDTO } from '../DTO/courses.dto';
import type { CourseService } from '../services/courses.service';

export class CourseController extends BaseController<
  TrainingTableType,
  CreateCourseDTO,
  UpdateCourseDTO,
  CourseService
> {
  constructor() {
    const service = ServiceFactory.getCourseService();
    const app = webFactory.createApp();

    super(service, app, {
      middlewares: {
        get: [],

        post: [authMiddleware],
        patch: [authMiddleware],
        delete: [authMiddleware, adminMiddleware],

        stats: [authMiddleware, adminMiddleware],
      },
    });
  }

  protected override registerCustomRoutes(): void {
    this.app.get('/key-competency', async (c) => {
      const query = buildQuery(c.req.query());
      const rows = await this.service.findPaginatedCompetency(query);
      return c.json(rows);
    });

    this.app.post('/key-competency', async (c) => {
      const dto = await c.req.json();
      const data = await this.service.createCompetency(dto, c);
      if (!data) {
        return c.notFound();
      }
      return c.json(data);
    });

    this.app.patch('/key-competency/:id', async (c) => {
      const id = c.req.param('id');
      const dto = await c.req.json();
      const res = await this.service.updateCompetency(id, dto, c);
      if (!res) {
        return c.notFound();
      }
      return c.json({ updated: true, rows: res.length });
    });

    this.app.delete('/key-competency/:id', async (c) => {
      const id = c.req.param('id');
      const res = await this.service.deleteCompetency(id);
      if (!res) {
        return c.notFound();
      }
      return c.json({ deleted: res });
    });
  }
}

const courseController = new CourseController();
const app = courseController.getApp();
export default app;
