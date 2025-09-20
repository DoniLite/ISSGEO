import { Select, SelectContent, SelectTrigger } from '@/components/ui/select';
import { CalendarDate } from '../shared/Calendar';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useCountriesStore } from '@/stores/countries.store';

export default function Hero() {
  const { t } = useTranslation();
  return (
    <div className='absolute inset-0 top-[25%] lg:top-0 flex items-center justify-center p-4'>
      <div className='flex gap-4 lg:gap-6 flex-col lg:flex-row'>
        <div className='flex flex-col relative lg:-left-[12rem] lg:gap-4 xl:gap-8'>
          <h1 className='text-white lg:text-4xl font-bold max-w-xl'>
            {t('page.home.title')}
          </h1>
          <span className='text-foreground max-w-xl font-bold mt-4 lg:mt-0 text-xs lg:text-[16px]'>
            {t('page.home.description')}
          </span>
          <div className='flex items-center gap-2 lg:gap-4 mt-4'>
            <button
              onClick={() => alert('clicked')}
              type='button'
              className='bg-muted cursor-pointer text-xs lg:text-lg text-muted-foreground lg:font-medium px-4 py-2 rounded-md hover:bg-muted/90'
            >
              {t('page.home.ctas.contact')}
            </button>
            <button
              type='button'
              className='bg-primary cursor-pointer text-xs lg:text-lg text-primary-foreground lg:font-medium px-4 py-2 rounded-md hover:bg-primary/90'
            >
              {t('page.home.ctas.explore')}
            </button>
          </div>
        </div>

        <HeroForm />
      </div>
    </div>
  );
}

export function HeroForm() {
  const { t } = useTranslation();

  const { countries, fetchCountries } = useCountriesStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentCountry, setCurrentCountry] = useState({
    code: '+226',
    flag: 'https://flagcdn.com/w320/bf.png',
  });

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  return (
    <form
      action='#'
      className='w-full lg:w-[30rem] flex flex-col rounded-md p-2 lg:p-4 shadow h-auto lg:h-[32rem] bg-card lg:absolute lg:right-[1rem] xl:right-[6rem] 2xl:right-[16rem] lg:top-1/5 2xl:top-1/4'
    >
      <div className='w-full flex flex-col gap-1'>
        <span className='lg:text-lg font-bold relative left-3'>
          {t('page.home.form.name.label')}
        </span>
        <input
          type='text'
          id='name'
          name='name'
          className='outline-none focus:ring px-3 py-2 rounded-md border'
          placeholder={t('page.home.form.name.placeholder')}
        />
      </div>

      <div className='w-full flex flex-col gap-1 mt-2 lg:mt-4'>
        <span className='lg:text-lg font-bold relative left-3'>
          {t('page.home.form.email.label')}
        </span>
        <input
          type='text'
          id='email'
          name='email'
          className='outline-none focus:ring px-3 py-2 rounded-md border'
          placeholder={t('page.home.form.email.placeholder')}
        />
      </div>

      <div className='w-full flex flex-col gap-1 mt-2 lg:mt-4'>
        <span className='lg:text-lg font-bold relative left-3'>
          {t('page.home.form.phone.label')}
        </span>
        <div className='group rounded-md border flex items-center'>
          <Select>
            <SelectTrigger className='w-[40%] h-full px-1 md:px-3 py-2 flex gap-1'>
              <span className='line-clamp-1 font-bold'>
                {currentCountry.code}
              </span>
              <img
                src={currentCountry.flag}
                alt='country flag'
                className='w-[40%] h-7 object-cover rounded-md'
              />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <CountrySelector
                  key={country.name}
                  code={country.callingCode}
                  flag={country.flag}
                  onClick={(c) => {
                    setCurrentCountry({
                      code: c.code,
                      flag: c.flag,
                    });
                  }}
                />
              ))}
            </SelectContent>
          </Select>
          <input
            type='text'
            id='phone'
            name='phone'
            className='outline-none w-[60%] h-full group-focus:ring px-3 py-2 '
            placeholder={t('page.home.form.phone.placeholder')}
          />
        </div>
      </div>

      <div className='w-full flex flex-col gap-1 mt-2 lg:mt-4'>
        <span className='lg:text-lg font-bold relative left-3'>
          {t('page.home.form.formation.label')}
        </span>
        <Select>
          <SelectTrigger className='w-full px-3 py-2'>
            <span className='line-clamp-1'>
              {t('page.home.form.formation.placeholder')}
            </span>
          </SelectTrigger>
        </Select>
      </div>

      <div className='w-full flex flex-col gap-1 mt-2 lg:mt-4'>
        <span className='lg:text-lg font-bold relative left-3'>
          {t('page.home.form.disposability.label')}
        </span>
        <Select>
          <SelectTrigger className='w-full px-3 py-2'>
            <span className='line-clamp-1'>
              {t('page.home.form.disposability.placeholder')}
            </span>
          </SelectTrigger>
          <SelectContent>
            <CalendarDate
              date={currentDate}
              setDate={(date) => {
                setCurrentDate(date);
              }}
            />
          </SelectContent>
        </Select>
      </div>

      <button
        type='button'
        className='bg-primary w-full mt-4 lg:mt-auto cursor-pointer text-primary-foreground font-medium px-4 py-2 rounded-md hover:bg-primary/90'
      >
        {t('page.home.form.submit')}
      </button>
    </form>
  );
}

interface CountrySelectorProps {
  code: string;
  flag: string;
  onClick: (country: { code: string; flag: string }) => void;
}

function CountrySelector({ code, flag, onClick }: CountrySelectorProps) {
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Have to handle action on this component
    // biome-ignore lint/a11y/useKeyWithClickEvents: Have to handle action on this component
    <div
      className='w-full grid grid-cols-2 gap-2 mb-3 cursor-pointer'
      onClick={() => {
        onClick({ code, flag });
      }}
    >
      <span className='line-clamp-1 font-bold'>{code}</span>
      <img
        src={flag}
        alt='country flag'
        className='w-[50%] h-8 object-cover rounded-md'
      />
    </div>
  );
}
