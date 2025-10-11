import { BaseService } from '@/core/base.service';
import { Service, ValidateDTO } from '@/core/decorators';
import type { TrainingSessionTableType } from '@/db';
import { CreateSessionDTO, UpdateSessionDTO } from '../DTO/session.dto';
import { SessionRepository } from '../repository/session.repository';
import type { Context } from 'hono';

@Service()
export class SessionService extends BaseService<
  TrainingSessionTableType,
  CreateSessionDTO,
  UpdateSessionDTO,
  SessionRepository
> {
  constructor() {
    super(new SessionRepository());
  }

  @ValidateDTO(CreateSessionDTO)
  override async create(
    dto: CreateSessionDTO,
    _context: Context
  ): Promise<TrainingSessionTableType> {
    return this.repository.create(dto);
  }

  @ValidateDTO(UpdateSessionDTO)
  override async update(
    id: string | number,
    dto: UpdateSessionDTO,
    _context: Context
  ): Promise<TrainingSessionTableType[] | null> {
    return this.repository.update(id, dto);
  }
}
