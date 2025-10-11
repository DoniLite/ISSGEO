import { BaseService } from '@/core/base.service';
import type { ContactTableType } from '@/db';
import { CreateContactDTO, UpdateContactDTO } from '../DTO/contact.dto';
import { Service, ValidateDTO } from '@/core/decorators';
import { ContactRepository } from '../repository/contact.repository';
import type { Context } from 'hono';

@Service()
export class ContactService extends BaseService<
  ContactTableType,
  CreateContactDTO,
  UpdateContactDTO,
  ContactRepository
> {
  constructor() {
    super(new ContactRepository());
  }

  @ValidateDTO(CreateContactDTO)
  override async create(
    dto: CreateContactDTO,
    _context: Context
  ): Promise<ContactTableType> {
    return this.repository.create(dto);
  }

  @ValidateDTO(UpdateContactDTO)
  override async update(
    id: string | number,
    dto: UpdateContactDTO,
    _context: Context
  ): Promise<ContactTableType[] | null> {
    return this.repository.update(id, dto);
  }
}
