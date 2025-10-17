import {
  authMiddleware,
  adminMiddleware,
} from '@/api/middlewares/auth.middleware';
import { BaseController } from '@/core/base.controller';
import type { JobOfferTableType } from '@/db';
import { ServiceFactory } from '@/factory/service.factory';
import { webFactory } from '@/factory/web.factory';
import type { CreateJobDTO, UpdateJobDTO } from '../DTO/job.dto';
import type { JobService } from '../service/job.service';

export class JobController extends BaseController<
  JobOfferTableType,
  CreateJobDTO,
  UpdateJobDTO,
  JobService
> {
  constructor() {
    const service = ServiceFactory.getJobService();
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
}

const jobController = new JobController();

export default jobController.getApp();
