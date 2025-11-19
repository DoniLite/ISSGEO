/** biome-ignore-all lint/correctness/useHookAtTopLevel: - */
import type { BaseStore, PaginatedStore } from "../base.store";
import { useStoreAsyncOperations } from "@/lib/table/hooks/store/useStoreAsyncOperations";
import { apiClient } from "@/hooks/fetch-api";
import {
	useTableServerPaginationHandler,
	type FetchAllDataOptions,
} from "@/lib/table/hooks/useTableServerPaginationHandler";
import type { KeyCompetencyTableType } from "@/db";
import type { PaginationQuery } from "@/lib/interfaces/pagination";
import { useCallback } from "react";
import type {
	CreateKeyCompetencyDTO,
	UpdateKeyCompetencyDTO,
} from "@/api/formations/DTO/keyCompetency.dto";

interface KeyCompetencyStore extends BaseStore {
	create: (
		data: CreateKeyCompetencyDTO,
	) => Promise<KeyCompetencyTableType | undefined>;
	deleteOne: (id: string) => Promise<void>;
	deleteMultiple: (ids: string[]) => Promise<void>;
	update: (id: string, data: UpdateKeyCompetencyDTO) => Promise<void>;
	fetchAll: (
		query?: Record<string, unknown>,
		options?: FetchAllDataOptions,
	) => Promise<KeyCompetencyTableType[] | undefined>;
}

export default function useKeyCompetencyStore(): KeyCompetencyStore &
	PaginatedStore<KeyCompetencyTableType> {
	const { loading, error, withAsyncOperation, resetState } =
		useStoreAsyncOperations();

	const refetchFunction = useCallback(async (query: PaginationQuery) => {
		const res = await apiClient.call(
			"courses",
			"/courses/key-competency",
			"GET",
			{
				params: query,
			},
		);
		return res.data;
	}, []);

	const fetchAll = useCallback(async (query?: PaginationQuery) => {
		const { data } = await apiClient.call(
			"courses",
			"/courses/key-competency/all",
			"GET",
			{
				params: query,
			},
		);
		return data;
	}, []);

	const paginationHandler = useTableServerPaginationHandler<
		KeyCompetencyTableType,
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

	const create = withAsyncOperation(async (data: CreateKeyCompetencyDTO) => {
		const res = await apiClient.call(
			"courses",
			"/courses/key-competency",
			"POST",
			{
				body: data,
			},
		);
		const newCompetency = res.data;
		paginationHandler.handlePostCreate(newCompetency);
		return newCompetency;
	});

	const update = withAsyncOperation(
		async (id: string, data: UpdateKeyCompetencyDTO) => {
			const res = await apiClient.call(
				"courses",
				"/courses/key-competency/:id",
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
		await apiClient.call("courses", "/courses/key-competency/:id", "DELETE", {
			params: { id },
		});

		paginationHandler.handleBulkDelete([id]);
	});

	const deleteMultiple = withAsyncOperation(async (ids: string[]) => {
		await apiClient.call("courses", "/courses/key-competency", "DELETE", {
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
			description: "",
			icon: "",
		},
		translationPath: "admin.key_competency",

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
