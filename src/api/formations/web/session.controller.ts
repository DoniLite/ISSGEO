import { BaseController } from '@/core/base.controller';
import type { TrainingSessionTableType } from '@/db';
import { ServiceFactory } from '@/factory/service.factory';
import { webFactory } from '@/factory/web.factory';
import type { CreateSessionDTO, UpdateSessionDTO } from '../DTO/session.dto';
import type { SessionService } from '../services/session.service';
import {
  authMiddleware,
  adminMiddleware,
} from '@/api/middlewares/auth.middleware';

export class SessionController extends BaseController<
  TrainingSessionTableType,
  CreateSessionDTO,
  UpdateSessionDTO,
  SessionService
> {
  constructor() {
    const service = ServiceFactory.getSessionService();
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

const sessionController = new SessionController()
const app = sessionController.getApp()

export default app;
