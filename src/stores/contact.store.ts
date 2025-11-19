/** biome-ignore-all lint/correctness/useHookAtTopLevel: - */
import type { BaseStore, PaginatedStore } from "./base.store";
import { useStoreAsyncOperations } from "@/lib/table/hooks/store/useStoreAsyncOperations";
import { apiClient } from "@/hooks/fetch-api";
import { useTableServerPaginationHandler } from "@/lib/table/hooks/useTableServerPaginationHandler";
import type { ContactTableType } from "@/db";
import type { PaginationQuery } from "@/lib/interfaces/pagination";
import type { CreateContactDTO } from "@/api/contact";
import { useCallback } from "react";
import type { EntityStatistics } from "@/core/base.repository";

interface ContactStore extends BaseStore {
	create: (data: CreateContactDTO) => Promise<void>;
	deleteOne: (id: string) => Promise<void>;
	deleteMultiple: (ids: string[]) => Promise<void>;
	stats: () => Promise<EntityStatistics | undefined>;
}

export default function useContactStore(): ContactStore &
	PaginatedStore<ContactTableType> {
	const { loading, error, withAsyncOperation, resetState } =
		useStoreAsyncOperations();

	const refetchFunction = useCallback(async (query: PaginationQuery) => {
		const res = await apiClient.call("contact", "/contact", "GET", {
			params: query,
		});
		return res.data;
	}, []);

	const paginationHandler = useTableServerPaginationHandler<
		ContactTableType,
		PaginationQuery
	>({
		refetchFunction,
	});

	const fetchData = withAsyncOperation(
		async (newQuery: Partial<PaginationQuery> = {}) => {
			await paginationHandler.fetchData(newQuery);
		},
	);

	const create = withAsyncOperation(async (data: CreateContactDTO) => {
		const res = await apiClient.call("contact", "/contact", "POST", {
			body: data,
		});
		const newContact = res.data;
		paginationHandler.handlePostCreate(newContact);
	});

	const deleteOne = withAsyncOperation(async (id: string) => {
		await apiClient.call("contact", "/contact/:id", "DELETE", {
			params: { id },
		});

		await paginationHandler.handleBulkDelete([id]);
	});

	const deleteMultiple = withAsyncOperation(async (ids: string[]) => {
		await apiClient.call("contact", "/contact", "DELETE", {
			body: { ids },
		});

		await paginationHandler.handleBulkDelete(ids);
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
		const { data } = await apiClient.call("contact", "/contact/stats", "GET");
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
		defaultEntity: {
			name: "",
			email: "",
			message: "",
		},
		translationPath: "admin.contact",

		fetchData,
		stats,
		create,
		deleteOne,
		deleteMultiple,
		goToPage,
		updateFilters,
		updatePageSize,
		resetFilters: paginationHandler.resetFilters,
	};
}
