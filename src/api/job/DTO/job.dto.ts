import { DTO } from '@/core/decorators';
import { BaseCreateDTO, BaseUpdateDTO } from '@/core/dto';
import type { JobOfferTableType } from '@/db';
import { IsEnum, IsOptional, IsString } from 'class-validator';

@DTO()
export class CreateJobDTO extends BaseCreateDTO {
  @IsString()
  title!: string;

  @IsString()
  location!: string;

  @IsEnum(['CDI', 'CDD', 'Freelance', 'Stage'])
  contract!: JobOfferTableType['contract'];
}

@DTO()
export class UpdateJobDTO extends BaseUpdateDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(['CDI', 'CDD', 'Freelance', 'Stage'])
  contract?: JobOfferTableType['contract'];
}
