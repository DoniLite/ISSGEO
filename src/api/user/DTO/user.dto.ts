import { DTO } from "@/core/decorators";
import { BaseCreateDTO, BaseUpdateDTO } from "@/core/dto";
import type { UserTableType } from "@/db";
import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";

@DTO()
export class CreateUserDto extends BaseCreateDTO {
	@IsString()
	@IsEmail()
	email!: string;

	@IsString()
	password!: string;

	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	image?: string;

	@IsOptional()
	@IsEnum(["admin", "user", "maintainer"])
	role?: UserTableType["role"];
}

@DTO()
export class UpdateUserDto extends BaseUpdateDTO {
	@IsOptional()
	@IsString()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	image?: string;

	@IsOptional()
	@IsString()
	password?: string;

	@IsOptional()
	@IsEnum(["admin", "user", "maintainer"])
	role?: UserTableType["role"];
}

@DTO()
export class LoginDTO {
	@IsString()
	@IsEmail()
	email!: string;

	@IsString()
	password!: string;
}

@DTO()
export class UpdateUserPasswordDTO {
	@IsString()
	id!: string;

	@IsString()
	previousPassword!: string;

	@IsString()
	newPassword!: string;
}
