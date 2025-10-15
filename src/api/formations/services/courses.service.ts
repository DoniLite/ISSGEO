import { BaseService } from '@/core/base.service';
import type { KeyCompetencyTableType, TrainingTableType } from '@/db';
import { CreateCourseDTO, UpdateCourseDTO } from '../DTO/courses.dto';
import { CoursesRepository } from '../repository/courses.repository';
import type { Context } from 'hono';
import { Service, ValidateDTO } from '@/core/decorators';
import {
  CreateKeyCompetencyDTO,
  UpdateKeyCompetencyDTO,
} from '../DTO/keyCompetency.dto';
import type {
  PaginatedResponse,
  PaginationQuery,
} from '@/lib/interfaces/pagination';

@Service()
export class CourseService extends BaseService<
  TrainingTableType,
  CreateCourseDTO,
  UpdateCourseDTO,
  CoursesRepository
> {
  constructor() {
    super(new CoursesRepository());
  }

  @ValidateDTO(CreateCourseDTO)
  override async create(
    dto: CreateCourseDTO,
    _context: Context
  ): Promise<TrainingTableType> {
    return this.repository.create(dto);
  }

  @ValidateDTO(UpdateCourseDTO)
  override async update(
    id: string | number,
    dto: UpdateCourseDTO,
    _context: Context
  ): Promise<TrainingTableType[] | null> {
    return this.repository.update(id, dto);
  }

  @ValidateDTO(CreateKeyCompetencyDTO)
  async createCompetency(
    dto: CreateKeyCompetencyDTO,
    _context: Context
  ): Promise<KeyCompetencyTableType> {
    return this.repository.createCompetency(dto);
  }

  @ValidateDTO(UpdateKeyCompetencyDTO)
  async updateCompetency(
    id: string,
    dto: UpdateKeyCompetencyDTO,
    _context: Context
  ): Promise<KeyCompetencyTableType[] | null> {
    return this.repository.updateCompetency(id, dto);
  }

  async deleteCompetency(id: string): Promise<boolean> {
    return this.repository.deleteCompetency(id);
  }

  async findPaginatedCompetency(
    query: PaginationQuery
  ): Promise<PaginatedResponse<KeyCompetencyTableType>> {
    return this.repository.findPaginatedCompetency(query);
  }

  async findAllCompetency(
    filters?: Partial<KeyCompetencyTableType>
  ): Promise<KeyCompetencyTableType[]> {
    return this.repository.findAllCompetency(filters);
  }
}
