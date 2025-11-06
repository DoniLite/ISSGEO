import { BaseController } from "@/core/base.controller";
import type { CheckoutTableType } from "@/db";
import { ServiceFactory } from "@/factory/service.factory";
import { webFactory } from "@/factory/web.factory";
import {
	authMiddleware,
	adminMiddleware,
} from "@/api/middlewares/auth.middleware";
import type { CheckoutService } from "../services/checkout.service";
import type { CreateCheckoutDTO, UpdateCheckoutDTO } from "../DTO/checkout.dto";

export class CheckoutController extends BaseController<
	CheckoutTableType,
	CreateCheckoutDTO,
	UpdateCheckoutDTO,
	CheckoutService
> {
	constructor() {
		const service = ServiceFactory.getCheckoutService();
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

const checkoutController = new CheckoutController();
const app = checkoutController.getApp();

export default app;
