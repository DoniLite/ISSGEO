import {
  PAGINATION_DEFAULT_PAGE_SIZE,
  type PaginatedResponse,
  type PaginationQuery,
} from '@/lib/interfaces/pagination';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface TableServerPaginationHandlerOptions<
  T,
  Q extends PaginationQuery = PaginationQuery,
> {
  initialPageSize?: number;
  initialQuery?: Partial<Q>;
  refetchFunction: (query: Q) => Promise<PaginatedResponse<T>>;
}
export interface FetchAllDataOptions {
  force?: boolean;
}

/**
 * Independent composable for handling pagination state and CRUD operations
 * Manages its own refs and provides computed values for stores to use
 */
export function useTableServerPaginationHandler<
  T extends { id?: string },
  Q extends PaginationQuery = PaginationQuery,
>(options: TableServerPaginationHandlerOptions<T, Q>) {
  const {
    initialPageSize = PAGINATION_DEFAULT_PAGE_SIZE,
    initialQuery = {},
    refetchFunction,
  } = options;

  // Internal refs managed by this composable
  const [items, setItems] = useState<T[]>([]);
  const itemsRef = useRef<T[]>(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const [allItems, setAllItems] = useState<T[]>([]);
  const allItemsRef = useRef<T[]>(allItems);
  useEffect(() => {
    allItemsRef.current = allItems;
  }, [allItems]);

  const [pagination, setPagination] = useState<
    Pick<PaginatedResponse<T>, 'itemCount' | 'page' | 'pageSize' | 'pageCount'>
  >({
    itemCount: 0,
    page: 1,
    pageSize: initialPageSize,
    pageCount: 0,
  });
  const paginationRef = useRef(pagination);

  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  const [query, setQuery] = useState<Q>({
    page: 1,
    pageSize: initialPageSize,
    ...initialQuery,
  } as Q);
  const queryRef = useRef<Q>(query);

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  const _setAllItems = useCallback((itemsToAdd: T[]) => {
    setAllItems((prev) =>
      [...itemsToAdd, ...prev].filter(
        (x: T, i, self: T[]) => self.findIndex((item) => item.id === x.id) === i
      )
    );
  }, []);

  /**
   * Fetches data using the provided refetch function and updates internal state
   */
  const fetchData = useCallback(
    async (newQuery: Partial<Q> = {}): Promise<PaginatedResponse<T>> => {
      // Merge query immutably and keep ref updated
      const mergedQuery = { ...(queryRef.current as Q), ...newQuery } as Q;
      setQuery(mergedQuery);
      queryRef.current = mergedQuery;

      const response = await refetchFunction(mergedQuery);

      setItems(response.items);
      setPagination({
        itemCount: response.itemCount,
        page: response.page,
        pageSize: response.pageSize,
        pageCount: response.pageCount,
      });

      return response;
    },
    [refetchFunction]
  );

  /**
   * Fetches data using the provided refetch function and updates internal state
   */
  const fetchAllData = useCallback(
    async (
      newQuery: Partial<Q> = {},
      options: FetchAllDataOptions = { force: false }
    ): Promise<T[]> => {
      const { filters, ...restQuery } = newQuery;
      if (!allItemsRef.current.length || options.force) {
        const response = await refetchFunction({
          ...(restQuery as Q),
          ...(filters as Record<string, unknown>),
          pageSize: -1,
        } as Q);
        _setAllItems(response.items);
        return response.items;
      }
      return allItemsRef.current;
    },
    [refetchFunction, _setAllItems]
  );

  /**
   * Handles pagination state after creating or updating an item
   * Adds the item to the beginning of the list and maintains page size
   */
  const handlePostCreate = useCallback((newItem: T) => {
    setItems((prev) => {
      const next = [newItem, ...prev];
      const { pageSize } = paginationRef.current;
      return next.length > pageSize ? next.slice(0, pageSize) : next;
    });

    setPagination((prev) => ({
      ...prev,
      itemCount: prev.itemCount + 1,
      pageCount: Math.ceil((prev.itemCount + 1) / prev.pageSize),
    }));
  }, []);

  /**
   * Handles pagination state after updating an existing item
   * Updates the item in place if it exists in the current page
   */
  const handlePostUpdate = useCallback((updatedItem: T) => {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.id === updatedItem.id);
      if (index === -1) {
        return prev;
      }
      const newItems = [...prev];
      newItems[index] = {
        ...updatedItem,
      } as T;
      return newItems;
    });
  }, []);

  /**
   * Handles pagination state after updating an existing item
   * Updates the item partially in place if it exists in the current page
   */
  const handlePostUpdatePartial = useCallback(
    (id: T['id'], partialUpdatedItem: Partial<T>): Partial<T> => {
      setItems((prev) => {
        const index = prev.findIndex((item) => item.id === id);
        if (index === -1) {
          return prev;
        }
        const newItems = [...prev];
        newItems[index] = { ...newItems[index], ...partialUpdatedItem } as T;
        return newItems;
      });
      return partialUpdatedItem;
    },
    []
  );

  /**
   * Removes specific items from the current list by ID
   */
  const removeItemsFromList = useCallback((itemIds: T['id'][]) => {
    setItems((prev) => prev.filter((item) => !itemIds.includes(item.id)));
  }, []);

  /**
   * Handles pagination state after deleting items
   * Removes items from the list and handles page navigation if current page becomes empty
   */
  const handlePostDelete = useCallback(
    async (deletedCount: number = 1) => {
      // Update total count
      setPagination((prev) => {
        const newItemCount = Math.max(0, prev.itemCount - deletedCount);
        return {
          ...prev,
          itemCount: newItemCount,
          pageCount: Math.ceil(newItemCount / prev.pageSize),
        };
      });

      const currentItems = itemsRef.current;
      const currentPagination = paginationRef.current;

      // If current page is empty and not the first page, go to previous page
      if (currentItems.length === 0 && currentPagination.page > 1) {
        const previousPage = currentPagination.page - 1;
        setPagination((prev) => ({
          ...prev,
          page: previousPage,
        }));
        await fetchData({ page: previousPage } as Partial<Q>);
      } else if (currentItems.length === 0 && currentPagination.page === 1) {
        // If we're on the first page and it's empty, just refetch to ensure consistency
        await fetchData({ page: 1 } as Partial<Q>);
      }
    },
    [fetchData]
  );

  /**
   * Handles bulk delete operations
   */
  const handleBulkDelete = useCallback(
    async (deletedItemIds: T['id'][]) => {
      // Remove items from the current list
      removeItemsFromList(deletedItemIds);

      // Handle pagination state
      await handlePostDelete(deletedItemIds.length);
    },
    [removeItemsFromList, handlePostDelete]
  );

  /**
   * Updates the current page and refetches data
   */
  const goToPage = useCallback(
    async (page: number) => {
      await fetchData({ page } as Partial<Q>);
    },
    [fetchData]
  );

  /**
   * Updates the page size and refetches data
   */
  const updatePageSize = useCallback(
    async (pageSize: number) => {
      await fetchData({ page: 1, pageSize } as Partial<Q>);
    },
    [fetchData]
  );

  /**
   * Updates search/filter parameters and refetches data
   */
  const updateFilters = useCallback(
    async (filters: Partial<Q>) => {
      await fetchData({ page: 1, ...filters } as Partial<Q>);
    },
    [fetchData]
  );

  /**
   * Resets the state to initial values
   */
  const resetFilters = useCallback(() => {
    setItems([]);
    setPagination({
      itemCount: 0,
      page: 1,
      pageSize: initialPageSize,
      pageCount: 0,
    });
    const resetQ = {
      page: 1,
      pageSize: initialPageSize,
      ...initialQuery,
    } as Q;
    setQuery(resetQ);
    queryRef.current = resetQ;
  }, [initialPageSize, initialQuery]);

  return {
    items,
    allItems,
    pagination,
    query,

    // Actions
    fetchData,
    fetchAllData,
    handlePostCreate,
    handlePostUpdate,
    handlePostUpdatePartial,
    handlePostDelete,
    handleBulkDelete,
    removeItemsFromList,
    goToPage,
    updatePageSize,
    updateFilters,
    resetFilters,
    setQuery,
  };
}
