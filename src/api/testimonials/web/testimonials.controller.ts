import { BaseController } from "@/core/base.controller";
import type { TestimonialsTableType } from "@/db";
import { ServiceFactory } from "@/factory/service.factory";
import { webFactory } from "@/factory/web.factory";
import {
	authMiddleware,
	adminMiddleware,
} from "@/api/middlewares/auth.middleware";
import type {
	CreateTestimonialDTO,
	UpdateTestimonialDTO,
} from "../DTO/testimonials.dto";
import type { TestimonialsService } from "../service/testimonials.service";

export class TestimonialsController extends BaseController<
	TestimonialsTableType,
	CreateTestimonialDTO,
	UpdateTestimonialDTO,
	TestimonialsService
> {
	constructor() {
		const service = ServiceFactory.getTestimonialService();
		const app = webFactory.createApp();

		super(service, app, {
			middlewares: {
				get: [],

				delete: [authMiddleware, adminMiddleware],

				stats: [authMiddleware, adminMiddleware],
			},
		});
	}
}

const testimonialsController = new TestimonialsController();
const app = testimonialsController.getApp();

export default app;
