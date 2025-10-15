import { BaseService } from '@/core/base.service';
import type { TestimonialsTableType } from '@/db';
import {
  CreateTestimonialDTO,
  UpdateTestimonialDTO,
} from '../DTO/testimonials.dto';
import { TestimonialRepository } from '../repository/testimonials.repository';
import type { Context } from 'hono';
import { Service, ValidateDTO } from '@/core/decorators';

@Service()
export class TestimonialsService extends BaseService<
  TestimonialsTableType,
  CreateTestimonialDTO,
  UpdateTestimonialDTO,
  TestimonialRepository
> {
  constructor() {
    super(new TestimonialRepository());
  }

  @ValidateDTO(CreateTestimonialDTO)
  override async create(
    dto: CreateTestimonialDTO,
    _context: Context
  ): Promise<TestimonialsTableType> {
    return this.repository.create(dto);
  }

  @ValidateDTO(UpdateTestimonialDTO)
  override async update(
    id: string | number,
    dto: UpdateTestimonialDTO,
    _context: Context
  ): Promise<TestimonialsTableType[] | null> {
    return this.repository.update(id, dto);
  }
}
