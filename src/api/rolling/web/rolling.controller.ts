import { BaseController } from "@/core/base.controller";
import type { RollingTableType } from "@/db";
import { ServiceFactory } from "@/factory/service.factory";
import { webFactory } from "@/factory/web.factory";
import {
	authMiddleware,
	adminMiddleware,
} from "@/api/middlewares/auth.middleware";
import type { CreateRollingDTO, UpdateRollingDTO } from "../DTO/rolling.dto";
import type { RollingService } from "../services/rolling.service";

export class RollingController extends BaseController<
	RollingTableType,
	CreateRollingDTO,
	UpdateRollingDTO,
	RollingService
> {
	constructor() {
		const service = ServiceFactory.getRollingService();
		const app = webFactory.createApp();

		super(service, app, {
			excludeRoutes: ["stats"],
			middlewares: {
				get: [authMiddleware],

				post: [],
				patch: [],
				delete: [authMiddleware, adminMiddleware],
			},
		});
	}
}

const rollingController = new RollingController();
const app = rollingController.getApp();

export default app;
