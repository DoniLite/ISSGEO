import { BaseService } from "@/core/base.service";
import { Service, ValidateDTO } from "@/core/decorators";
import type { RollingTableType } from "@/db";
import type { Context } from "hono";
import { CreateRollingDTO, UpdateRollingDTO } from "../DTO/rolling.dto";
import { RollingRepository } from "../repository/rolling.repository";

@Service()
export class RollingService extends BaseService<
	RollingTableType,
	CreateRollingDTO,
	UpdateRollingDTO,
	RollingRepository
> {
	constructor() {
		super(new RollingRepository());
	}

	@ValidateDTO(CreateRollingDTO)
	override async create(
		dto: CreateRollingDTO,
		_context: Context,
	): Promise<RollingTableType> {
		return this.repository.create(dto);
	}

	@ValidateDTO(UpdateRollingDTO)
	override async update(
		id: string | number,
		dto: UpdateRollingDTO,
		_context: Context,
	): Promise<RollingTableType[] | null> {
		return this.repository.update(id, dto);
	}
}
