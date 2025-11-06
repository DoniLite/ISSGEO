import { BaseService } from "@/core/base.service";
import { Service, ValidateDTO } from "@/core/decorators";
import type { CheckoutTableType } from "@/db";
import type { Context } from "hono";
import { CreateCheckoutDTO, UpdateCheckoutDTO } from "../DTO/checkout.dto";
import { CheckoutRepository } from "../repository/checkout.repository";

@Service()
export class CheckoutService extends BaseService<
	CheckoutTableType,
	CreateCheckoutDTO,
	UpdateCheckoutDTO,
	CheckoutRepository
> {
	constructor() {
		super(new CheckoutRepository());
	}

	@ValidateDTO(CreateCheckoutDTO)
	override async create(
		dto: CreateCheckoutDTO,
		_context: Context,
	): Promise<CheckoutTableType> {
		return this.repository.create(dto);
	}

	@ValidateDTO(UpdateCheckoutDTO)
	override async update(
		id: string | number,
		dto: UpdateCheckoutDTO,
		_context: Context,
	): Promise<CheckoutTableType[] | null> {
		return this.repository.update(id, dto);
	}

	async getCheckoutByCode(code: string): Promise<CheckoutTableType | null> {
		return this.repository.findOneBy("code", code);
	}
}
