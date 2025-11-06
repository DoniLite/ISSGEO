import type { Context } from "hono";
import type { BaseRepository, EntityStatistics } from "./base.repository";
import { ValidateDTO } from "./decorators";
import type { BaseEntity } from "./types/base";
import type {
	PaginatedResponse,
	PaginationQuery,
} from "@/lib/interfaces/pagination";

export abstract class BaseService<
	T extends BaseEntity,
	CreateDTO extends object,
	UpdateDTO extends object,
	// biome-ignore lint/suspicious/noExplicitAny: <>
	Repository extends BaseRepository<T, CreateDTO, UpdateDTO, any, any> = BaseRepository<T, CreateDTO, UpdateDTO>,
	R extends T = T,
> {
	constructor(protected repository: Repository) {}
	/**
	 * Creates a new entity.
	 * @param dto - The data transfer object for creating the entity.
	 * @param _context - The Hono context, required for validation.
	 */
	@ValidateDTO()
	async create(dto: CreateDTO, _context: Context): Promise<T> {
		return this.repository.create(dto);
	}

	async findById(id: string | number): Promise<T | null> {
		return this.repository.findById(id);
	}

	async findAll(filters?: Partial<T>): Promise<T[]> {
		return this.repository.findAll(filters);
	}

	async findPaginated(query: PaginationQuery): Promise<PaginatedResponse<R>> {
		return this.repository.findPaginated(query);
	}

	@ValidateDTO()
	async update(
		id: string | number,
		dto: UpdateDTO,
		_context: Context,
	): Promise<T[] | null> {
		const exists = await this.repository.exists(id);
		if (!exists) {
			throw new Error(`Entity with id ${id} not found`);
		}
		return this.repository.update(id, dto);
	}

	async delete(id: string | number): Promise<boolean> {
		const exists = await this.repository.exists(id);
		if (!exists) {
			throw new Error(`Entity with id ${id} not found`);
		}
		return this.repository.delete(id);
	}

	/**
	 * Delete multiple entities by their IDs
	 * @param ids - Array of entity IDs to delete
	 * @returns Object with deleted count and failed IDs
	 */
	async deleteMultiple(ids: (string | number)[]): Promise<{
		deletedCount: number;
		requestedCount: number;
		success: boolean;
	}> {
		if (ids.length === 0) {
			return {
				deletedCount: 0,
				requestedCount: 0,
				success: true,
			};
		}

		const deletedCount = await this.repository.deleteMultiple(ids);

		return {
			deletedCount,
			requestedCount: ids.length,
			success: deletedCount === ids.length,
		};
	}

	async findBy<V>(field: keyof T, value: V): Promise<T[]> {
		return this.repository.findBy(field, value);
	}

	async findOneBy<V>(field: keyof T, value: V): Promise<T | null> {
		return this.repository.findOneBy(field, value);
	}

	async count(filters?: Partial<T>): Promise<number> {
		return this.repository.count(filters);
	}

	async exists(id: string | number): Promise<boolean> {
		return this.repository.exists(id);
	}

	/**
	 * Get statistics for the entity
	 * @returns EntityStatistics with monthly, weekly, and yearly data
	 */
	async getStatistics(): Promise<EntityStatistics> {
		return this.repository.getStatistics();
	}
}
