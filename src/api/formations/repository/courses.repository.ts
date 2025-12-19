import { BaseRepository } from "@/core/base.repository";
import {
	TrainingTable,
	type KeyCompetencyTableType,
	type ModuleTableType,
	type ThematicTableType,
	type TrainingTableType,
	type MasterTableType,
} from "@/db";
import { Repository } from "@/core/decorators";
import type { CreateCourseDTO, UpdateCourseDTO } from "../DTO/courses.dto";
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
import { MasterRepository } from "./master.repository";
import { TrainingToModuleRepository } from "./trainingToModule.repository";
import { TrainingToKeyCompetencyRepository } from "./trainingToKeyCompetency.repository";

@Repository("courses")
export class CoursesRepository extends BaseRepository<
	TrainingTableType,
	CreateCourseDTO,
	UpdateCourseDTO,
	typeof TrainingTable,
	TrainingTableType & {
		modules?: ModuleTableType[];
		competencies?: KeyCompetencyTableType[];
		thematic?: ThematicTableType;
		master?: MasterTableType;
	}
> {
	protected table = TrainingTable;
	protected override populateChildren = true;

	constructor(
		private keyCompetencyRepo = new KeyCompetencyRepository(),
		private ModuleRepo = new ModuleRepository(),
		private ThematicRepo = new ThematicRepository(),
		private MasterRepo = new MasterRepository(),
		private TrainingToModuleRepo = new TrainingToModuleRepository(),
		private TrainingToKeyCompRepo = new TrainingToKeyCompetencyRepository(),
	) {
		super();
	}

	async createWithRelations(
		dto: CreateCourseDTO,
		moduleIds?: string[],
		competencyIds?: string[],
	): Promise<
		TrainingTableType & {
			modules?: ModuleTableType[];
			competencies?: KeyCompetencyTableType[];
		}
	> {
		const newCourse = await this.create(dto);
		const modules: ModuleTableType[] = [];
		const competencies: KeyCompetencyTableType[] = [];

		if (moduleIds) {
			for (const id of moduleIds) {
				await this.TrainingToModuleRepo.create({
					moduleId: id,
					trainingId: newCourse.id as string,
				});
				const targetModule = await this.ModuleRepo.findById(id);
				if (targetModule) {
					modules.push(targetModule);
				}
			}
		}

		if (competencyIds) {
			for (const id of competencyIds) {
				await this.TrainingToKeyCompRepo.create({
					competencyId: id,
					trainingId: newCourse.id as string,
				});
				const targetComp = await this.keyCompetencyRepo.findById(id);
				if (targetComp) {
					competencies.push(targetComp);
				}
			}
		}

		return {
			...newCourse,
			modules,
			competencies,
		};
	}

	async updateCourseCompetencies(
		id: string,
		competencyIds: string[],
	): Promise<
		TrainingTableType & {
			competencies?: KeyCompetencyTableType[];
		}
	> {
		const course = await this.findById(id);
		if (!course) throw new Error("Course not found");

		const competencies: KeyCompetencyTableType[] = [];

		if (competencyIds.length > 0) {
			// Clear existing
			const existingLinks = await this.TrainingToKeyCompRepo.findBy(
				"trainingId",
				id,
			);
			for (const link of existingLinks) {
				await this.TrainingToKeyCompRepo.delete(link.id as string);
			}

			for (const competencyId of competencyIds) {
				await this.TrainingToKeyCompRepo.create({
					competencyId,
					trainingId: id,
				});
			}
		}

		for (const competencyId of competencyIds) {
			const targetComp = await this.keyCompetencyRepo.findById(competencyId);
			if (targetComp) {
				competencies.push(targetComp);
			}
		}

		return {
			...course,
			competencies: competencyIds ? competencies : undefined,
		};
	}

	async updateCourseModules(
		id: string,
		moduleIds: string[],
	): Promise<
		TrainingTableType & {
			modules?: ModuleTableType[];
		}
	> {
		const course = await this.findById(id);
		if (!course) throw new Error("Course not found");

		const modules: ModuleTableType[] = [];

		if (moduleIds.length > 0) {
			// Clear existing
			const existingLinks = await this.TrainingToModuleRepo.findBy(
				"trainingId",
				id,
			);
			for (const link of existingLinks) {
				await this.TrainingToModuleRepo.delete(link.id as string);
			}

			for (const moduleId of moduleIds) {
				await this.TrainingToModuleRepo.create({
					moduleId,
					trainingId: id,
				});
			}
		}

		for (const moduleId of moduleIds) {
			const targetModule = await this.ModuleRepo.findById(moduleId);
			if (targetModule) {
				modules.push(targetModule);
			}
		}

		return {
			...course,
			modules: moduleIds ? modules : undefined,
		};
	}

	protected override async populateChildrenForItems(
		items: TrainingTableType[],
		_paginationQuery?: PaginationQuery,
	): Promise<
		(TrainingTableType & {
			modules: ModuleTableType[];
			competencies: KeyCompetencyTableType[];
			master?: MasterTableType;
			thematic?: ThematicTableType;
		})[]
	> {
		return Promise.all(
			items.map(async (item) => {
				const id = item.id as string;

				// Fetch modules via junction repository
				const moduleLinks = await this.TrainingToModuleRepo.findBy(
					"trainingId",
					id,
				);
				const modules: ModuleTableType[] = [];
				for (const link of moduleLinks) {
					const m = await this.ModuleRepo.findById(link.moduleId as string);
					if (m) modules.push(m);
				}

				// Fetch competencies via junction repository
				const compLinks = await this.TrainingToKeyCompRepo.findBy(
					"trainingId",
					id,
				);
				const competencies: KeyCompetencyTableType[] = [];
				for (const link of compLinks) {
					const c = await this.keyCompetencyRepo.findById(
						link.competencyId as string,
					);
					if (c) competencies.push(c);
				}

				const thematic = item.thematicId
					? await this.ThematicRepo.findById(item.thematicId)
					: null;
				const master = item.masterId
					? await this.MasterRepo.findById(item.masterId)
					: null;

				console.log('populated items', {
					...item,
					modules,
					competencies,
					thematic: thematic || undefined,
					master: master || undefined,
				})

				return {
					...item,
					modules,
					competencies,
					thematic: thematic || undefined,
					master: master || undefined,
				};
			}),
		);
	}

	// Re-delegating existing methods to handle many-to-many logically
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

	async findCompetency(id: string): Promise<KeyCompetencyTableType | null> {
		return this.keyCompetencyRepo.findById(id);
	}

	async findModule(id: string): Promise<ModuleTableType | null> {
		return this.ModuleRepo.findById(id);
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
		filters?: Partial<KeyCompetencyTableType> & {
			courseId?: string;
			moduleId?: string;
		},
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
		filters?: Partial<ModuleTableType> & { courseId?: string },
	): Promise<ModuleTableType[]> {
		return this.ModuleRepo.findAll(filters);
	}
}
