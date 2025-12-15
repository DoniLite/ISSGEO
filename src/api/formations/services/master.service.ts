import { BaseService } from "@/core/base.service";
import type { MasterTableType } from "@/db";
import { CreateMasterDTO, UpdateMasterDTO } from "../DTO/master.dto";
import { MasterRepository } from "../repository/master.repository";
import { Service, ValidateDTO } from "@/core/decorators";
import type { Context } from "hono";

@Service()
export class MasterService extends BaseService<
	MasterTableType,
	CreateMasterDTO,
	UpdateMasterDTO,
	MasterRepository
> {

	constructor() {
		super(new MasterRepository());
	}

	@ValidateDTO(CreateMasterDTO)
	override async create(
		dto: CreateMasterDTO,
		_context: Context,
	): Promise<MasterTableType> {
		return this.repository.create(dto);
	}

	@ValidateDTO(UpdateMasterDTO)
	override async update(
		id: string | number,
		dto: UpdateMasterDTO,
		_context: Context,
	): Promise<MasterTableType[] | null> {
		return this.repository.update(id, dto);
	}
}
