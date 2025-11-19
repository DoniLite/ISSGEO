import { BaseService } from "@/core/base.service";
import type {
	KeyCompetencyTableType,
	ModuleTableType,
	ThematicTableType,
	TrainingTableType,
} from "@/db";
import { CreateCourseDTO, UpdateCourseDTO } from "../DTO/courses.dto";
import { CoursesRepository } from "../repository/courses.repository";
import type { Context } from "hono";
import { Service, ValidateDTO } from "@/core/decorators";
import {
	CreateKeyCompetencyDTO,
	UpdateKeyCompetencyDTO,
} from "../DTO/keyCompetency.dto";
import type {
	PaginatedResponse,
	PaginationQuery,
} from "@/lib/interfaces/pagination";
import { CreateModuleTDO, UpdateModuleDTO } from "../DTO/modules.dto";

@Service()
export class CourseService extends BaseService<
	TrainingTableType,
	CreateCourseDTO,
	UpdateCourseDTO,
	CoursesRepository,
	TrainingTableType & {
		modules: ModuleTableType[];
		competencies: KeyCompetencyTableType[];
		thematic: ThematicTableType;
	}
> {
	constructor() {
		super(new CoursesRepository());
	}

	@ValidateDTO(CreateCourseDTO)
	override async create(
		dto: CreateCourseDTO,
		_context: Context,
	): Promise<TrainingTableType> {
		return this.repository.create(dto);
	}

	@ValidateDTO(UpdateCourseDTO)
	override async update(
		id: string | number,
		dto: UpdateCourseDTO,
		_context: Context,
	): Promise<TrainingTableType[] | null> {
		return this.repository.update(id, dto);
	}

	@ValidateDTO(CreateKeyCompetencyDTO)
	async createCompetency(
		dto: CreateKeyCompetencyDTO,
		_context: Context,
	): Promise<KeyCompetencyTableType> {
		return this.repository.createCompetency(dto);
	}

	@ValidateDTO(UpdateKeyCompetencyDTO)
	async updateCompetency(
		id: string,
		dto: UpdateKeyCompetencyDTO,
		_context: Context,
	): Promise<KeyCompetencyTableType[] | null> {
		return this.repository.updateCompetency(id, dto);
	}

	async deleteCompetency(id: string): Promise<boolean> {
		return this.repository.deleteCompetency(id);
	}

	async deleteManyCompetency(ids: (string | number)[]): Promise<{
		deletedCount: number;
		requestedCount: number;
		success: boolean;
	}> {
		if (ids.length === 0) {
			return {
				deletedCount: 0,
				requestedCount: 0,
				success: true,
			};
		}

		const deletedCount = await this.repository.deleManyCompetency(ids);

		return {
			deletedCount,
			requestedCount: ids.length,
			success: deletedCount === ids.length,
		};
	}

	async findPaginatedCompetency(
		query: PaginationQuery,
	): Promise<PaginatedResponse<KeyCompetencyTableType>> {
		return this.repository.findPaginatedCompetency(query);
	}

	async findAllCompetency(
		filters?: Partial<KeyCompetencyTableType>,
	): Promise<KeyCompetencyTableType[]> {
		return this.repository.findAllCompetency(filters);
	}

	@ValidateDTO(CreateModuleTDO)
	async createModule(
		dto: CreateModuleTDO,
		_context: Context,
	): Promise<ModuleTableType> {
		return this.repository.createModule(dto);
	}

	@ValidateDTO(UpdateModuleDTO)
	async updateModule(
		id: string,
		dto: UpdateModuleDTO,
		_context: Context,
	): Promise<ModuleTableType[] | null> {
		return this.repository.updateModule(id, dto);
	}

	async deleteModule(id: string): Promise<boolean> {
		return this.repository.deleteModule(id);
	}

	async deleteManyModule(ids: (string | number)[]): Promise<{
		deletedCount: number;
		requestedCount: number;
		success: boolean;
	}> {
		if (ids.length === 0) {
			return {
				deletedCount: 0,
				requestedCount: 0,
				success: true,
			};
		}

		const deletedCount = await this.repository.deleManyModule(ids);

		return {
			deletedCount,
			requestedCount: ids.length,
			success: deletedCount === ids.length,
		};
	}

	async findPaginatedModule(
		query: PaginationQuery,
	): Promise<PaginatedResponse<ModuleTableType>> {
		return this.repository.findPaginatedModule(query);
	}

	async findAllModule(
		filters?: Partial<ModuleTableType>,
	): Promise<ModuleTableType[]> {
		return this.repository.findAllModule(filters);
	}
}
