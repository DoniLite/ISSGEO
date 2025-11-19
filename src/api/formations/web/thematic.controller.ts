import type { ThematicTableType } from "@/db";
import { ServiceFactory } from "@/factory/service.factory";
import { webFactory } from "@/factory/web.factory";
import type { CreateThematicDTO, UpdateThematicDTO } from "../DTO/thematic.dto";
import type { ThematicService } from "../services/thematic.service";
import { BaseController } from "@/core/base.controller";
import {
	adminMiddleware,
	authMiddleware,
} from "@/api/middlewares/auth.middleware";

export class ThematicController extends BaseController<
	ThematicTableType,
	CreateThematicDTO,
	UpdateThematicDTO,
	ThematicService
> {
	constructor() {
		const service = ServiceFactory.getThematicService();
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
