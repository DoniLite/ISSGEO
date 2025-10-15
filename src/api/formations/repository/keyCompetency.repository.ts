import { BaseRepository } from '@/core/base.repository';
import { Repository } from '@/core/decorators';
import { KeyCompetencyTable, type KeyCompetencyTableType } from '@/db';
import type {
  CreateKeyCompetencyDTO,
  UpdateKeyCompetencyDTO,
} from '../DTO/keyCompetency.dto';

@Repository('key_competency')
export class KeyCompetencyRepository extends BaseRepository<
  KeyCompetencyTableType,
  CreateKeyCompetencyDTO,
  UpdateKeyCompetencyDTO,
  typeof KeyCompetencyTable
> {
  protected table = KeyCompetencyTable;
}
