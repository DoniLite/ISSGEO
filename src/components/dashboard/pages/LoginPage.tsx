import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation();
  return (
    <div className='flex min-h-screen w-full items-center justify-center'>
      <div className='bg-card min-w-[300px] rounded-lg p-8 shadow-lg md:min-w-md lg:min-w-lg xl:min-w-xl'>
        <h1 className='text-lg font-bold md:text-lg xl:text-3xl'>
          {t('admin.login.welcome')}
        </h1>
        <span>{t('admin.login.description')}</span>
        <form className='mt-8 flex flex-col gap-4'>
          <div className='flex w-full flex-col gap-2'>
            <label htmlFor='login' className='font-bold'>
              {t('admin.login.input.login.label')}
            </label>
            <input
              v-model='form.login'
              type='text'
              placeholder={t('admin.login.input.login.placeholder')}
              name='login'
              aria-required='true'
              required={true}
              className='ring-muted focus:ring-primary rounded-md bg-transparent px-4 py-2 ring outline-none'
            />
          </div>

          <div className='flex w-full flex-col gap-2'>
            <label htmlFor='password' className='font-bold'>
              {t('admin.login.input.password.label')}
            </label>
            <input
              type='password'
              placeholder={t('admin.login.input.password.placeholder')}
              name='password'
              required={true}
              className='ring-muted focus:ring-primary rounded-md bg-transparent px-4 py-2 ring outline-none'
            />
          </div>

          <Button
            type='submit'
            className='bg-primary text-primary-foreground w-full cursor-pointer rounded-md px-4 py-2 font-bold'
          >
            {t('admin.login.input.submit')}
          </Button>
        </form>
      </div>
    </div>
  );
}
