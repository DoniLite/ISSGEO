import { RollingTable, type RollingTableType } from "@/db";
import { BaseRepository } from "@/core/base.repository";
import { Repository } from "@/core/decorators";
import type { CreateRollingDTO, UpdateRollingDTO } from "../DTO/rolling.dto";

@Repository("rolling")
export class RollingRepository extends BaseRepository<
	RollingTableType,
	CreateRollingDTO,
	UpdateRollingDTO,
	typeof RollingTable
> {
	protected table = RollingTable;
}
