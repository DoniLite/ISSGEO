import { DTO } from "@/core/decorators";
import { BaseCreateDTO, BaseUpdateDTO } from "@/core/dto";
import { IsOptional, IsString } from "class-validator";

@DTO()
export class CreateRollingToModuleDTO extends BaseCreateDTO {
	@IsString()
	moduleId!: string;

	@IsString()
	rollingId!: string;
}

@DTO()
export class UpdateRollingToModuleDTO extends BaseUpdateDTO {
	@IsOptional()
	@IsString()
	moduleId!: string;

	@IsOptional()
	@IsString()
	rollingId!: string;
}
