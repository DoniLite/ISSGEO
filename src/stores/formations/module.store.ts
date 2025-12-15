import type { BaseStore, PaginatedStore } from "../base.store";
import { useStoreAsyncOperations } from "@/lib/table/hooks/store/useStoreAsyncOperations";
import { apiClient } from "@/lib/fetch-api";
import {
	useTableServerPaginationHandler,
	type FetchAllDataOptions,
} from "@/lib/table/hooks/useTableServerPaginationHandler";
import type { ModuleTableType } from "@/db";
import type { PaginationQuery } from "@/lib/interfaces/pagination";
import { useCallback } from "react";
import type {
	CreateModuleTDO,
	UpdateModuleDTO,
} from "@/api/formations/DTO/modules.dto";

interface ModuleStore extends BaseStore {
	create: (data: CreateModuleTDO) => Promise<ModuleTableType | undefined>;
	deleteOne: (id: string) => Promise<void>;
	deleteMultiple: (ids: string[]) => Promise<void>;
	update: (id: string, data: UpdateModuleDTO) => Promise<void>;
	fetchAll: (
		query?: Record<string, unknown>,
		options?: FetchAllDataOptions,
	) => Promise<ModuleTableType[] | undefined>;
}

export default function useModuleStore(): ModuleStore &
	PaginatedStore<ModuleTableType> {
	const { loading, error, withAsyncOperation, resetState } =
		useStoreAsyncOperations();

	const refetchFunction = useCallback(async (query: PaginationQuery) => {
		const res = await apiClient.call("courses", "/courses/module", "GET", {
			params: query,
		});
		return res.data;
	}, []);

	const fetchAll = useCallback(async (query?: PaginationQuery) => {
		const { data } = await apiClient.call(
			"courses",
			"/courses/module/all",
			"GET",
			{
				params: query,
			},
		);
		return data;
	}, []);

	const paginationHandler = useTableServerPaginationHandler<
		ModuleTableType,
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

	const create = withAsyncOperation(async (data: CreateModuleTDO) => {
		const res = await apiClient.call("courses", "/courses/module", "POST", {
			body: data,
		});
		const newModule = res.data;
		paginationHandler.handlePostCreate(newModule);
		return newModule;
	});

	const update = withAsyncOperation(
		async (id: string, data: UpdateModuleDTO) => {
			const res = await apiClient.call(
				"courses",
				"/courses/module/:id",
				"PATCH",
				{
					body: data,
					params: { id },
				},
			);
			if (res.status >= 200 && res.status < 300) {
				paginationHandler.handlePostUpdatePartial(id, data);
			}
		},
	);

	const deleteOne = withAsyncOperation(async (id: string) => {
		await apiClient.call("courses", "/courses/module/:id", "DELETE", {
			params: { id },
		});

		paginationHandler.handleBulkDelete([id]);
	});

	const deleteMultiple = withAsyncOperation(async (ids: string[]) => {
		await apiClient.call("courses", "/courses/module", "DELETE", {
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

	return {
		loading,
		error,
		resetState,
		items: paginationHandler.items,
		allItems: paginationHandler.allItems,
		query: paginationHandler.query,
		pagination: paginationHandler.pagination,
		defaultEntity: {
			title: "",
			duration: 0,
			price: 0,
		},
		translationPath: "admin.module",

		fetchData,
		create,
		deleteOne,
		deleteMultiple,
		update,
		goToPage,
		updateFilters,
		updatePageSize,
		fetchAll: paginationHandler.fetchAllData,
		resetFilters: paginationHandler.resetFilters,
	};
}
