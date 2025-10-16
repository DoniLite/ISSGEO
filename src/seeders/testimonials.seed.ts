import type { TestimonialsTableType } from '@/db';
import { BaseSeeder } from './base.seed';
import {
  TestimonialRepository,
  type CreateTestimonialDTO,
  type UpdateTestimonialDTO,
} from '@/api/testimonials';
import { mockTestimonials } from '@/lib/mock';

export class TestimonialsSeeder extends BaseSeeder<
  TestimonialsTableType,
  CreateTestimonialDTO,
  UpdateTestimonialDTO,
  TestimonialRepository
> {
  constructor() {
    super(new TestimonialRepository(), [
      ...(mockTestimonials as CreateTestimonialDTO[]),
    ], 'name');
  }
}
