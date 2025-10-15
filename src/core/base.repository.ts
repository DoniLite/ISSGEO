/** biome-ignore-all lint/suspicious/noExplicitAny: Type inference for all the any definition isn't applicable with an easy way */
import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import type {
	PgInsertValue,
	PgTable,
	PgTableWithColumns,
	PgUpdateSetSource,
} from "drizzle-orm/pg-core";
import { DatabaseConnection } from "./database";
import type { BaseEntity, BaseTable, CrudOperations } from "./types/base";
import type {
	PaginatedResponse,
	PaginationQuery,
	SortOrder,
} from "@/lib/interfaces/pagination";

export abstract class BaseRepository<
	T extends BaseEntity,
	CreateDTO extends PgInsertValue<Tb>,
	UpdateDTO extends PgUpdateSetSource<Tb>,
	Tb extends PgTableWithColumns<BaseTable> = PgTableWithColumns<BaseTable>,
> implements CrudOperations<T, CreateDTO, UpdateDTO>
{
	protected db = DatabaseConnection.getInstance().getDatabase();
	protected abstract table: Tb;

	async create(dto: CreateDTO): Promise<T> {
		const [result] = await this.db.insert(this.table).values(dto).returning();
		return result as unknown as T;
	}

	async findById(id: string | number): Promise<T | null> {
		const [result] = await this.db
			.select()
			.from(this.table as PgTable)
			.where(eq(this.table.id, id))
			.limit(1);
		return (result as T) || null;
	}

	async findPaginated(
		paginationQuery: PaginationQuery,
	): Promise<PaginatedResponse<T>> {
		const {
			page = 1,
			pageSize = 10,
			search,
			sortBy = "id",
			sortOrder = "asc" as SortOrder,
			filters = {},
		} = paginationQuery;

		// Validate pagination params
		const validPage = Math.max(1, page);
		const validPageSize = Math.max(1, pageSize);
		const offset = (validPage - 1) * validPageSize;

		let query = this.db.select().from(this.table as PgTable);
		const conditions: any[] = [];

		// Apply filters
		if (Object.keys(filters).length > 0) {
			for (const [key, value] of Object.entries(filters)) {
				if (value !== undefined) {
					if (Array.isArray(value)) {
						// Handle array filters (IN clause)
						conditions.push(eq((this.table as any)[key], value[0]));
					} else if (typeof value === "string" || typeof value === "number") {
						conditions.push(eq((this.table as any)[key], value));
					} else if (typeof value === "boolean") {
						conditions.push(eq((this.table as any)[key], value));
					}
				}
			}
		}

		// Apply search if provided
		if (search?.trim()) {
			const searchTerms = search.trim().split(" ").filter(Boolean);
			const searchConditions = searchTerms.flatMap((term) => {
				// Search across common text fields
				const textFields = [
					"name",
					"title",
					"description",
					"email",
					"username",
				];
				return textFields
					.map((field) => {
						const tableField = (this.table as any)[field];
						return tableField ? ilike(tableField, `%${term}%`) : null;
					})
					.filter(Boolean);
			}) as SQL[];

			if (searchConditions.length > 0) {
				conditions.push(or(...searchConditions));
			}
		}

		// Apply conditions
		if (conditions.length > 0) {
			query = query.where(and(...conditions)) as typeof query;
		}

		// Apply sorting
		const sortByField = (this.table as any)[sortBy];
		if (sortByField) {
			query = query.orderBy(
				sortOrder === "desc" ? desc(sortByField) : sortByField,
			) as typeof query;
		}

		// Get total count
		const countQuery = this.db
			.select({ count: count() })
			.from(this.table as PgTable);

		if (conditions.length > 0) {
			const countQueryWithFilters = await countQuery.where(and(...conditions));
			const totalCount = countQueryWithFilters[0]?.count;
			const itemCount = totalCount ?? 0;

			// Apply pagination
			const items = (await query.limit(validPageSize).offset(offset)) as T[];

			return {
				items,
				itemCount,
				page: validPage,
				pageSize: validPageSize,
				pageCount: Math.ceil(itemCount / validPageSize),
			};
		}

		const totalCount = (await countQuery)[0]?.count;
		const itemCount = totalCount ?? 0;

		// Apply pagination
		const items = (await query.limit(validPageSize).offset(offset)) as T[];

		return {
			items,
			itemCount,
			page: validPage,
			pageSize: validPageSize,
			pageCount: Math.ceil(itemCount / validPageSize),
		};
	}

	async findAll(filters?: Partial<T>): Promise<T[]> {
		const query = this.db.select().from(this.table as PgTable);

		if (filters) {
			const conditions = Object.entries(filters)
				.filter(([_, value]) => value !== undefined)
				.map(([key, value]) => eq((this.table as any)[key], value));

			if (conditions.length > 0) {
				const filteredQuery = query.where(and(...conditions));
				return filteredQuery as Promise<T[]>;
			}
		}

		return query as Promise<T[]>;
	}

	async findOne(filters?: Partial<T>): Promise<T> {
		const query = this.db.select().from(this.table as PgTable);

		if (filters) {
			const conditions = Object.entries(filters)
				.filter(([_, value]) => value !== undefined)
				.map(([key, value]) => eq((this.table as any)[key], value));

			if (conditions.length > 0) {
				const [result] = await query.where(and(...conditions)).limit(1);
				return result as T;
			}
		}

		const [queryResult] = await query;

		return queryResult as T;
	}

	async update(id: string | number, dto: UpdateDTO): Promise<T[] | null> {
		const result = await this.db
			.update(this.table)
			.set(dto)
			.where(eq(this.table.id, id))
			.returning();
		return (result as T[]) || null;
	}

	async delete(id: string | number): Promise<boolean> {
		const result = await this.db
			.delete(this.table)
			.where(eq(this.table.id, id));
		return result.rowCount ? result.rowCount > 0 : true;
	}

	async findBy<V>(field: keyof T, value: V): Promise<T[]> {
		return this.db
			.select()
			.from(this.table as PgTable)
			.where(eq((this.table as any)[field], value)) as Promise<T[]>;
	}

	async findOneBy<V>(field: keyof T, value: V): Promise<T | null> {
		const [result] = await this.db
			.select()
			.from(this.table as PgTable)
			.where(eq((this.table as any)[field], value))
			.limit(1);
		return (result as T) || null;
	}

	async count(filters?: Partial<T>): Promise<number> {
		const query = this.db.select().from(this.table as PgTable);

		if (filters) {
			const conditions = Object.entries(filters)
				.filter(([_, value]) => value !== undefined)
				.map(([key, value]) => eq((this.table as any)[key], value));

			if (conditions.length > 0) {
				const filteredQuery = await query.where(and(...conditions));
				return filteredQuery.length;
			}
		}

		const result = await query;
		return result.length;
	}

	async exists(id: string | number): Promise<boolean> {
		const result = await this.findById(id);
		return result !== null;
	}
}
