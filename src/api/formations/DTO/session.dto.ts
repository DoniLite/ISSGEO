import { DTO } from "@/core/decorators";
import { BaseCreateDTO, BaseUpdateDTO } from "@/core/dto";
import { IsDateString, IsOptional, IsString } from "class-validator";

@DTO()
export class CreateSessionDTO extends BaseCreateDTO {
	@IsDateString()
	startDate!: string;

	@IsString()
	location!: string;

	@IsString()
	moduleId!: string;
}

@DTO()
export class UpdateSessionDTO extends BaseUpdateDTO {
	@IsOptional()
	@IsDateString()
	startDate?: string;

	@IsOptional()
	@IsString()
	location?: string;

	@IsOptional()
	@IsString()
	moduleId?: string;
}
