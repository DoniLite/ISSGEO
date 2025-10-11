import { ApiError } from '@/lib/interfaces/errors';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

enum EditionMode {
  CREATE = 'create',
  UPDATE = 'update',
}

/**
 * Interface for entities that have an ID.
 */
export interface EntityWithId {
  id: string;
}

/**
 * Defines generic store interface for CRUD operations.
 */
export interface CrudCompatibleStore<C, U, T extends EntityWithId> {
  defaultEntity: T;
  translationPath: string;
  create?: (entity: C) => Promise<void>;
  update?: (id: T['id'], entity: U) => Promise<void>;
  deleteOne: (id: T['id']) => Promise<void>;
  deleteMultiple: (ids: T['id'][]) => Promise<void>;
  resetState: () => void;
}
/**
 * Defines the structure for toast message configurations.
 * Paths should correspond to your i18n translation keys.
 */
interface ToastMessagesConfig {
  createSuccess: { titleKey: string; descriptionKey: string };
  updateSuccess: { titleKey: string; descriptionKey: string };
  deleteSuccess: { titleKey: string; descriptionKey: string };
  deleteMultipleSuccess: { titleKey: string; descriptionKey: string };
  error: { titleKey: string; defaultDescriptionKey?: string };
}

export function useEntityEditor<C, U, T extends EntityWithId>(
  store: CrudCompatibleStore<C, U, T>
) {
  const { t } = useTranslation();

  // Entity editing state
  const [entityModel, setEntityModel] = useState<T>({ ...store.defaultEntity });
  const [openDialog, setOpenDialog] = useState(false);
  const [editionMode, setEditionMode] = useState<EditionMode>(
    EditionMode.CREATE
  );

  // Delete confirmation dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedIds, setSelectedIds] = useState<T['id'][]>([]);
  const [currentTableResetSelection, setCurrentTableResetSelection] = useState<
    (() => void) | null
  >(null);

  const toastMessages: ToastMessagesConfig = {
    createSuccess: {
      titleKey: `${store.translationPath}.toast.create.success.title`,
      descriptionKey: `${store.translationPath}.toast.create.success.description`,
    },
    updateSuccess: {
      titleKey: `${store.translationPath}.toast.update.success.title`,
      descriptionKey: `${store.translationPath}.toast.update.success.description`,
    },
    deleteSuccess: {
      titleKey: `${store.translationPath}.toast.delete.success.title`,
      descriptionKey: `${store.translationPath}.toast.delete.success.description`,
    },
    deleteMultipleSuccess: {
      titleKey: `${store.translationPath}.toast.delete.success.titleMultiple`,
      descriptionKey: `${store.translationPath}.toast.delete.success.descriptionMultiple`,
    },
    error: {
      titleKey: 'common.toast.error.unexpected.title',
      defaultDescriptionKey: 'common.toast.error.unexpected.description',
    },
  } as ToastMessagesConfig;

  const openCreateDialog = () => {
    store.resetState();

    setEditionMode(EditionMode.CREATE);
    setEntityModel({ ...store.defaultEntity });
    setOpenDialog(true);
  };

  const openUpdateDialog = (entityToEdit: T) => {
    store.resetState();
    setEditionMode(EditionMode.UPDATE);
    setEntityModel({ ...entityToEdit });
    setOpenDialog(true);
  };

  const closeDialog = () => {
    store.resetState();
    setOpenDialog(false);
  };

  const showToastError = (error: unknown) => {
    if (error instanceof ApiError) {
      toast.error(t(toastMessages.error.titleKey), {
        description: t(error.description || error.message),
      });
    } else {
      const description = toastMessages.error.defaultDescriptionKey
        ? t(toastMessages.error.defaultDescriptionKey)
        : t('common.toast.error.unexpected.description');
      toast.error(t(toastMessages.error.titleKey), {
        description: t(description),
      });
    }
  };

  const showToastSuccess = (successConfig: {
    titleKey: string;
    descriptionKey: string;
  }) => {
    toast.success(t(successConfig.titleKey), {
      description: t(successConfig.descriptionKey),
    });
  };

  const handleCreate = async (createRequest: C) => {
    try {
      await store.create?.(createRequest);
      setOpenDialog(false);
      showToastSuccess(toastMessages.createSuccess);
    } catch (error: unknown) {
      showToastError(error);
    }
  };

  const handleUpdate = async (updateRequest: U) => {
    try {
      await store.update?.(entityModel.id, updateRequest);
      setOpenDialog(false);
      showToastSuccess(toastMessages.updateSuccess);
    } catch (error: unknown) {
      showToastError(error);
    }
  };

  const handleDelete = async (id: T['id']) => {
    try {
      await store.deleteOne(id);
      showToastSuccess(toastMessages.deleteSuccess);
    } catch (error: unknown) {
      showToastError(error);
    }
  };

  const handleDeleteMultiple = async (ids: T['id'][]) => {
    try {
      await store.deleteMultiple(ids);
      showToastSuccess(toastMessages.deleteMultipleSuccess);
    } catch (error: unknown) {
      showToastError(error);
    } finally {
      setSelectedIds([]);
      if (currentTableResetSelection) {
        currentTableResetSelection();
      }
    }
  };

  const onSave = async (formData: C | U) => {
    if (editionMode === EditionMode.CREATE && store.create) {
      await handleCreate(formData as C);
    } else if (editionMode === EditionMode.UPDATE && store.update) {
      await handleUpdate(formData as U);
    }
  };

  const modalTitle = useMemo(
    () => t(`${store.translationPath}.form.${editionMode}.title`),
    [editionMode, store.translationPath, t]
  );
  const modalDescription = useMemo(
    () => t(`${store.translationPath}.form.${editionMode}.description`),
    [editionMode, store.translationPath, t]
  );

  const confirmDelete = async () => {
    try {
      if (selectedIds.length > 1) {
        await handleDeleteMultiple(selectedIds);
      } else {
        await handleDelete(selectedIds?.[0] ?? '');
      }
    } finally {
      setShowDeleteDialog(false);
      setSelectedIds([]);
    }
  };

  const onDeleteTrigger = (
    ids: T['id'][],
    resetCallback?: (() => void) | null
  ) => {
    setCurrentTableResetSelection(resetCallback ?? null);
    setSelectedIds(ids);
    setShowDeleteDialog(true);
  };

  return {
    entityModel,
    openDialog,
    editionMode,
    modalTitle,
    modalDescription,
    showDeleteDialog,
    selectedIds,
    openCreateDialog,
    openUpdateDialog,
    closeDialog,
    onSave,
    onDeleteTrigger,
    confirmDelete,
  };
}
