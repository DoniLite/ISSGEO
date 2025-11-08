import { BaseRepository } from "@/core/base.repository";
import { Repository } from "@/core/decorators";
import {
	RollingToModuleTable,
	type RollingToModuleTableType,
} from "@/db";
import type {
	CreateRollingToModuleDTO,
	UpdateRollingToModuleDTO,
} from "../DTO/rollingToModule.dto";

@Repository("rolling_to_module")
export class RollingToModuleRepository extends BaseRepository<
	RollingToModuleTableType,
	CreateRollingToModuleDTO,
	UpdateRollingToModuleDTO,
	typeof RollingToModuleTable
> {
	protected table = RollingToModuleTable;
}
