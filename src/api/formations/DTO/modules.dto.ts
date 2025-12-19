import { DTO } from "@/core/decorators";
import { BaseCreateDTO, BaseUpdateDTO } from "@/core/dto";
import { IsNumber, IsOptional, IsString } from "class-validator";

@DTO()
export class CreateModuleTDO extends BaseCreateDTO {
	@IsString()
	title!: string;

	@IsNumber()
	price!: number;

	@IsNumber()
	duration!: number;
}

@DTO()
export class UpdateModuleDTO extends BaseUpdateDTO {
	@IsOptional()
	@IsString()
	title?: string;

	@IsOptional()
	@IsNumber()
	price?: number;

	@IsOptional()
	@IsNumber()
	duration?: number;
}
