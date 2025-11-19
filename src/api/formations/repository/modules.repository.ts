import { BaseRepository } from "@/core/base.repository";
import { Repository } from "@/core/decorators";
import { ModuleTable, type ModuleTableType } from "@/db";
import type { CreateModuleTDO, UpdateModuleDTO } from "../DTO/modules.dto";

@Repository("modules")
export class ModuleRepository extends BaseRepository<
	ModuleTableType,
	CreateModuleTDO,
	UpdateModuleDTO,
	typeof ModuleTable
> {
	protected table = ModuleTable;
}
