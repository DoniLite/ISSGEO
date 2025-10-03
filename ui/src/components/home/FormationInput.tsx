import { useTranslation } from 'react-i18next';
import { Select, SelectTrigger } from '../ui/select';

export default function FormationInput() {
  const { t } = useTranslation();
  return (
    <div className='w-full flex flex-col gap-1 mt-2 lg:mt-4'>
      <span className='lg:text-lg font-bold relative left-3'>
        {t('pages.home.form.formation.label')}
      </span>
      <Select>
        <SelectTrigger className='w-full px-3 py-2'>
          <span className='line-clamp-1'>
            {t('pages.home.form.formation.placeholder')}
          </span>
        </SelectTrigger>
      </Select>
    </div>
  );
}
