import { BaseRepository } from '@/core/base.repository';
import {
  TrainingTable,
  type KeyCompetencyTableType,
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

@Repository('courses')
export class CoursesRepository extends BaseRepository<
  TrainingTableType,
  CreateCourseDTO,
  UpdateCourseDTO,
  typeof TrainingTable
> {
  protected table = TrainingTable;
  private keyCompetencyRepository;

  constructor() {
    super();
    this.keyCompetencyRepository = new KeyCompetencyRepository();
  }

  async createCompetency(
    dto: CreateKeyCompetencyDTO
  ): Promise<KeyCompetencyTableType> {
    return this.keyCompetencyRepository.create(dto);
  }

  async updateCompetency(
    id: string,
    dto: UpdateKeyCompetencyDTO
  ): Promise<KeyCompetencyTableType[] | null> {
    return this.keyCompetencyRepository.update(id, dto);
  }

  async deleteCompetency(id: string): Promise<boolean> {
    return this.keyCompetencyRepository.delete(id);
  }

  async findPaginatedCompetency(
    query: PaginationQuery
  ): Promise<PaginatedResponse<KeyCompetencyTableType>> {
    return this.keyCompetencyRepository.findPaginated(query);
  }

  async findAllCompetency(
    filters?: Partial<KeyCompetencyTableType>
  ): Promise<KeyCompetencyTableType[]> {
    return this.keyCompetencyRepository.findAll(filters);
  }
}
