import { DTO } from '@/core/decorators';
import { BaseCreateDTO, BaseUpdateDTO } from '@/core/dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@DTO()
export class CreateTestimonialDTO extends BaseCreateDTO {
  @IsString()
  name!: string;

  @IsNumber()
  starNumber!: number;

  @IsString()
  message!: string;
}

export class UpdateTestimonialDTO extends BaseUpdateDTO {
  @IsOptional()
  @IsString()
  name!: string;

  @IsOptional()
  @IsNumber()
  starNumber!: number;

  @IsOptional()
  @IsString()
  message!: string;
}
