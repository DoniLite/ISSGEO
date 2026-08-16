import { BaseRepository } from "@/core/base.repository";
import { Repository } from "@/core/decorators";
import { ModuleTable, TrainingToModuleTable, type ModuleTableType } from "@/db";
import { eq } from "drizzle-orm";
import type {
	PaginatedResponse,
	PaginationQuery,
} from "@/lib/interfaces/pagination";
import type { CreateModuleTDO, UpdateModuleDTO } from "../DTO/modules.dto";

type ModuleFilters = Partial<
	Pick<ModuleTableType, "id" | "title" | "price" | "duration">
> & { courseId?: string };

@Repository("modules")
export class ModuleRepository extends BaseRepository<
	ModuleTableType,
	CreateModuleTDO,
	UpdateModuleDTO,
	typeof ModuleTable
> {
	protected table = ModuleTable;

	private async filtersForCourse(
		filters?: PaginationQuery["filters"],
	): Promise<NonNullable<PaginationQuery["filters"]>> {
		const { courseId, ...moduleFilters } = filters ?? {};
		if (typeof courseId !== "string" || !courseId) return moduleFilters;

		const links = await this.db
			.select({ moduleId: TrainingToModuleTable.moduleId })
			.from(TrainingToModuleTable)
			.where(eq(TrainingToModuleTable.trainingId, courseId));

		const courseModuleIds = links.map((link) => link.moduleId);
		return { ...moduleFilters, id: courseModuleIds };
	}

	override async findPaginated(
		query: PaginationQuery,
	): Promise<PaginatedResponse<ModuleTableType>> {
		const filters = await this.filtersForCourse(query.filters as ModuleFilters);
		return super.findPaginated({ ...query, filters });
	}

	override async findAll(filters?: ModuleFilters): Promise<ModuleTableType[]> {
		return super.findAll(
			await this.filtersForCourse(filters as PaginationQuery["filters"]),
		);
	}
}
