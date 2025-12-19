import { DTO } from "@/core/decorators";
import { BaseCreateDTO, BaseUpdateDTO } from "@/core/dto";
import { IsOptional, IsString } from "class-validator";

@DTO()
export class CreateTrainingToKeyCompetencyDTO extends BaseCreateDTO {
	@IsString()
	competencyId!: string;

	@IsString()
	trainingId!: string;
}

@DTO()
export class UpdateTrainingToKeyCompetencyDTO extends BaseUpdateDTO {
	@IsOptional()
	@IsString()
	competencyId!: string;

	@IsOptional()
	@IsString()
	trainingId!: string;
}
