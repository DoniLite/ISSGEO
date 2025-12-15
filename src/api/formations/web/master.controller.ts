import { BaseController } from "@/core/base.controller";
import type { MasterTableType } from "@/db";
import type { CreateMasterDTO, UpdateMasterDTO } from "../DTO/master.dto";
import type { MasterService } from "../services/master.service";
import { ServiceFactory } from "@/factory/service.factory";
import { webFactory } from "@/factory/web.factory";
import { adminMiddleware, authMiddleware } from "@/api/middlewares/auth.middleware";

export class MasterController extends BaseController<
	MasterTableType,
	CreateMasterDTO,
	UpdateMasterDTO,
	MasterService
> {
	constructor() {
		const service = ServiceFactory.getMasterService();
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
