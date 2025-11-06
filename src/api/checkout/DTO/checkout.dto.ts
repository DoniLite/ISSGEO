import { DTO } from "@/core/decorators";
import { BaseCreateDTO, BaseUpdateDTO } from "@/core/dto";
import {
	IsBoolean,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
} from "class-validator";

type CheckoutMetaData = {};

@DTO()
export class CreateCheckoutDTO extends BaseCreateDTO {
	@IsBoolean()
	isValidated!: boolean;

	@IsString()
	rollingId!: string;

	@IsNumber()
	amount!: number;

	@IsOptional()
	@IsObject()
	metaData?: CheckoutMetaData;
}

@DTO()
export class UpdateCheckoutDTO extends BaseUpdateDTO {
	@IsOptional()
	@IsBoolean()
	isValidated?: boolean;

	@IsOptional()
	@IsString()
	rollingId?: string;

	@IsOptional()
	@IsNumber()
	amount?: number;

	@IsOptional()
	@IsObject()
	metaData?: CheckoutMetaData;
}
