import { useMemo } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslation } from 'react-i18next';

interface DeleteAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
  selectedCount?: number;
}

export const DeleteAlertDialog: React.FC<DeleteAlertDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  title = '',
  description = '',
  isLoading = false,
  selectedCount = 1,
}) => {
  const { t } = useTranslation();

  const dialogTitle = useMemo(() => {
    if (title) {
      return title;
    }
    return selectedCount > 1
      ? t('common.toast.deleteAlert.multiple.title', { count: selectedCount })
      : t('common.toast.deleteAlert.single.title');
  }, [title, selectedCount, t]);

  const dialogDescription = useMemo(() => {
    if (description) {
      return description;
    }
    return selectedCount > 1
      ? t('common.toast.deleteAlert.multiple.description', {
          count: selectedCount,
        })
      : t('common.toast.deleteAlert.single.description');
  }, [description, selectedCount, t]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction
            className='hover:bg-muted bg-muted/80 focus:ring-muted/50 text-muted-foreground focus:ring'
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? t('common.deleting') : t('common.confirm')}
          </AlertDialogAction>
          <AlertDialogCancel
            className='bg-destructive hover:bg-destructive/90 focus:ring-destructive/50 text-white hover:text-white focus:ring'
            disabled={isLoading}
          >
            {t('common.cancel')}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAlertDialog;
