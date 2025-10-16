/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import 'dotenv/config';
import type { UserTableType } from '@/db';
import { BaseSeeder } from './base.seed';
import {
  UserRepository,
  type CreateUserDto,
  type UpdateUserDto,
} from '@/api/user';
import { hashSomething } from '@/api/helpers/hash';

export class UserSeeder extends BaseSeeder<
  UserTableType,
  CreateUserDto,
  UpdateUserDto,
  UserRepository
> {
  constructor() {
    super(
      new UserRepository(),
      [
        {
          name: 'Admin',
          email: 'admin@issgeo.com',
          role: 'admin',
          password: process.env.ADMIN_PASSWORD as string,
        },
      ],
      'email'
    );
  }

  public override async run(): Promise<void> {
    const uniqueKeyValue = (mock: CreateUserDto) =>
      (mock as any)[this.uniqueKey as keyof UserTableType];
    const uniqueKeyName = String(this.uniqueKey);

    for (const mock of this.mocks) {
      if (this.uniqueKey) {
        const uniqueValue = uniqueKeyValue(mock);

        // 1. Check for existence based on the unique key
        const existingEntity = await this.repository.findOneBy(
          this.uniqueKey,
          uniqueValue
        );

        if (existingEntity) {
          // Exists: Check if data needs update
          if (this.areDataDifferent(mock, existingEntity)) {
            // Data is different, perform update (using CreateDTO as UpdateDTO)
            await this.repository.update(
              existingEntity.id as string,
              mock as unknown as UpdateUserDto
            );
            console.log(`[UPDATED] Entity ${uniqueKeyName}:${uniqueValue}`);
          } else {
            // Data is identical, skip
            console.log(
              `[SKIPPED] Entity ${uniqueKeyName}:${uniqueValue} already up-to-date`
            );
          }
        } else {
          // Does not exist: Create new entity
          const password = await hashSomething(mock.password);
          await this.repository.create({
            ...mock,
            password,
          });
          console.log(`[CREATED] Entity ${uniqueKeyName}:${mock}`);
        }
      } else {
        // Does not exist: Create new entity
        const password = await hashSomething(mock.password);
        await this.repository.create({
          ...mock,
          password,
        });
        console.log(`[CREATED] Entity ${uniqueKeyName}:${mock}`);
      }
    }
  }
}
