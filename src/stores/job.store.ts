/** biome-ignore-all lint/correctness/useHookAtTopLevel: - */
import type { BaseStore, PaginatedStore } from "./base.store";
import { useStoreAsyncOperations } from "@/lib/table/hooks/store/useStoreAsyncOperations";
import { apiClient } from "@/hooks/fetch-api";
import { useTableServerPaginationHandler } from "@/lib/table/hooks/useTableServerPaginationHandler";
import type { JobOfferTableType } from "@/db";
import type { PaginationQuery } from "@/lib/interfaces/pagination";
import type { CreateJobDTO, UpdateJobDTO } from "@/api/job";
import { useCallback } from "react";

interface JobStore extends BaseStore {
	create: (data: CreateJobDTO) => Promise<void>;
	deleteOne: (id: string) => Promise<void>;
	deleteMultiple: (ids: string[]) => Promise<void>;
	update: (id: string, data: UpdateJobDTO) => Promise<void>;
}

export default function useJobStore(): JobStore &
	PaginatedStore<JobOfferTableType> {
	const { loading, error, withAsyncOperation, resetState } =
		useStoreAsyncOperations();

	const refetchFunction = useCallback(async (query: PaginationQuery) => {
		const res = await apiClient.call("job", "/job", "GET", {
			params: query,
		});
		return res.data;
	}, []);

	const paginationHandler = useTableServerPaginationHandler<
		JobOfferTableType,
		PaginationQuery
	>({
		refetchFunction,
	});

	const fetchData = withAsyncOperation(
		async (newQuery: Partial<PaginationQuery> = {}) => {
			await paginationHandler.fetchData(newQuery);
		},
	);

	const create = withAsyncOperation(async (data: CreateJobDTO) => {
		const res = await apiClient.call("job", "/job", "POST", {
			body: data,
		});
		const newJob = res.data;
		paginationHandler.handlePostCreate(newJob);
	});

	const update = withAsyncOperation(async (id: string, data: UpdateJobDTO) => {
		const res = await apiClient.call("job", "/job/:id", "PATCH", {
			body: data,
			params: { id },
		});
		if (res.status >= 200 && res.status < 300) {
			paginationHandler.handlePostUpdatePartial(id, data);
		}
	});

	const deleteOne = withAsyncOperation(async (id: string) => {
		await apiClient.call("job", "/job/:id", "DELETE", {
			params: { id },
		});

		paginationHandler.handleBulkDelete([id]);
	});

	const deleteMultiple = withAsyncOperation(async (ids: string[]) => {
		await apiClient.call("job", "/job", "DELETE", {
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
		defaultEntity: { title: "", location: "" },
		translationPath: "admin.job",

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
