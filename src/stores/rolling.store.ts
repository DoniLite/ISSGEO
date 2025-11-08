/** biome-ignore-all lint/correctness/useHookAtTopLevel: - */
import type { BaseStore, PaginatedStore } from './base.store';
import { useStoreAsyncOperations } from '@/lib/table/hooks/store/useStoreAsyncOperations';
import { apiClient } from '@/hooks/fetch-api';
import { useTableServerPaginationHandler } from '@/lib/table/hooks/useTableServerPaginationHandler';
import type { RollingTableType } from '@/db';
import type { PaginationQuery } from '@/lib/interfaces/pagination';
import { useCallback } from 'react';
import type { CreateRollingDTO } from '@/api/rolling';

interface RollingStore extends BaseStore {
	create: (data: CreateRollingDTO, moduleIds: string[]) => Promise<void>;
	deleteOne: (id: string) => Promise<void>;
}

export default function useRollingStore(): RollingStore &
	PaginatedStore<RollingTableType> {
	const { loading, error, withAsyncOperation, resetState } =
		useStoreAsyncOperations();

	const refetchFunction = useCallback(async (query: PaginationQuery) => {
		const res = await apiClient.call('rolling', '/rolling', 'GET', {
			params: query,
		});
		return res.data;
	}, []);

	const paginationHandler = useTableServerPaginationHandler<
		RollingTableType,
		PaginationQuery
	>({
		refetchFunction,
	});

	const fetchData = withAsyncOperation(
		async (newQuery: Partial<PaginationQuery> = {}) => {
			await paginationHandler.fetchData(newQuery);
		},
	);

	const create = withAsyncOperation(
		async (data: CreateRollingDTO, moduleIds: string[]) => {
			const ids = moduleIds.map((m) => m.trim()).join(',');
			const res = await apiClient.call('rolling', '/rolling', 'POST', {
				body: data,
				params: { ids },
				forceQueries: true,
			});
			const newContact = res.data;
			paginationHandler.handlePostCreate(newContact);
		},
	);

	const deleteOne = withAsyncOperation(async (id: string) => {
		await apiClient.call('rolling', '/rolling/:id', 'DELETE', {
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
		defaultEntity: { name: '', contact: '' },
		translationPath: 'admin.rolling',

		fetchData,
		create,
		deleteOne,
		goToPage,
		updateFilters,
		updatePageSize,
		resetFilters: paginationHandler.resetFilters,
	};
}
