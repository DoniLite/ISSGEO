import { BaseRepository } from "@/core/base.repository";
import {
	TrainingTable,
	type KeyCompetencyTableType,
	type ModuleTableType,
	type ThematicTableType,
	type TrainingTableType,
} from "@/db";
import type { CreateCourseDTO, UpdateCourseDTO } from "../DTO/courses.dto";
import { Repository } from "@/core/decorators";
import { KeyCompetencyRepository } from "./keyCompetency.repository";
import type {
	CreateKeyCompetencyDTO,
	UpdateKeyCompetencyDTO,
} from "../DTO/keyCompetency.dto";
import type {
	PaginatedResponse,
	PaginationQuery,
} from "@/lib/interfaces/pagination";
import { ModuleRepository } from "./modules.repository";
import type { CreateModuleTDO, UpdateModuleDTO } from "../DTO/modules.dto";
import { ThematicRepository } from "./thematic.repository";

@Repository("courses")
export class CoursesRepository extends BaseRepository<
	TrainingTableType,
	CreateCourseDTO,
	UpdateCourseDTO,
	typeof TrainingTable,
	TrainingTableType & {
		modules: ModuleTableType[];
		competencies: KeyCompetencyTableType[];
		thematic?: ThematicTableType;
	}
> {
	protected table = TrainingTable;

	constructor(
		private keyCompetencyRepo = new KeyCompetencyRepository(),
		private ModuleRepo = new ModuleRepository(),
		private ThematicRepo = new ThematicRepository(),
	) {
		super();
	}

	protected override async populateChildrenForItems(
		items: TrainingTableType[],
		_paginationQuery?: PaginationQuery,
	): Promise<
		(TrainingTableType & {
			modules: ModuleTableType[];
			competencies: KeyCompetencyTableType[];
		})[]
	> {
		return Promise.all(
			items.map(async (item) => {
				const modules = await this.ModuleRepo.findBy("courseId", item.id);
				const competencies = await this.keyCompetencyRepo.findBy(
					"moduleId",
					item.id,
				);
				const thematic = await this.ThematicRepo.findOneBy(
					"id",
					item.thematicId,
				);
				return {
					...item,
					modules,
					competencies,
					thematic,
				};
			}),
		);
	}

	async createCompetency(
		dto: CreateKeyCompetencyDTO,
	): Promise<KeyCompetencyTableType> {
		return this.keyCompetencyRepo.create(dto);
	}

	async updateCompetency(
		id: string,
		dto: UpdateKeyCompetencyDTO,
	): Promise<KeyCompetencyTableType[] | null> {
		return this.keyCompetencyRepo.update(id, dto);
	}

	async deleteCompetency(id: string): Promise<boolean> {
		return this.keyCompetencyRepo.delete(id);
	}

	async deleManyCompetency(ids: (string | number)[]): Promise<number> {
		return this.keyCompetencyRepo.deleteMultiple(ids);
	}

	async findPaginatedCompetency(
		query: PaginationQuery,
	): Promise<PaginatedResponse<KeyCompetencyTableType>> {
		return this.keyCompetencyRepo.findPaginated(query);
	}

	async findAllCompetency(
		filters?: Partial<KeyCompetencyTableType>,
	): Promise<KeyCompetencyTableType[]> {
		return this.keyCompetencyRepo.findAll(filters);
	}

	async createModule(dto: CreateModuleTDO): Promise<ModuleTableType> {
		return this.ModuleRepo.create(dto);
	}

	async updateModule(
		id: string,
		dto: UpdateModuleDTO,
	): Promise<ModuleTableType[] | null> {
		return this.ModuleRepo.update(id, dto);
	}

	async deleteModule(id: string): Promise<boolean> {
		return this.ModuleRepo.delete(id);
	}

	async deleManyModule(ids: (string | number)[]): Promise<number> {
		return this.ModuleRepo.deleteMultiple(ids);
	}

	async findPaginatedModule(
		query: PaginationQuery,
	): Promise<PaginatedResponse<ModuleTableType>> {
		return this.ModuleRepo.findPaginated(query);
	}

	async findAllModule(
		filters?: Partial<ModuleTableType>,
	): Promise<ModuleTableType[]> {
		return this.ModuleRepo.findAll(filters);
	}
}
