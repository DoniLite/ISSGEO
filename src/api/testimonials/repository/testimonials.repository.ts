import { BaseRepository } from "@/core/base.repository";
import { TestimonialsTable, type TestimonialsTableType } from "@/db";
import type {
	CreateTestimonialDTO,
	UpdateTestimonialDTO,
} from "../DTO/testimonials.dto";
import { Repository } from "@/core/decorators";

@Repository("testimonials")
export class TestimonialRepository extends BaseRepository<
	TestimonialsTableType,
	CreateTestimonialDTO,
	UpdateTestimonialDTO,
	typeof TestimonialsTable
> {
	protected table = TestimonialsTable;
}
