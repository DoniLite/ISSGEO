import buildQuery from "@/api/helpers/buildQuery";
import {
	adminMiddleware,
	authMiddleware,
} from "@/api/middlewares/auth.middleware";
import { BaseController } from "@/core/base.controller";
import type { KeyCompetencyTableType, TrainingTableType } from "@/db";
import { ServiceFactory } from "@/factory/service.factory";
import { webFactory } from "@/factory/web.factory";
import type { CreateCourseDTO, UpdateCourseDTO } from "../DTO/courses.dto";
import type { CourseService } from "../services/courses.service";

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
		this.app.get("/key-competency", async (c) => {
			try {
				const query = buildQuery(c.req.query());
				const rows = await this.service.findPaginatedCompetency(query);
				return c.json(rows);
			} catch (error) {
				return this.handleError(c, error);
			}
		});

		this.app.post("/key-competency", async (c) => {
			try {
				const dto = await c.req.json();
				const data = await this.service.createCompetency(dto, c);
				if (!data) {
					return c.notFound();
				}
				return c.json(data);
			} catch (error) {
				return this.handleError(c, error);
			}
		});

		this.app.delete("/key-competency", async (c) => {
			try {
				let ids: (string | number)[] = [];

				// Try to get IDs from query params first
				const queryIds = c.req.query("ids");
				if (queryIds) {
					ids = queryIds.split(",").map((id) => id.trim());
				} else {
					// Try to get IDs from body
					const body = await c.req.json();
					ids = body.ids || [];
				}

				if (ids.length === 0) {
					return c.json(
						{
							error: "No IDs provided",
							message:
								"Please provide IDs via query params (?ids=1,2,3) or body ({ ids: [1,2,3] })",
						},
						400,
					);
				}

				const result = await this.service.deleteManyCompetency(ids);

				return c.json({
					deleted: result.success,
					deletedCount: result.deletedCount,
					requestedCount: result.requestedCount,
					message: result.success
						? `Successfully deleted ${result.deletedCount} entities`
						: `Deleted ${result.deletedCount} out of ${result.requestedCount} entities`,
				});
			} catch (error) {
				return this.handleError(c, error);
			}
		});

		this.app.get("/key-competency/all", async (c) => {
			try {
				const query = c.req.query();
				const result = await this.service.findAllCompetency(
					query as Partial<KeyCompetencyTableType>,
				);
				return c.json(result);
			} catch (error) {
				return this.handleError(c, error);
			}
		});

		this.app.patch("/key-competency/:id", async (c) => {
			try {
				const id = c.req.param("id");
				const dto = await c.req.json();
				const res = await this.service.updateCompetency(id, dto, c);
				if (!res) {
					return c.notFound();
				}
				return c.json({ updated: true, rows: res.length });
			} catch (error) {
				return this.handleError(c, error);
			}
		});

		this.app.delete("/key-competency/:id", async (c) => {
			try {
				const id = c.req.param("id");
				const res = await this.service.deleteCompetency(id);
				if (!res) {
					return c.notFound();
				}
				return c.json({ deleted: res });
			} catch (error) {
				return this.handleError(c, error);
			}
		});

		this.app.get("/module", async (c) => {
			try {
				const query = buildQuery(c.req.query());
				const rows = await this.service.findPaginatedModule(query);
				return c.json(rows);
			} catch (error) {
				return this.handleError(c, error);
			}
		});

		this.app.post("/module", async (c) => {
			try {
				const dto = await c.req.json();
				const data = await this.service.createModule(dto, c);
				if (!data) {
					return c.notFound();
				}
				return c.json(data);
			} catch (error) {
				return this.handleError(c, error);
			}
		});

		this.app.delete("/module", async (c) => {
			try {
				let ids: (string | number)[] = [];

				// Try to get IDs from query params first
				const queryIds = c.req.query("ids");
				if (queryIds) {
					ids = queryIds.split(",").map((id) => id.trim());
				} else {
					// Try to get IDs from body
					const body = await c.req.json();
					ids = body.ids || [];
				}

				if (ids.length === 0) {
					return c.json(
						{
							error: "No IDs provided",
							message:
								"Please provide IDs via query params (?ids=1,2,3) or body ({ ids: [1,2,3] })",
						},
						400,
					);
				}

				const result = await this.service.deleteManyModule(ids);

				return c.json({
					deleted: result.success,
					deletedCount: result.deletedCount,
					requestedCount: result.requestedCount,
					message: result.success
						? `Successfully deleted ${result.deletedCount} entities`
						: `Deleted ${result.deletedCount} out of ${result.requestedCount} entities`,
				});
			} catch (error) {
				return this.handleError(c, error);
			}
		});

		this.app.get("/module/all", async (c) => {
			try {
				const query = c.req.query();
				const result = await this.service.findAllModule(
					query as Partial<KeyCompetencyTableType>,
				);
				return c.json(result);
			} catch (error) {
				return this.handleError(c, error);
			}
		});

		this.app.patch("/module/:id", async (c) => {
			try {
				const id = c.req.param("id");
				const dto = await c.req.json();
				const res = await this.service.updateModule(id, dto, c);
				if (!res) {
					return c.notFound();
				}
				return c.json({ updated: true, rows: res.length });
			} catch (error) {
				return this.handleError(c, error);
			}
		});

		this.app.delete("/module/:id", async (c) => {
			try {
				const id = c.req.param("id");
				const res = await this.service.deleteModule(id);
				if (!res) {
					return c.notFound();
				}
				return c.json({ deleted: res });
			} catch (error) {
				return this.handleError(c, error);
			}
		});
	}
}
