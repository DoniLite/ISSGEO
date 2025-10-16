/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
/** biome-ignore-all lint/correctness/noNestedComponentDefinitions: <> */
import type { TestimonialsTableType } from '@/db';
import FlexTable, { type Emits } from '@/lib/table/FlexTable';
import {
  createActionsColumn,
  createDateColumn,
  createSelectColumn,
  createTextColumn,
} from '@/lib/table/helpers/columnFactory';
import { useEntityEditor } from '@/lib/table/hooks/forms/useEntityEditor';
import { useDefaultTableHandlers } from '@/lib/table/hooks/useTableServerFilters';
import type {
  ColumnDef,
  ColumnFilter,
  SortingState,
  Table,
} from '@tanstack/react-table';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// import JobForm from '../components/JobForm';
import DeleteAlertDialog from '@/components/shared/ConfirDeleteDialog';
import Layout from '../Layout';
import useTestimonialStore from '@/stores/testimonials.store';
import type {
  CreateTestimonialDTO,
  UpdateTestimonialDTO,
} from '@/api/testimonials';

export default function TestimonialsPage() {
  const store = useTestimonialStore();
  const { items, fetchData } = store;
  const { t } = useTranslation();

  useEffect(() => {
    fetchData();
  }, []);

  const {
    handlePageUpdate,
    handlePageSizeUpdate,
    handleSortingUpdate,
    handleFiltersUpdate,
  } = useDefaultTableHandlers(store);

  const {
    showDeleteDialog,
    onShowDeleteDialog,
    selectedIds,
    openCreateDialog,
    openUpdateDialog,
    confirmDelete,
    onDeleteTrigger,
  } = useEntityEditor<
    CreateTestimonialDTO,
    UpdateTestimonialDTO,
    TestimonialsTableType
  >(store);

  const columns: ColumnDef<TestimonialsTableType>[] = [
    createSelectColumn(t),
    createTextColumn(t, {
      accessorKey: 'name',
      headerKey: 'common.name',
      className: 'lg:max-w-xs line-clamp-2 max-w-[12rem]',
    }),
    createTextColumn<TestimonialsTableType, number>(t, {
      accessorKey: 'starNumber',
      headerKey: 'common.starNumber',
      getEntityValue: (starCount) => (
        <div className='flex items-center gap-2'>
          <div className='text-yellow-400'>{'★'.repeat(starCount)}</div>
        </div>
      ),
      className: 'ml-3',
    }),
    createTextColumn<TestimonialsTableType, string>(t, {
      headerKey: 'common.message',
      accessorKey: 'message',
      getEntityValue: (v) => <p className='line-clamp-2 w-full'>{v}</p>,
      className: 'max-w-xs md:max-w-lg',
    }),
    createDateColumn(t, {
      accessorKey: 'createdAt',
      headerKey: 'common.createdAt',
    }),
    createActionsColumn({
      onDelete: onDeleteTrigger,
      onEdit: openUpdateDialog,
      canEdit() {
        return false;
      },
    }),
  ];

  const handleEmit: Emits = (type, payload) => {
    if (type === 'update:page') {
      handlePageUpdate(payload as number);
    } else if (type === 'update:pageSize') {
      handlePageSizeUpdate(payload as number);
    } else if (type === 'update:filters') {
      handleFiltersUpdate(payload as ColumnFilter[]);
    } else {
      handleSortingUpdate(payload as SortingState);
    }
  };

  return (
    <Layout>
      <FlexTable
        data={items}
        columns={columns}
        serverSidePagination={store.pagination}
        emit={handleEmit}
        assets={(props) => (
          <TableAssets
            openCreateDialog={openCreateDialog}
            table={props.table}
          />
        )}
      />
      <DeleteAlertDialog
        open={showDeleteDialog}
        onOpenChange={onShowDeleteDialog}
        onConfirm={confirmDelete}
        selectedCount={selectedIds.length}
      />
    </Layout>
  );
}

const TableAssets = <T extends Record<string, unknown>>(_: {
  table: Table<T>;
  openCreateDialog: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className='w-full flex justify-between items-center'>
      <h1
        className='text-lg font-bold lg:text-2xl'
        data-testid='organizations-title'
      >
        {t('admin.testimonials.id')}
      </h1>
    </div>
  );
};
