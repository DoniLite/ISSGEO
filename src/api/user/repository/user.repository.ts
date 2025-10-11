import { BaseRepository } from '@/core/base.repository';
import { Repository } from '@/core/decorators';
import { UserTable, type UserTableType } from '@/db';
import type { CreateUserDto, UpdateUserDto } from '../DTO/user.dto';

@Repository('user')
export class UserRepository extends BaseRepository<
  UserTableType,
  CreateUserDto,
  UpdateUserDto,
  typeof UserTable
> {
  protected table = UserTable;
}
