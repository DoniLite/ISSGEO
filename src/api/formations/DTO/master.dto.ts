import { DTO } from "@/core/decorators";
import { BaseCreateDTO, BaseUpdateDTO } from "@/core/dto";
import { IsObject, IsOptional, IsString } from "class-validator";

@DTO()
export class CreateMasterDTO extends BaseCreateDTO {
	@IsString()
	name!: string;

	@IsOptional()
	@IsString()
	image?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsObject()
	socials?: {
		facebook?: string;
		twitter?: string;
		instagram?: string;
		linkedin?: string;
	};
}

@DTO()
export class UpdateMasterDTO extends BaseUpdateDTO {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsString()
	image?: string;

	@IsOptional()
	@IsObject()
	socials?: {
		facebook?: string;
		twitter?: string;
		instagram?: string;
		linkedin?: string;
	};
}
