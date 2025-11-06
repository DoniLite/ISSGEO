import { BaseRepository } from '@/core/base.repository';
import {
  TrainingTable,
  type KeyCompetencyTableType,
  type ModuleTableType,
  type TrainingTableType,
} from '@/db';
import type { CreateCourseDTO, UpdateCourseDTO } from '../DTO/courses.dto';
import { Repository } from '@/core/decorators';
import { KeyCompetencyRepository } from './keyCompetency.repository';
import type {
  CreateKeyCompetencyDTO,
  UpdateKeyCompetencyDTO,
} from '../DTO/keyCompetency.dto';
import type {
  PaginatedResponse,
  PaginationQuery,
} from '@/lib/interfaces/pagination';
import { ModuleRepository } from './modules.repository';
import type { CreateModuleTDO, UpdateModuleDTO } from '../DTO/modules.dto';

@Repository('courses')
export class CoursesRepository extends BaseRepository<
  TrainingTableType,
  CreateCourseDTO,
  UpdateCourseDTO,
  typeof TrainingTable
> {
  protected table = TrainingTable;

  constructor(
    private keyCompetencyRepo = new KeyCompetencyRepository(),
    private ModuleRepo = new ModuleRepository()
  ) {
    super();
  }

  async createCompetency(
    dto: CreateKeyCompetencyDTO
  ): Promise<KeyCompetencyTableType> {
    return this.keyCompetencyRepo.create(dto);
  }

  async updateCompetency(
    id: string,
    dto: UpdateKeyCompetencyDTO
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
    query: PaginationQuery
  ): Promise<PaginatedResponse<KeyCompetencyTableType>> {
    return this.keyCompetencyRepo.findPaginated(query);
  }

  async findAllCompetency(
    filters?: Partial<KeyCompetencyTableType>
  ): Promise<KeyCompetencyTableType[]> {
    return this.keyCompetencyRepo.findAll(filters);
  }

  async createModule(dto: CreateModuleTDO): Promise<ModuleTableType> {
    return this.ModuleRepo.create(dto);
  }

  async updateModule(
    id: string,
    dto: UpdateModuleDTO
  ): Promise<ModuleTableType[] | null> {
    return this.updateModule(id, dto);
  }

  async deleteModule(id: string): Promise<boolean> {
    return this.ModuleRepo.delete(id);
  }

  async deleManyModule(ids: (string | number)[]): Promise<number> {
    return this.ModuleRepo.deleteMultiple(ids);
  }

  async findPaginatedModule(
    query: PaginationQuery
  ): Promise<PaginatedResponse<ModuleTableType>> {
    return this.ModuleRepo.findPaginated(query);
  }

  async findAllModule(
    filters?: Partial<ModuleTableType>
  ): Promise<ModuleTableType[]> {
    return this.ModuleRepo.findAll(filters);
  }
}
