import { BaseService } from "@/core/base.service";
import { Service, ValidateDTO } from "@/core/decorators";
import type { JobOfferTableType } from "@/db";
import { CreateJobDTO, UpdateJobDTO } from "../DTO/job.dto";
import { JobRepository } from "../repository/job.repository";
import type { Context } from "hono";

@Service()
export class JobService extends BaseService<
	JobOfferTableType,
	CreateJobDTO,
	UpdateJobDTO,
	JobRepository
> {
	constructor() {
		super(new JobRepository());
	}

	@ValidateDTO(CreateJobDTO)
	override async create(
		dto: CreateJobDTO,
		_context: Context,
	): Promise<JobOfferTableType> {
		return this.repository.create(dto);
	}

	@ValidateDTO(UpdateJobDTO)
	override async update(
		id: string | number,
		dto: UpdateJobDTO,
		_context: Context,
	): Promise<JobOfferTableType[] | null> {
		return this.repository.update(id, dto);
	}
}
