/** biome-ignore-all lint/correctness/useHookAtTopLevel: - */
import type { BaseStore, PaginatedStore } from "../base.store";
import { useStoreAsyncOperations } from "@/lib/table/hooks/store/useStoreAsyncOperations";
import { apiClient } from "@/hooks/fetch-api";
import { useTableServerPaginationHandler } from "@/lib/table/hooks/useTableServerPaginationHandler";
import type { TrainingSessionTableType, TrainingTableType } from "@/db";
import type { PaginationQuery } from "@/lib/interfaces/pagination";
import { useCallback } from "react";
import type {
	CreateSessionDTO,
	UpdateSessionDTO,
} from "@/api/formations/DTO/session.dto";

interface SessionStore extends BaseStore {
	create: (data: CreateSessionDTO) => Promise<void>;
	deleteOne: (id: string) => Promise<void>;
	deleteMultiple: (ids: string[]) => Promise<void>;
	update: (id: string, data: UpdateSessionDTO) => Promise<void>;
}

export default function useSessionStore(): SessionStore &
	PaginatedStore<TrainingSessionTableType> {
	const { loading, error, withAsyncOperation, resetState } =
		useStoreAsyncOperations();

	const refetchFunction = useCallback(async (query: PaginationQuery) => {
		const res = await apiClient.call("session", "/session", "GET", {
			params: query,
		});
		return res.data;
	}, []);

	const paginationHandler = useTableServerPaginationHandler<
		TrainingSessionTableType & { module: TrainingTableType | undefined },
		PaginationQuery
	>({
		refetchFunction,
	});

	const fetchData = withAsyncOperation(
		async (newQuery: Partial<PaginationQuery> = {}) => {
			await paginationHandler.fetchData(newQuery);
		},
	);

	const create = withAsyncOperation(async (data: CreateSessionDTO) => {
		const res = await apiClient.call("session", "/session", "POST", {
			body: data,
		});
		const newJob = res.data;
		paginationHandler.handlePostCreate({ ...newJob, module: undefined });
	});

	const update = withAsyncOperation(
		async (id: string, data: UpdateSessionDTO) => {
			const res = await apiClient.call("session", "/session/:id", "PATCH", {
				body: data,
				params: { id },
			});
			if (res.status >= 200 && res.status < 300) {
				paginationHandler.handlePostUpdatePartial(id, data);
			}
		},
	);

	const deleteOne = withAsyncOperation(async (id: string) => {
		await apiClient.call("session", "/session/:id", "DELETE", {
			params: { id },
		});

		paginationHandler.handleBulkDelete([id]);
	});

	const deleteMultiple = withAsyncOperation(async (ids: string[]) => {
		await apiClient.call("session", "/session", "DELETE", {
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
		defaultEntity: { startDate: "", location: "" },
		translationPath: "admin.session",

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
