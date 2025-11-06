import { DTO } from "@/core/decorators";
import { BaseCreateDTO, BaseUpdateDTO } from "@/core/dto";
import { IsEmail, IsOptional, IsString } from "class-validator";

@DTO()
export class CreateContactDTO extends BaseCreateDTO {
	@IsString()
	name!: string;

	@IsString()
	message!: string;

	@IsString()
	@IsEmail()
	email!: string;
}

@DTO()
export class UpdateContactDTO extends BaseUpdateDTO {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	message?: string;

	@IsOptional()
	@IsString()
	@IsEmail()
	email?: string;
}
