import { BaseRepository } from "@/core/base.repository";
import { Repository } from "@/core/decorators";
import { ContactTable, type ContactTableType } from "@/db";
import type { CreateContactDTO, UpdateContactDTO } from "../DTO/contact.dto";

@Repository("contact")
export class ContactRepository extends BaseRepository<
	ContactTableType,
	CreateContactDTO,
	UpdateContactDTO,
	typeof ContactTable
> {
	protected table = ContactTable;
}
