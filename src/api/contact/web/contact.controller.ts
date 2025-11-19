import { BaseController } from "@/core/base.controller";
import type { ContactTableType } from "@/db";
import { ServiceFactory } from "@/factory/service.factory";
import { webFactory } from "@/factory/web.factory";
import {
	authMiddleware,
	adminMiddleware,
} from "@/api/middlewares/auth.middleware";
import type { CreateContactDTO, UpdateContactDTO } from "../DTO/contact.dto";
import type { ContactService } from "../service/contact.service";

export class ContactsController extends BaseController<
	ContactTableType,
	CreateContactDTO,
	UpdateContactDTO,
	ContactService
> {
	constructor() {
		const service = ServiceFactory.getContactService();
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
