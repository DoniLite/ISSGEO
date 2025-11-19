import { DTO } from "@/core/decorators";
import { BaseCreateDTO, BaseUpdateDTO } from "@/core/dto";
import { IsArray, IsOptional, IsString } from "class-validator";

@DTO()
export class CreateKeyCompetencyDTO extends BaseCreateDTO {
	@IsString()
	title!: string;

	@IsString()
	description!: string;

	@IsString()
	icon!: string;

	@IsArray()
	sectors!: string[];

	@IsArray()
	advantages!: string[];

	@IsString()
	moduleId!: string;
}

@DTO()
export class UpdateKeyCompetencyDTO extends BaseUpdateDTO {
	@IsOptional()
	@IsString()
	title?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsString()
	icon?: string;

	@IsOptional()
	@IsArray()
	sectors?: string[];

	@IsOptional()
	@IsArray()
	advantages?: string[];

	@IsOptional()
	@IsString()
	moduleId?: string;
}
