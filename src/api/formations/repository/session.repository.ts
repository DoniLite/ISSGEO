import { BaseRepository } from "@/core/base.repository";
import { TrainingSessionTable, TrainingTable, type TrainingSessionTableType, type TrainingTableType } from "@/db";
import type { CreateSessionDTO, UpdateSessionDTO } from "../DTO/session.dto";
import { Repository } from "@/core/decorators";
import type { PaginationQuery } from "@/lib/interfaces/pagination";
import { inArray } from "drizzle-orm";

@Repository("training_session")
export class SessionRepository extends BaseRepository<
	TrainingSessionTableType,
	CreateSessionDTO,
	UpdateSessionDTO,
	typeof TrainingSessionTable,
	TrainingSessionTableType & { module: TrainingTableType | undefined }
> {
	protected table = TrainingSessionTable;

	protected override async populateChildrenForItems(
		items: TrainingSessionTableType[],
		_paginationQuery?: PaginationQuery,
	): Promise<
		(TrainingSessionTableType & { module: TrainingTableType | undefined })[]
	> {
		// Fetch modules for the given session IDs
		const moduleIds = items.map((item) => item.moduleId).filter(Boolean) as string[];
		const modules = await this.db
			.select()
			.from(TrainingTable)
			.where(inArray(TrainingTable.id, moduleIds));

		// Map modules to their corresponding sessions
		const moduleMap = new Map<string, TrainingTableType>();
		for (const module of modules) {
			moduleMap.set(module.id, module);
		}

		// Return items with populated module information
		return items.map((item) => ({
			...item,
			module: moduleMap.get(item.moduleId as string) || undefined,
		}));
	}
}
