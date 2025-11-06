import { BaseService } from "@/core/base.service";
import type { ThematicTableType } from "@/db";
import { CreateThematicDTO, UpdateThematicDTO } from "../DTO/thematic.dto";
import { ThematicRepository } from "../repository/thematic.repository";
import type { Context } from "hono";
import { ValidateDTO } from "@/core/decorators";

export class ThematicService extends BaseService<
	ThematicTableType,
	CreateThematicDTO,
	UpdateThematicDTO,
	ThematicRepository
> {
	constructor() {
		super(new ThematicRepository());
	}

	@ValidateDTO(CreateThematicDTO)
	override async create(
		dto: CreateThematicDTO,
		_context: Context,
	): Promise<ThematicTableType> {
		return this.repository.create(dto);
	}

	@ValidateDTO(UpdateThematicDTO)
	override async update(
		id: string | number,
		dto: UpdateThematicDTO,
		_context: Context,
	): Promise<ThematicTableType[] | null> {
		return this.repository.update(id, dto);
	}
}
