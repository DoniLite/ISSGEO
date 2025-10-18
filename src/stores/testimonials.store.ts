/** biome-ignore-all lint/correctness/useHookAtTopLevel: - */
import type { BaseStore, PaginatedStore } from './base.store';
import { useStoreAsyncOperations } from '@/lib/table/hooks/store/useStoreAsyncOperations';
import { apiClient } from '@/hooks/api';
import { useTableServerPaginationHandler } from '@/lib/table/hooks/useTableServerPaginationHandler';
import type { TestimonialsTableType } from '@/db';
import type { PaginationQuery } from '@/lib/interfaces/pagination';
import type { CreateTestimonialDTO } from '@/api/testimonials';
import { useCallback } from 'react';
import type { EntityStatistics } from '@/core/base.repository';

interface TestimonialStore extends BaseStore {
  create: (data: CreateTestimonialDTO) => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
  stats: () => Promise<EntityStatistics | undefined>;
}

export default function useTestimonialStore(): TestimonialStore &
  PaginatedStore<TestimonialsTableType> {
  const { loading, error, withAsyncOperation, resetState } =
    useStoreAsyncOperations();

  const refetchFunction = useCallback(async (query: PaginationQuery) => {
    const res = await apiClient.call('testimonials', '/testimonials', 'GET', {
      params: query,
    });
    return res.data;
  }, []);

  const paginationHandler = useTableServerPaginationHandler<
    TestimonialsTableType,
    PaginationQuery
  >({
    refetchFunction,
  });

  const fetchData = withAsyncOperation(
    async (newQuery: Partial<PaginationQuery> = {}) => {
      await paginationHandler.fetchData(newQuery);
    }
  );

  const create = withAsyncOperation(async (data: CreateTestimonialDTO) => {
    const res = await apiClient.call('testimonials', '/testimonials', 'POST', {
      body: data,
    });
    const newContact = res.data;
    paginationHandler.handlePostCreate(newContact);
  });

  const deleteOne = withAsyncOperation(async (id: string) => {
    await apiClient.call('testimonials', '/testimonials/:id', 'DELETE', {
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

  const stats = withAsyncOperation(async () => {
    const { data } = await apiClient.call(
      'testimonials',
      '/testimonials/stats',
      'GET'
    );
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
    defaultEntity: { name: '' },
    translationPath: 'admin.testimonials',

    fetchData,
    create,
    stats,
    deleteOne,
    goToPage,
    updateFilters,
    updatePageSize,
    resetFilters: paginationHandler.resetFilters,
  };
}
