import { BaseRepository } from "@/core/base.repository";
import { ThematicTable, type ThematicTableType } from "@/db";
import type { CreateThematicDTO, UpdateThematicDTO } from "../DTO/thematic.dto";
import { Repository } from "@/core/decorators";

@Repository("thematic")
export class ThematicRepository extends BaseRepository<
	ThematicTableType,
	CreateThematicDTO,
	UpdateThematicDTO,
	typeof ThematicTable
> {
	protected table = ThematicTable;
}
