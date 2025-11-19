import { DTO } from "@/core/decorators";
import { BaseCreateDTO, BaseUpdateDTO } from "@/core/dto";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

@DTO()
export class CreateCourseDTO extends BaseCreateDTO {
	@IsString()
	title!: string;

	@IsString()
	description!: string;

	@IsArray()
	learningOutcomes!: string[];

	@IsOptional()
	@IsString()
	targetAudience?: string;

	@IsOptional()
	@IsString()
	thematicId?: string;
}

@DTO()
export class UpdateCourseDTO extends BaseUpdateDTO {
	@IsOptional()
	@IsString()
	title?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsArray()
	learningOutcomes?: string[];

	@IsOptional()
	@IsString()
	targetAudience?: string;

	@IsOptional()
	@IsNumber()
	participants?: number;

	@IsOptional()
	@IsNumber()
	enrolled?: number;

	@IsOptional()
	@IsString()
	thematicId?: string;

	@IsOptional()
	@IsNumber()
	totalDuration?: number;

	@IsOptional()
	@IsNumber()
	priceMin?: number;

	@IsOptional()
	@IsNumber()
	priceMax?: number;
}
