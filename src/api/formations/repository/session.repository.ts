import { BaseRepository } from '@/core/base.repository';
import { TrainingSessionTable, type TrainingSessionTableType } from '@/db';
import type { CreateSessionDTO, UpdateSessionDTO } from '../DTO/session.dto';
import { Repository } from '@/core/decorators';

@Repository('training_session')
export class SessionRepository extends BaseRepository<
  TrainingSessionTableType,
  CreateSessionDTO,
  UpdateSessionDTO,
  typeof TrainingSessionTable
> {
  protected table = TrainingSessionTable;
}
