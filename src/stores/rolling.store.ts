import type { BaseStore, PaginatedStore } from "./base.store";
import { useStoreAsyncOperations } from "@/lib/table/hooks/store/useStoreAsyncOperations";
import { apiClient } from "@/lib/fetch-api";
import {
	useTableServerPaginationHandler,
	type FetchAllDataOptions,
} from "@/lib/table/hooks/useTableServerPaginationHandler";
import type { ModuleTableType, RollingTableType } from "@/db";
import type { PaginationQuery } from "@/lib/interfaces/pagination";
import { useCallback } from "react";
import type { CreateRollingDTO } from "@/api/rolling";

interface RollingStore extends BaseStore {
	create: (data: CreateRollingDTO, moduleIds: string[]) => Promise<void>;
	deleteOne: (id: string) => Promise<void>;
	fetchAll: (
		query?: Record<string, unknown>,
		options?: FetchAllDataOptions,
	) => Promise<
		(RollingTableType & { modules: ModuleTableType[] })[] | undefined
	>;
}

export default function useRollingStore(): RollingStore &
	PaginatedStore<RollingTableType & { modules: ModuleTableType[] }> {
	const { loading, error, withAsyncOperation, resetState } =
		useStoreAsyncOperations();

	const refetchFunction = useCallback(async (query: PaginationQuery) => {
		const res = await apiClient.call("rolling", "/rolling", "GET", {
			params: query,
		});
		return res.data;
	}, []);

	const fetchAll = useCallback(async (query?: PaginationQuery) => {
		const { data } = await apiClient.call("rolling", "/rolling/all", "GET", {
			params: query,
		});
		return data;
	}, []);

	const paginationHandler = useTableServerPaginationHandler<
		RollingTableType & { modules: ModuleTableType[] },
		PaginationQuery
	>({
		refetchFunction,
		fetchAll,
	});

	const fetchData = withAsyncOperation(
		async (newQuery: Partial<PaginationQuery> = {}) => {
			await paginationHandler.fetchData(newQuery);
		},
	);

	const create = withAsyncOperation(
		async (data: CreateRollingDTO, moduleIds: string[]) => {
			const ids = moduleIds.map((m) => m.trim()).join(",");
			const res = await apiClient.call("rolling", "/rolling", "POST", {
				body: data,
				params: { ids },
				forceQueries: true,
			});
			const newRolling = res.data;
			paginationHandler.handlePostCreate({ ...newRolling, modules: [] });
		},
	);

	const deleteOne = withAsyncOperation(async (id: string) => {
		await apiClient.call("rolling", "/rolling/:id", "DELETE", {
			params: { id },
		});

		paginationHandler.handleBulkDelete([id]);
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

	return {
		loading,
		error,
		resetState,
		items: paginationHandler.items,
		allItems: paginationHandler.allItems,
		query: paginationHandler.query,
		pagination: paginationHandler.pagination,
		defaultEntity: { name: "", contact: "", modules: [] },
		translationPath: "admin.rolling",

		fetchData,
		fetchAll: paginationHandler.fetchAllData,
		create,
		deleteOne,
		goToPage,
		updateFilters,
		updatePageSize,
		resetFilters: paginationHandler.resetFilters,
	};
}
