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
				rollingId: newRolling.id,
			});
			const targetModule = await this.ModuleRepo.findById(id);
			if (targetModule) {
				modules.push(targetModule);
			}
		}

		return {
			...newRolling,
			modules,
		};
	}

	protected override async populateChildrenForItems(
		items: {
			id: string;
			name: string;
			contact: string;
			country: string | null;
			profession: string | null;
			schoolLevel: string | null;
			experience: string | null;
			createdAt: Date | null;
			updatedAt: Date | null;
			deletedAt: Date | null;
			sessionId: string | null;
		}[],
		_paginationQuery?: PaginationQuery,
	): Promise<(RollingTableType & { modules?: ModuleTableType[] })[]> {
		return Promise.all(
			items.map(async (item) => {
				const rollingToModules = await this.RollingToModuleRepo.findBy(
					"rollingId",
					item.id,
				);
				const modules: ModuleTableType[] = [];
				for (const rollingToModule of rollingToModules) {
					const module = await this.ModuleRepo.findById(
						rollingToModule.moduleId as string,
					);
					if (module) {
						modules.push(module);
					}
				}
				return {
					...item,
					modules,
				};
			}),
		);
	}
}
