import { BaseRepository } from "@/core/base.repository";
import { Repository } from "@/core/decorators";
import {
	TrainingToKeyCompetencyTable,
	type TrainingToKeyCompetencyTableType,
} from "@/db";
import type {
	CreateTrainingToKeyCompetencyDTO,
	UpdateTrainingToKeyCompetencyDTO,
} from "../DTO/trainingToKeyCompetency.dto";

@Repository("training_to_key_competency")
export class TrainingToKeyCompetencyRepository extends BaseRepository<
	TrainingToKeyCompetencyTableType,
	CreateTrainingToKeyCompetencyDTO,
	UpdateTrainingToKeyCompetencyDTO,
	typeof TrainingToKeyCompetencyTable
> {
	protected table = TrainingToKeyCompetencyTable;
}
