import { IsDate, IsOptional, IsString } from 'class-validator';

export abstract class BaseCreateDTO {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;
}

export abstract class BaseUpdateDTO {
  @IsOptional()
  @IsDate()
  deletedAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
