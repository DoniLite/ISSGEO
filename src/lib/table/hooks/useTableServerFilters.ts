import type { ColumnFilter, SortingState } from "@tanstack/react-table";
import { SortOrder, type PaginationQuery } from "@/lib/interfaces/pagination";
import { useEffect, useMemo } from "react";
import { useTablePagination } from "@/lib/table/helpers/TablePaginationProvider";

type FiltersType = Record<string, string | number | undefined>;

/**
 * Generic store interface that any store using the pagination pattern should implement
 */
export interface TableCompatibleStore {
	loading: boolean;
	goToPage: (page: number) => Promise<void>;
	updatePageSize: (pageSize: number) => Promise<void>;
	updateFilters: (query: PaginationQuery) => Promise<void>;
	fetchData: () => Promise<void>;
	resetFilters: () => void;
}

/**
 * Configuration for table handlers
 */
export interface UseTableHandlersOptions {
	/**
	 * The store that handles the data operations
	 */
	store: TableCompatibleStore;

	/**
	 * Custom filter handlers for specific filter types
	 * Key should match the filter ID from TanStack Table
	 */
	customFilters?: Record<string, (value: string) => FiltersType>;

	/**
	 * Whether to automatically fetch data on mount
	 * @default true
	 */
	autoFetch?: boolean;
}

/**
 * Composable that provides standardized table interaction handlers
 * Works with any store that follows the pagination pattern
 */
export function useTableServerFilters(options: UseTableHandlersOptions) {
	const { store, customFilters = {}, autoFetch = true } = options;
	const { setLoading } = useTablePagination();

	// Provide loading state to all child components
	setLoading(useMemo(() => store.loading, [store.loading]));

	/**
	 * Initial data fetch on component mount
	 */
	async function initializeData() {
		store.resetFilters(); // Reset filters to ensure clean state
		if (autoFetch && typeof store.fetchData === "function") {
			await store.fetchData();
		}
	}

	/**
	 * Handle page updates from table pagination
	 */
	async function handlePageUpdate(page: number) {
		await store.goToPage(page);
	}

	/**
	 * Handle page size updates from table pagination
	 */
	async function handlePageSizeUpdate(pageSize: number) {
		await store.updatePageSize(pageSize);
	}

	/**
	 * Handle sorting updates from table
	 */
	async function handleSortingUpdate(sorting: SortingState) {
		const sortParams: PaginationQuery = {};

		if (sorting.length > 0) {
			const sortItem = sorting[0];
			sortParams.sortBy = String(sortItem?.id);
			sortParams.sortOrder = sortItem?.desc ? SortOrder.DESC : SortOrder.ASC;
		} else {
			sortParams.sortBy = undefined;
			sortParams.sortOrder = undefined;
		}

		await store.updateFilters(sortParams);
	}

	/**
	 * Handle filter updates from table
	 *
	 * This function processes filter changes from TanStack Table and converts them
	 * into API-compatible filter parameters. It supports both default filtering
	 * (direct key-value mapping) and custom filter transformations.
	 *
	 * The function intelligently separates search filters (which stay at root level)
	 * from other filters (which are nested under the 'filters' property) to match
	 * the PaginationQuery interface structure.
	 *
	 * @param filters - Array of ColumnFilter objects from TanStack Table
	 *
	 * @example
	 * Example from organizations.vue with date range filter on updated_at column:
	 * Here's how the filters might look when passed to this function from tanstack table:
	 * const filters = [
	 *   { id: 'search', value: 'Acme Corp' },    // Search filter (stays at root)
	 *   { id: 'name', value: 'Corporation' },    // Organization name filter
	 *   { id: 'type', value: 'company' },        // Organization type filter
	 *   { id: 'updatedAtRange', value: '{"start":"2024-01-01","end":"2024-12-31"}' }, // Date range filter
	 * ]
	 *
	 * With custom filters configured in useOrganizationTableHandlers:
	 * const customFilters = {
	 *   search: (value) => ({ search: value }),
	 *   type: (value) => ({ type: value }),
	 *   updatedAtRange: (value) => {
	 *     const parsed = JSON.parse(value)
	 *     return {
	 *       updatedAtStart: parsed.start,
	 *       updatedAtEnd: parsed.end
	 *     }
	 *   }
	 * }
	 *
	 * This function will produce:
	 * const filterParams = {
	 *   search: 'Acme Corp',        // Search stays at root level
	 *   filters: {
	 *     name: 'Corporation',      // Organization name filter
	 *     type: 'company',          // Organization type filter
	 *     updatedAtStart: '2024-01-01',  // Date range start
	 *     updatedAtEnd: '2024-12-31'     // Date range end
	 *   }
	 *   'status' is omitted because value was null
	 * }
	 *
	 * Finally calls: await organizationStore.updateFilters(filterParams)
	 */

	async function handleFiltersUpdate(filters: ColumnFilter[]) {
		let filterParams: PaginationQuery = {};
		const filterObject: FiltersType = {};

		// Helper function to assign parameters to the correct location
		const assignFilterParams = (params: FiltersType) => {
			Object.entries(params).forEach(([key, value]) => {
				if (key === "search") {
					filterParams[key] = value as string;
				} else if (value !== "all") {
					filterObject[key] = value;
				} else if (value === "all") {
					filterObject[key] = undefined;
				}
			});
		};

		// Helper function to safely convert filter values to string or number
		const convertFilterValue = (value: unknown): string | number => {
			if (typeof value === "string" || typeof value === "number") {
				return value;
			}
			return String(value);
		};

		for (const filter of filters) {
			const { id: filterId, value: filterValue } = filter;

			// Skip null/undefined values early
			if (filterValue === null || filterValue === undefined) {
				continue;
			}

			// Apply custom filter handler if available
			if (customFilters[filterId]) {
				try {
					const customParams = customFilters[filterId](String(filterValue));
					assignFilterParams(customParams);
				} catch (_error) {
					// Fallback to default behavior
					assignFilterParams({ [filterId]: convertFilterValue(filterValue) });
				}
			} else {
				// Default behavior: convert to string or number as needed
				assignFilterParams({ [filterId]: convertFilterValue(filterValue) });
			}
		}

		// Only add filters object if it has content
		if (Object.keys(filterObject).length > 0) {
			filterParams = { ...filterParams, ...filterObject };
		}

		await store.updateFilters(filterParams);
	}

	// Auto-initialize data on mount if enabled
	useEffect(() => {
		initializeData().then();
	});

	return {
		initializeData,
		handlePageUpdate,
		handlePageSizeUpdate,
		handleSortingUpdate,
		handleFiltersUpdate,
	};
}

export function useDefaultTableHandlers(store: TableCompatibleStore) {
	return useTableServerFilters({
		store,
		customFilters: {
			search: (value: string) => ({ search: value }),
		},
	});
}
