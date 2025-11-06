import { BaseController } from "@/core/base.controller";
import type { UserTableType } from "@/db";
import { ServiceFactory } from "@/factory/service.factory";
import { webFactory } from "@/factory/web.factory";
import type { CreateUserDto, UpdateUserDto } from "../DTO/user.dto";
import type { UserService } from "../services/user.service";
import {
	adminMiddleware,
	authMiddleware,
} from "@/api/middlewares/auth.middleware";
import type { Context } from "hono";
import buildQuery from "@/api/helpers/buildQuery";

export class UserController extends BaseController<
	UserTableType,
	CreateUserDto,
	UpdateUserDto,
	UserService
> {
	constructor() {
		const service = ServiceFactory.getUserService();
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

	protected override async list(c: Context) {
		try {
			const query = buildQuery(c.req.query());
			const result = await this.service.findPaginated(query);
			return c.json({
				...result,
				items: result.items
					.filter((u) => u.role !== "admin")
					.map((u) => ({
						...u,
						password: "",
					})),
			});
		} catch (error) {
			return this.handleError(c, error);
		}
	}

	protected override registerCustomRoutes(): void {
		this.app.post("/login", async (c) => {
			const dto = await c.req.json();

			const res = await this.service.login(dto, c);

			if (!res) {
				return c.notFound();
			}

			return c.json(res);
		});

		this.app.get("/logout", async (c) => {
			return c.json(this.service.logout(c));
		});

		this.app.post("/password", ...[authMiddleware], async (c) => {
			const dto = await c.req.json();

			const res = await this.service.updatePassword(dto, c);

			if (!res) {
				return c.notFound();
			}

			return c.json(res);
		});

		this.app.get("/me", async (c) => {
			const res = await this.service.getMe(c);

			return c.json(res);
		});
	}
}

const userController = new UserController();
const app = userController.getApp();

export default app;
