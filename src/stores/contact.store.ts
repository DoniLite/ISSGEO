/** biome-ignore-all lint/correctness/useHookAtTopLevel: - */
import type { BaseStore, PaginatedStore } from './base.store';
import { useStoreAsyncOperations } from '@/lib/table/hooks/store/useStoreAsyncOperations';
import { apiClient } from '@/hooks/api';
import { useTableServerPaginationHandler } from '@/lib/table/hooks/useTableServerPaginationHandler';
import type { ContactTableType } from '@/db';
import type { PaginationQuery } from '@/lib/interfaces/pagination';
import type { CreateContactDTO } from '@/api/contact';
import { useCallback } from 'react';

interface ContactStore extends BaseStore {
  create: (data: CreateContactDTO) => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
}

export default function useContactStore(): ContactStore &
  PaginatedStore<ContactTableType> {
  const { loading, error, withAsyncOperation, resetState } =
    useStoreAsyncOperations();

  const refetchFunction = useCallback(async (query: PaginationQuery) => {
    const res = await apiClient.call('contact', '/contact', 'GET', {
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
    }
  );

  const create = withAsyncOperation(async (data: CreateContactDTO) => {
    const res = await apiClient.call('contact', '/contact', 'POST', {
      body: data,
    });
    const newContact = res.data;
    paginationHandler.handlePostCreate(newContact);
  });

  const deleteOne = withAsyncOperation(async (id: string) => {
    await apiClient.call('contact', '/contact', 'DELETE', {
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
    }
  );

  return {
    loading,
    error,
    reset: resetState,
    items: paginationHandler.items,
    allItems: paginationHandler.allItems,
    query: paginationHandler.query,
    pagination: paginationHandler.pagination,

    fetchData,
    create,
    deleteOne,
    goToPage,
    updateFilters,
    updatePageSize,
    resetFilters: paginationHandler.resetFilters,
  };
}
