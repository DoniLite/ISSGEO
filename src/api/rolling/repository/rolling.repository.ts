import {
	RollingTable,
	type ModuleTableType,
	type RollingTableType,
} from "@/db";
import { BaseRepository } from "@/core/base.repository";
import { Repository } from "@/core/decorators";
import type { CreateRollingDTO, UpdateRollingDTO } from "../DTO/rolling.dto";
import { RollingToModuleRepository } from "./rollingToModule.repository";
import { ModuleRepository } from "@/api/formations/repository/modules.repository";
import type { PaginationQuery } from "@/lib/interfaces/pagination";
import { CoursesRepository } from "@/api/formations";

@Repository("rolling")
export class RollingRepository extends BaseRepository<
	RollingTableType,
	CreateRollingDTO,
	UpdateRollingDTO,
	typeof RollingTable,
	RollingTableType & { modules?: ModuleTableType[] }
> {
	protected table = RollingTable;

	constructor(
		private RollingToModuleRepo = new RollingToModuleRepository(),
		private ModuleRepo = new ModuleRepository(),
		private CourseRepo = new CoursesRepository(),
	) {
		super();
	}

	async createWithModuleIds(
		dto: CreateRollingDTO,
		moduleIds: string[],
	): Promise<RollingTableType & { modules?: ModuleTableType[] }> {
		const newRolling = await this.create(dto);
		const modules: ModuleTableType[] = [];

		for (const id of moduleIds) {
			await this.RollingToModuleRepo.create({
				moduleId: id,
				rollingId: newRolling.id as string,
			});
			const targetModule = await this.ModuleRepo.findById(id);
			if (targetModule) {
				modules.push(targetModule);
			}
		}

		const targetRollingForCourse = await this.findBy(
			"courseId",
			newRolling.courseId,
		);

		await this.CourseRepo.update(newRolling.courseId as string, {
			participants: targetRollingForCourse.length,
		});

		return {
			...newRolling,
			modules,
		};
	}

	protected override async populateChildrenForItems(
		items: RollingTableType[],
		_paginationQuery?: PaginationQuery,
	): Promise<(RollingTableType & { modules?: ModuleTableType[] })[]> {
		console.log("running populate");
		return Promise.all(
			items.map(async (item) => {
				const rollingToModules = await this.RollingToModuleRepo.findBy(
					"rollingId",
					item.id,
				);
				console.log("rolling to module", rollingToModules);
				const modules: ModuleTableType[] = [];
				for (const rollingToModule of rollingToModules) {
					const module = await this.ModuleRepo.findById(
						rollingToModule.moduleId as string,
					);
					if (module) {
						modules.push(module);
					}
				}
				console.log("modules", modules);
				return {
					...item,
					modules,
				};
			}),
		);
	}
}
