import { DTO } from "@/core/decorators";
import { BaseCreateDTO, BaseUpdateDTO } from "@/core/dto";
import { IsOptional, IsString } from "class-validator";

@DTO()
export class CreateThematicDTO extends BaseCreateDTO {
	@IsString()
	name!: string;

	@IsString()
	icon!: string;
}

@DTO()
export class UpdateThematicDTO extends BaseUpdateDTO {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	icon?: string;
}
