import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  useEffect,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useTablePagination } from '../helpers/TablePaginationProvider';
import useDebounceFn from '@/hooks/useDebounceFn';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  className: HTMLAttributes<'div'>['className'];
  update?: (value: string) => void;
}

export default function TableSearchWithButton({ className, update }: Props) {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState<string>('');
  const { loading: isLoading } = useTablePagination();
  const canSearch = useMemo(() => searchValue.length > 0, [searchValue]);

  function handleSearch() {
    if (isLoading) {
      return;
    }

    if (update) {
        update(searchValue);
    }
  }

  function onClear() {
    setSearchValue('');
  }

  const debouncedSetFilter = useDebounceFn((value: string) => {
    if (!value) {
      handleSearch();
    }
  }, 200);

  useEffect(() => {
    debouncedSetFilter(searchValue);
  }, [searchValue, debouncedSetFilter]);

  return (
    <div
      className={cn(
        `relative w-full items-center rounded-lg border`,
        className
      )}
    >
      <div className='relative flex-1'>
        <Input
          id={useId()}
          value={searchValue}
          type='text'
          placeholder={t('common.search')}
          className='w-full pr-15 pl-10 md:pr-20'
          onKeyUp={() => searchValue && handleSearch()}
        />
        <span className='absolute inset-y-0 start-0 flex items-center justify-center px-2'>
          {!canSearch ? (
            <Search className='text-muted-foreground h-4 w-4' />
          ) : (
            <button
              v-else
              type='button'
              className='focus:outline-none'
              onClick={onClear}
            >
              <X className='text-muted-foreground h-4 w-4' />
            </button>
          )}
        </span>
        {canSearch && (
          <Button
            variant='default'
            className='border-primary absolute inset-y-0 end-0 flex items-center space-x-2 rounded-l-none border-2'
            disabled={isLoading}
            onClick={handleSearch}
          >
            <span className='hidden lg:inline'>{t('common.search')}</span>
            <Search className='h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  );
}
