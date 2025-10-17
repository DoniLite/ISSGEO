/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
/** biome-ignore-all lint/correctness/noNestedComponentDefinitions: <> */
import type { ContactTableType } from '@/db';
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
import useContactStore from '@/stores/contact.store';
import type { CreateContactDTO, UpdateContactDTO } from '@/api/contact';

export default function ContactPage() {
  const store = useContactStore();
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
  } = useEntityEditor<CreateContactDTO, UpdateContactDTO, ContactTableType>(
    store
  );

  const columns: ColumnDef<ContactTableType>[] = [
    createSelectColumn(t),
    createTextColumn(t, {
      accessorKey: 'name',
      headerKey: 'common.name',
      className: 'lg:max-w-xs line-clamp-2 max-w-[12rem]',
    }),
    createTextColumn(t, {
      accessorKey: 'email',
      headerKey: 'common.email',
      className: 'ml-4 line-clamp-1',
    }),
    createTextColumn<ContactTableType, string>(t, {
      headerKey: 'common.message',
      accessorKey: 'message',
      getEntityValue: (v) => <p className='line-clamp-2 w-full'>{v}</p>,
      className: 'max-w-lg',
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
        {t('admin.contact.id')}
      </h1>
    </div>
  );
};
