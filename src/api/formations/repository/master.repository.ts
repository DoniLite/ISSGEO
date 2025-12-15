import { BaseRepository } from "@/core/base.repository";
import { MasterTable, type MasterTableType } from "@/db";
import type { CreateMasterDTO, UpdateMasterDTO } from "../DTO/master.dto";
import { Repository } from "@/core/decorators";

@Repository('Master')
export class MasterRepository extends BaseRepository<
	MasterTableType,
	CreateMasterDTO,
	UpdateMasterDTO,
	typeof MasterTable
> {
	protected table = MasterTable;
}
