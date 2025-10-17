/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
/** biome-ignore-all lint/correctness/noNestedComponentDefinitions: <> */
import type { CreateJobDTO, UpdateJobDTO } from '@/api/job';
import EntityEditDialog from '@/components/shared/AppDialog';
import type { EntryType } from '@/components/shared/entity/SortedCombobox';
import EntitySelect from '@/components/shared/entity/SortedCombobox';
import { Button } from '@/components/ui/button';
import type { JobOfferTableType } from '@/db';
import FlexTable, { type Emits } from '@/lib/table/FlexTable';
import {
  createActionsColumn,
  createBadgeColumn,
  createDateColumn,
  createSelectColumn,
  createTextColumn,
} from '@/lib/table/helpers/columnFactory';
import { useEntityEditor } from '@/lib/table/hooks/forms/useEntityEditor';
import { useDefaultTableHandlers } from '@/lib/table/hooks/useTableServerFilters';
import useJobStore from '@/stores/job.store';
import type {
  ColumnDef,
  ColumnFilter,
  SortingState,
  Table,
} from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import JobForm from '../components/JobForm';
import DeleteAlertDialog from '@/components/shared/ConfirDeleteDialog';
import Layout from '../Layout';
import z from 'zod';
import GenericForm, {
  type GenericFormField,
} from '@/components/shared/entity/GenericForm';

export default function JobPage() {
  const store = useJobStore();
  const { items, fetchData } = store;
  const { t } = useTranslation();
  const [contractFilter, setContractFilter] = useState('all');

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
    entityModel,
    openDialog,
    onOpenDialog,
    editionMode,
    modalDescription,
    modalTitle,
    showDeleteDialog,
    onShowDeleteDialog,
    selectedIds,
    closeDialog,
    openCreateDialog,
    openUpdateDialog,
    onSave,
    confirmDelete,
    onDeleteTrigger,
  } = useEntityEditor<CreateJobDTO, UpdateJobDTO, JobOfferTableType>(store);

  const columns: ColumnDef<JobOfferTableType>[] = [
    createSelectColumn(t),
    createTextColumn(t, {
      accessorKey: 'title',
      headerKey: 'common.title',
      className: 'lg:max-w-xs line-clamp-2 max-w-[12rem]',
    }),
    createTextColumn(t, {
      accessorKey: 'location',
      headerKey: 'common.location',
      className: 'ml-4',
    }),
    createBadgeColumn(t, {
      accessorKey: 'contract',
      headerKey: 'common.contract',
      className(entity) {
        const base = 'ml-1';
        if (entity.contract === 'Stage') {
          return `${base} bg-orange-400`;
        }
        if (entity.contract === 'CDD') {
          return `${base} bg-green-400`;
        }
        if (entity.contract === 'Freelance') {
          return `${base} bg-pink-400`;
        }
        return `${base}`;
      },
    }),
    createDateColumn(t, {
      accessorKey: 'createdAt',
      headerKey: 'common.createdAt',
    }),
    createActionsColumn({
      onDelete: onDeleteTrigger,
      onEdit: openUpdateDialog,
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

  const jobFormSchema = z.object({
    title: z.string().min(2, {
      error: t('admin.job.form.title'),
    }),
    location: z.string().min(2, {
      error: t('admin.job.form.location'),
    }),
    contract: z.enum(['CDI', 'CDD', 'Stage', 'Freelance']).nullable(),
  });

  const fields: GenericFormField<JobOfferTableType>[] = [
    { name: 'title', label: t('common.title'), type: 'text', required: true },
    {
      name: 'location',
      label: t('admin.job.form.label.location'),
      type: 'text',
      required: true,
    },
    {
      name: 'contract',
      label: t('admin.job.form.label.contract'),
      type: 'select',
      options: Object.values(['CDI', 'CDD', 'Stage', 'Freelance'] as const),
    },
  ];

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
        tableFilters={(props) => (
          <TableFilters
            {...props}
            value={contractFilter}
            handleChange={(v) => {
              handleFiltersUpdate([{ id: 'contract', value: v }]);
              setContractFilter(v);
            }}
          />
        )}
      />
      <EntityEditDialog
        title={modalTitle}
        description={modalDescription}
        open={openDialog}
        onOpenChange={onOpenDialog}
        contentSlot={
          <GenericForm
            schema={jobFormSchema}
            fields={fields}
            entity={entityModel}
            editionMode={editionMode}
            onSubmit={onSave}
            onCancel={closeDialog}
          />
        }
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

const TableFilters = <T extends Record<string, unknown>>({
  handleChange,
  value,
}: {
  table: Table<T>;
  value: string;
  handleChange: (v: string) => void;
}) => {
  const { t } = useTranslation();

  const contractTypeOptions = useMemo(
    () =>
      [
        {
          id: 'all',
          label: t('common.all'),
        },
        ...['CDD', 'CDI', 'Freelance', 'Stage'].map((type) => ({
          id: type,
          label: t(`admin.job.form.contracts.${type}`),
        })),
      ] as EntryType[],
    []
  );

  return (
    <div className='w-full min-w-[var(--reka-dropdown-menu-trigger-width)] lg:max-w-[15rem]'>
      <EntitySelect
        value={value}
        entries={contractTypeOptions}
        placeholder='common.all'
        onSelected={handleChange}
      />
    </div>
  );
};

const TableAssets = <T extends Record<string, unknown>>({
  openCreateDialog,
}: {
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
        {t('admin.job.id')}
      </h1>
      <Button
        variant='default'
        data-testid='add-organization-btn'
        onClick={openCreateDialog}
      >
        <Plus />
        {t('common.add')}
      </Button>
    </div>
  );
};
