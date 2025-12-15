import type { BaseStore, PaginatedStore } from "./base.store";
import { useStoreAsyncOperations } from "@/lib/table/hooks/store/useStoreAsyncOperations";
import { apiClient } from "@/lib/fetch-api";
import { useTableServerPaginationHandler } from "@/lib/table/hooks/useTableServerPaginationHandler";
import type { UserTableType } from "@/db";
import type { PaginationQuery } from "@/lib/interfaces/pagination";
import { useCallback } from "react";
import type { CreateUserDto, UpdateUserDto } from "@/api/user";
import type { EntityStatistics } from "@/core/base.repository";

interface UsersStore extends BaseStore {
	create: (data: CreateUserDto) => Promise<void>;
	deleteOne: (id: string) => Promise<void>;
	deleteMultiple: (ids: string[]) => Promise<void>;
	update: (id: string, data: UpdateUserDto) => Promise<void>;
	stats: () => Promise<EntityStatistics | undefined>;
}

export default function useUsersStore(): UsersStore &
	PaginatedStore<UserTableType> {
	const { loading, error, withAsyncOperation, resetState } =
		useStoreAsyncOperations();

	const refetchFunction = useCallback(async (query: PaginationQuery) => {
		const res = await apiClient.call("users", "/users", "GET", {
			params: query,
		});
		return res.data;
	}, []);

	const paginationHandler = useTableServerPaginationHandler<
		UserTableType,
		PaginationQuery
	>({
		refetchFunction,
	});

	const fetchData = withAsyncOperation(
		async (newQuery: Partial<PaginationQuery> = {}) => {
			await paginationHandler.fetchData(newQuery);
		},
	);

	const create = withAsyncOperation(async (data: CreateUserDto) => {
		const res = await apiClient.call("users", "/users", "POST", {
			body: data,
		});
		const newJob = res.data;
		paginationHandler.handlePostCreate(newJob);
	});

	const update = withAsyncOperation(async (id: string, data: UpdateUserDto) => {
		const res = await apiClient.call("users", "/users/:id", "PATCH", {
			body: data,
			params: { id },
		});
		if (res.status >= 200 && res.status < 300) {
			paginationHandler.handlePostUpdatePartial(id, data);
		}
	});

	const deleteOne = withAsyncOperation(async (id: string) => {
		await apiClient.call("users", "/users/:id", "DELETE", {
			params: { id },
		});

		paginationHandler.handleBulkDelete([id]);
	});

	const deleteMultiple = withAsyncOperation(async (ids: string[]) => {
		await apiClient.call("users", "/users", "DELETE", {
			body: { ids },
		});

		paginationHandler.handleBulkDelete(ids);
	});

	const goToPage = withAsyncOperation(async (page: number) => {
		await paginationHandler.goToPage(page);
	});

	const updatePageSize = withAsyncOperation(async (pageSize: number) => {
		await paginationHandler.updatePageSize(pageSize);
	});

	const updateFilters = withAsyncOperation(
		async (filters: Partial<PaginationQuery>) => {
			await paginationHandler.updateFilters(filters);
		},
	);

	const stats = withAsyncOperation(async () => {
		const { data } = await apiClient.call("users", "/users/stats", "GET");
		return data;
	});

	return {
		loading,
		error,
		resetState,
		items: paginationHandler.items,
		allItems: paginationHandler.allItems,
		query: paginationHandler.query,
		pagination: paginationHandler.pagination,
		defaultEntity: { email: "", password: "" },
		translationPath: "admin.users",

		fetchData,
		create,
		deleteOne,
		stats,
		deleteMultiple,
		update,
		goToPage,
		updateFilters,
		updatePageSize,
		resetFilters: paginationHandler.resetFilters,
	};
}
