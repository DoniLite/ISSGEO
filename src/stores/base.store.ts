import type { PaginatedResponse, PaginationQuery } from '@/lib/interfaces/pagination';
import type { StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Applies middleware to a Zustand store.
 * ```ts
 * export const createBaseStore = create<BaseStore>()(
 *   applyStoreMiddleware(
 *     (set) => ({
 *       reset: () => set(() => ({})),
 *     }),
 *     "base-store"
 *   )
 * );
 * ```
 * @param f Function to create the store
 * @param storeName Name of the store
 * @returns
 */
export const applyStoreMiddleware = <T>(
  f: StateCreator<T>,
  storeName: string
) => devtools(persist(f, { name: storeName }));

export type BaseStore = {
  reset?: () => void;
  loading: boolean;
  error: Error | null;
};

export interface PaginatedStore<
  T extends { id?: string },
  Q extends PaginationQuery = PaginationQuery,
> {
  fetchData: (q?: Partial<Q>) => Promise<void>;
  goToPage: (page: number) => Promise<void>;
  updatePageSize: (size: number) => Promise<void>;
  updateFilters: (q: Partial<Q>) => Promise<void>;
  resetFilters: () => void;
  resetState: () => void;
  items: T[];
  allItems: T[];
  query: Q;
  pagination: Pick<
    PaginatedResponse<T>,
    'page' | 'pageSize' | 'itemCount' | 'pageCount'
  >;
  defaultEntity: T;
  translationPath: string;
}
