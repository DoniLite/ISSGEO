import { BaseRepository } from "@/core/base.repository";
import { Repository } from "@/core/decorators";
import { TrainingToModuleTable, type TrainingToModuleTableType } from "@/db";
import type {
	CreateTrainingToModuleDTO,
	UpdateTrainingToModuleDTO,
} from "../DTO/trainingToModule.dto";

@Repository("training_to_module")
export class TrainingToModuleRepository extends BaseRepository<
	TrainingToModuleTableType,
	CreateTrainingToModuleDTO,
	UpdateTrainingToModuleDTO,
	typeof TrainingToModuleTable
> {
	protected table = TrainingToModuleTable;
}
