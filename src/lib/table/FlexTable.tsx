import type {
  ColumnDef,
  ColumnFilter,
  ColumnPinningPosition,
  SortingState,
  Table,
} from '@tanstack/react-table';
import type { PaginatedResponse } from '../interfaces/pagination';
import { useFlexTable } from './hooks/useFlexTable';
import { useMemo, type ElementType } from 'react';
import { useTableClientPagination } from './hooks/useTableClientPagination';
import { useColumnPinning } from './hooks/useColumnPinning';
import { useDeviceType } from '@/hooks/useDeviceType';
import TableToolbar, {
  type SlotProps as ToolbarSlotProps,
} from './components/TableToolbar';
import TableContent, {
  type SlotProps as TableContentSlotProps,
} from './components/TableContent';
import TablePagination from './components/TablePagination';

interface Props<TData extends Record<string, unknown>, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  noResultsTextKey?: string;
  ofTextKey?: string;
  pinnedColumnId?: string;
  pinOnMobile?: ColumnPinningPosition;
  pinOnDesktop?: ColumnPinningPosition;
  serverSideSorting?: boolean;
  serverSideFiltering?: boolean;
  serverSidePagination?: Pick<
    PaginatedResponse<TData>,
    'itemCount' | 'page' | 'pageSize' | 'pageCount'
  >;
  useFuzzySearch?: boolean;
  searchColumns?: string[];
  emit: Emits;
  assets?: ElementType<SlotProps<TData>>;
  tableFilters?: ElementType<ToolbarSlotProps<TData>>;
  tableContentComponent?: ElementType<TableContentSlotProps<TData>>;
}

interface SlotProps<TData extends Record<string, unknown>> {
  table: Table<TData>;
}

export interface Emits {
  (e: 'update:sorting', sorting: SortingState): void;
  (e: 'update:filters', filters: ColumnFilter[]): void;
  (e: 'update:page' | 'update:pageSize', value: number): void;
}

export default function FlexTable<
  TData extends Record<string, unknown>,
  TValue,
>(props: Props<TData, TValue>) {
  const {
    data,
    columns,
    ofTextKey = 'common.table.of',
    noResultsTextKey = 'common.noResult',
    pinnedColumnId = 'actions',
    pinOnMobile = 'right',
    pinOnDesktop = false,
    serverSideSorting = false,
    serverSideFiltering = true,
    serverSidePagination = undefined,
    useFuzzySearch = true,
    searchColumns = [],
    emit,
  } = props;
  const { isMobile } = useDeviceType();

  const { table, handleFiltersUpdate } = useFlexTable(
    {
      columns: columns,
      data: useMemo(() => data, [data]),
      serverSideSorting: serverSideSorting,
      serverSideFiltering: serverSideFiltering,
      serverSidePagination: useMemo(
        () => serverSidePagination,
        [serverSidePagination]
      ),
      useFuzzySearch: useFuzzySearch,
      searchColumns: searchColumns,
    },
    emit
  );

  const {
    currentPagination,
    canPreviousPage,
    canNextPage,
    updatePageSize,
    goToPage,
  } = useTableClientPagination(
    {
      table,
      serverSidePagination: useMemo(
        () => serverSidePagination,
        [serverSidePagination]
      ),
    },
    emit
  );

  const { getPinnedItemClassDefinition } = useColumnPinning({
    table,
    pinnedColumnId: pinnedColumnId,
    pinOnMobile: pinOnMobile,
    pinOnDesktop: pinOnDesktop,
    isMobile,
  });

  return (
    <div className='container mx-auto'>
      <div className='mx-auto my-6 flex justify-between'>
        {props.assets && <props.assets table={table} />}
      </div>
      <div className='mx-auto rounded-lg border'>
        <TableToolbar
          table={table}
          handleFiltersUpdate={handleFiltersUpdate}
          tableFilters={props.tableFilters}
        />

        <TableContent
          table={table}
          columns={columns}
          noResultsTextKey={noResultsTextKey}
          getPinnedItemClassDefinition={getPinnedItemClassDefinition}
          slotComponent={props.tableContentComponent}
        />

        <TablePagination
          currentPagination={currentPagination}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          ofTextKey={ofTextKey}
          updatePageSize={updatePageSize}
          goToPage={goToPage}
        />
      </div>
    </div>
  );
}

