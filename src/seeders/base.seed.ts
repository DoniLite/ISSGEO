/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import type { BaseRepository } from '@/core/base.repository';
import type { BaseCreateDTO, BaseUpdateDTO } from '@/core/dto';
import type { BaseEntity } from '@/core/types/base';

/**
 * Abstract base class for all application seeders.
 * It encapsulates the upsert logic (create or update) to ensure data integrity
 * by utilizing the service's validation layer.
 *
 * @template T - The entity type (must extend BaseEntity).
 * @template CreateDTO - The DTO used for creation.
 * @template UpdateDTO - The DTO used for updating.
 * @template S - The concrete service type compatible with SeederCompatibleService.
 */
export abstract class BaseSeeder<
  T extends BaseEntity,
  CreateDTO extends BaseCreateDTO,
  UpdateDTO extends BaseUpdateDTO,
  R extends BaseRepository<T, CreateDTO, UpdateDTO>,
> {
  /**
   * @param service - The concrete service instance (e.g., UserService) for creation and validation.
   * @param mocks - An array of DTOs to be inserted or updated.
   * @param uniqueKey - The entity field used to determine existence (e.g., 'email', 'slug').
   */
  constructor(
    protected repository: R,
    protected mocks: CreateDTO[],
    protected uniqueKey?: keyof T
  ) {}

  /**
   * Compares the mock data against the existing entity data to check if an update is required.
   * Performs a shallow comparison on all keys present in the mock data.
   * @param mockData - The new data DTO.
   * @param existingEntity - The current entity from the database.
   * @returns true if the data differs and an update is needed, false otherwise.
   */
  protected areDataDifferent(mockData: CreateDTO, existingEntity: T): boolean {
    const mockKeys = Object.keys(mockData) as Array<keyof CreateDTO>;

    for (const key of mockKeys) {
      if (key === 'password') {
        continue;
      }
      if (
        // Check if key exists in the entity and if the values are not strictly equal
        key in existingEntity &&
        (mockData as any)[key] !== (existingEntity as any)[key]
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Main method to run the seeding process.
   * Implements the core upsert logic: check existence -> compare data -> update/create.
   */
  public async run(): Promise<void> {
    const uniqueKeyValue = (mock: CreateDTO) => (mock as any)[this.uniqueKey];
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
              mock as unknown as UpdateDTO
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
          await this.repository.create(mock);
          console.log(`[CREATED] Entity ${uniqueKeyName}:${mock}`);
        }
      } else {
        // Does not exist: Create new entity
        await this.repository.create(mock);
        console.log(`[CREATED] Entity ${uniqueKeyName}:${mock}`);
      }
    }
  }
}
