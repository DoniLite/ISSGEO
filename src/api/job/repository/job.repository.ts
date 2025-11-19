import { BaseRepository } from "@/core/base.repository";
import { Repository } from "@/core/decorators";
import { JobOfferTable, type JobOfferTableType } from "@/db";
import type { CreateJobDTO, UpdateJobDTO } from "../DTO/job.dto";

@Repository("job_offer")
export class JobRepository extends BaseRepository<
	JobOfferTableType,
	CreateJobDTO,
	UpdateJobDTO,
	typeof JobOfferTable
> {
	protected table = JobOfferTable;
}
