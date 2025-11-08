import { DTO } from '@/core/decorators';
import { BaseCreateDTO, BaseUpdateDTO } from '@/core/dto';
import { IsOptional, IsString } from 'class-validator';

@DTO()
export class CreateRollingDTO extends BaseCreateDTO {
	@IsString()
	name!: string;

	@IsString()
	contact!: string;

	@IsOptional()
	@IsString()
	country?: string;

	@IsOptional()
	@IsString()
	profession?: string;

	@IsOptional()
	@IsString()
	schoolLevel?: string;

	@IsOptional()
	@IsString()
	experience?: string;

	@IsString()
	courseId!: string;
}

@DTO()
export class UpdateRollingDTO extends BaseUpdateDTO {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	contact?: string;

	@IsOptional()
	@IsString()
	country?: string;

	@IsOptional()
	@IsString()
	profession?: string;

	@IsOptional()
	@IsString()
	schoolLevel?: string;

	@IsOptional()
	@IsString()
	experience?: string;
}
