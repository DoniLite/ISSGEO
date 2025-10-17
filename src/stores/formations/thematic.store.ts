/** biome-ignore-all lint/correctness/useHookAtTopLevel: - */
import type { BaseStore, PaginatedStore } from '../base.store';
import { useStoreAsyncOperations } from '@/lib/table/hooks/store/useStoreAsyncOperations';
import { apiClient } from '@/hooks/api';
import { useTableServerPaginationHandler } from '@/lib/table/hooks/useTableServerPaginationHandler';
import type { ThematicTableType } from '@/db';
import type { PaginationQuery } from '@/lib/interfaces/pagination';
import { useCallback } from 'react';
import type {
  CreateThematicDTO,
  UpdateThematicDTO,
} from '@/api/formations/DTO/thematic.dto';

interface ThematicStore extends BaseStore {
  create: (data: CreateThematicDTO) => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
  deleteMultiple: (ids: string[]) => Promise<void>;
  update: (id: string, data: UpdateThematicDTO) => Promise<void>;
  fetchAll: (
    query?: Record<string, unknown>
  ) => Promise<ThematicTableType[] | undefined>;
}

export default function useThematicStoreStore(): ThematicStore &
  PaginatedStore<ThematicTableType> {
  const { loading, error, withAsyncOperation, resetState } =
    useStoreAsyncOperations();

  const refetchFunction = useCallback(async (query: PaginationQuery) => {
    const res = await apiClient.call('thematic', '/thematic', 'GET', {
      params: query,
    });
    return res.data;
  }, []);

  const paginationHandler = useTableServerPaginationHandler<
    ThematicTableType,
    PaginationQuery
  >({
    refetchFunction,
  });

  const fetchData = withAsyncOperation(
    async (newQuery: Partial<PaginationQuery> = {}) => {
      await paginationHandler.fetchData(newQuery);
    }
  );

  const create = withAsyncOperation(async (data: CreateThematicDTO) => {
    const res = await apiClient.call('thematic', '/thematic', 'POST', {
      body: data,
    });
    const newJob = res.data;
    paginationHandler.handlePostCreate(newJob);
  });

  const update = withAsyncOperation(
    async (id: string, data: UpdateThematicDTO) => {
      const res = await apiClient.call('thematic', '/thematic/:id', 'PATCH', {
        body: data,
        params: { id },
      });
      if (res.status >= 200 && res.status < 300) {
        paginationHandler.handlePostUpdatePartial(id, data);
      }
    }
  );

  const deleteOne = withAsyncOperation(async (id: string) => {
    await apiClient.call('thematic', '/thematic/:id', 'DELETE', {
      params: { id },
    });

    paginationHandler.handleBulkDelete([id]);
  });

  const deleteMultiple = withAsyncOperation(async (ids: string[]) => {
    await apiClient.call('thematic', '/thematic', 'DELETE', {
      body: { ids },
    });

    paginationHandler.handleBulkDelete(ids);
  });

  const fetchAll = withAsyncOperation(
    async (query?: Record<string, unknown>) => {
      const { data } = await apiClient.call('thematic', 'thematic/all', 'GET', {
        params: query,
      });
      return data;
    }
  );

  const goToPage = withAsyncOperation(async (page: number) => {
    await paginationHandler.goToPage(page);
  });

  const updatePageSize = withAsyncOperation(async (pageSize: number) => {
    await paginationHandler.updatePageSize(pageSize);
  });

  const updateFilters = withAsyncOperation(
    async (filters: Partial<PaginationQuery>) => {
      await paginationHandler.updateFilters(filters);
    }
  );

  return {
    loading,
    error,
    resetState,
    items: paginationHandler.items,
    allItems: paginationHandler.allItems,
    query: paginationHandler.query,
    pagination: paginationHandler.pagination,
    defaultEntity: { name: '', icon: '' },
    translationPath: 'admin.thematic',

    fetchData,
    create,
    deleteOne,
    deleteMultiple,
    update,
    goToPage,
    updateFilters,
    updatePageSize,
    fetchAll,
    resetFilters: paginationHandler.resetFilters,
  };
}
