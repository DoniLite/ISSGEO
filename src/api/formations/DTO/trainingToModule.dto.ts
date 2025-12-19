import { DTO } from "@/core/decorators";
import { BaseCreateDTO, BaseUpdateDTO } from "@/core/dto";
import { IsOptional, IsString } from "class-validator";

@DTO()
export class CreateTrainingToModuleDTO extends BaseCreateDTO {
	@IsString()
	moduleId!: string;

	@IsString()
	trainingId!: string;
}

@DTO()
export class UpdateTrainingToModuleDTO extends BaseUpdateDTO {
	@IsOptional()
	@IsString()
	moduleId!: string;

	@IsOptional()
	@IsString()
	trainingId!: string;
}
