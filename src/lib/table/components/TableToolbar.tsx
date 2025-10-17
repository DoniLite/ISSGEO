import type { ColumnFilter, Table } from '@tanstack/react-table';
import type { ElementType } from 'react';
import TableSearchWithButton from './TableSearchWithButton';
import TableDropdown from './TableDropdown';

interface Props<TData extends Record<string, unknown>> {
  table: Table<TData>;
  handleFiltersUpdate: (
    columnFilters: ColumnFilter[],
    table: Table<TData>
  ) => void;
  tableFilters?: ElementType<SlotProps<TData>>;
}

export interface SlotProps<TData extends Record<string, unknown>> {
  table: Table<TData>;
  handleFiltersUpdate: (columnFilters: ColumnFilter[]) => void;
}

export default function TableToolbar<T extends Record<string, unknown>>(
  props: Props<T>
) {
  const { table, handleFiltersUpdate } = props;

  return (
    <div className='border-b-2 px-4 py-3'>
      <div className='flex flex-col items-center gap-2 lg:flex-row'>
        <div className='flex w-full flex-col items-center gap-3 lg:w-[80%] lg:flex-row'>
          <TableSearchWithButton
            className={props.tableFilters ? 'lg:max-w-[55%]' : 'lg:max-w-[65%]'}
            update={(value: string) => table.setGlobalFilter(value)}
          />
          {props.tableFilters && (
            <props.tableFilters
              table={table}
              handleFiltersUpdate={(columnFilters: ColumnFilter[]) =>
                handleFiltersUpdate(columnFilters, table)
              }
            />
          )}
        </div>
        <TableDropdown table={table} />
      </div>
    </div>
  );
}
