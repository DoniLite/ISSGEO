import type { BaseStore, PaginatedStore } from "../base.store";
import { useStoreAsyncOperations } from "@/lib/table/hooks/store/useStoreAsyncOperations";
import { apiClient } from "@/lib/fetch-api";
import { useTableServerPaginationHandler } from "@/lib/table/hooks/useTableServerPaginationHandler";
import type { MasterTableType } from "@/db";
import type { PaginationQuery } from "@/lib/interfaces/pagination";
import { useCallback } from "react";
import type { CreateMasterDTO, UpdateMasterDTO } from "@/api/formations";

interface MasterStore extends BaseStore {
	create: (data: CreateMasterDTO) => Promise<void>;
	deleteOne: (id: string) => Promise<void>;
	deleteMultiple: (ids: string[]) => Promise<void>;
	update: (id: string, data: UpdateMasterDTO) => Promise<void>;
}

export default function useMasterStore(): MasterStore &
	PaginatedStore<MasterTableType> {
	const { loading, error, withAsyncOperation, resetState } =
		useStoreAsyncOperations();

	const refetchFunction = useCallback(async (query: PaginationQuery) => {
		const res = await apiClient.call("master", "/master", "GET", {
			params: query,
		});
		return res.data;
	}, []);

	const paginationHandler = useTableServerPaginationHandler<
		MasterTableType,
		PaginationQuery
	>({
		refetchFunction,
	});

	const fetchData = withAsyncOperation(
		async (newQuery: Partial<PaginationQuery> = {}) => {
			await paginationHandler.fetchData(newQuery);
		},
	);

	const create = withAsyncOperation(async (data: CreateMasterDTO) => {
		const res = await apiClient.call("master", "/master", "POST", {
			body: data,
		});
		const newJob = res.data;
		paginationHandler.handlePostCreate(newJob);
	});

	const update = withAsyncOperation(
		async (id: string, data: UpdateMasterDTO) => {
			const res = await apiClient.call("master", "/master/:id", "PATCH", {
				body: data,
				params: { id },
			});
			if (res.status >= 200 && res.status < 300) {
				paginationHandler.handlePostUpdatePartial(id, data);
			}
		},
	);

	const deleteOne = withAsyncOperation(async (id: string) => {
		await apiClient.call("master", "/master/:id", "DELETE", {
			params: { id },
		});

		paginationHandler.handleBulkDelete([id]);
	});

	const deleteMultiple = withAsyncOperation(async (ids: string[]) => {
		await apiClient.call("master", "/master", "DELETE", {
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
		defaultEntity: { name: "", image: "", socials: {} },
		translationPath: "admin.master",

		fetchData,
		create,
		deleteOne,
		deleteMultiple,
		update,
		goToPage,
		updateFilters,
		updatePageSize,
		resetFilters: paginationHandler.resetFilters,
	};
}
