import { CheckoutTable, type CheckoutTableType } from "@/db";
import type { CreateCheckoutDTO, UpdateCheckoutDTO } from "../DTO/checkout.dto";
import { BaseRepository } from "@/core/base.repository";
import { Repository } from "@/core/decorators";

@Repository("checkout")
export class CheckoutRepository extends BaseRepository<
	CheckoutTableType,
	CreateCheckoutDTO,
	UpdateCheckoutDTO,
	typeof CheckoutTable
> {
	protected table = CheckoutTable;
}
