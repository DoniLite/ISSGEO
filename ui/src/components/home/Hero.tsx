import { Select, SelectContent, SelectTrigger } from '@/components/ui/select';
import { CalendarDate } from '../shared/Calendar';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function Hero() {
  const { t } = useTranslation();
  return (
    <div className='absolute inset-0 top-[20%] lg:top-0 flex items-center justify-center p-4'>
      <div className='flex gap-4 lg:gap-6 flex-col lg:flex-row'>
        <div className='flex flex-col relative lg:-left-[12rem] lg:gap-4 xl:gap-8'>
          <h1 className='text-white lg:text-4xl font-bold max-w-xl'>
            {t('page.hero.title')}
          </h1>
          <span className='text-foreground max-w-xl font-bold lg:text-[16px]'>
            {t('page.hero.description')}
          </span>
          <div className='flex items-center gap-2 lg:gap-4 mt-4'>
            <button
              onClick={() => alert('clicked')}
              type='button'
              className='bg-muted cursor-pointer text-xs lg:text-lg text-muted-foreground lg:font-medium px-4 py-2 rounded-md hover:bg-muted/90'
            >
              More information
            </button>
            <button
              type='button'
              className='bg-primary cursor-pointer text-xs lg:text-lg text-primary-foreground lg:font-medium px-4 py-2 rounded-md hover:bg-primary/90'
            >
              Begin the adventure
            </button>
          </div>
        </div>

        <HeroForm />
      </div>
    </div>
  );
}

export function HeroForm() {
  const [currentDate, setCurrentDate] = useState(new Date());
  return (
    <form
      action='#'
      className='w-full lg:w-[30rem] flex flex-col rounded-md p-2 lg:p-4 shadow h-auto lg:h-[32rem] bg-card lg:absolute lg:right-[1rem] xl:right-[6rem] 2xl:right-[16rem] lg:top-1/5 2xl:top-1/4'
    >
      <div className='w-full flex flex-col gap-1'>
        <span className='text-lg font-bold relative left-3'>Your Name</span>
        <input
          type='text'
          id='name'
          name='name'
          className='outline-none focus:ring px-3 py-2 rounded-md border'
          placeholder='Name'
        />
      </div>

      <div className='w-full flex flex-col gap-1 mt-2 lg:mt-4'>
        <span className='text-lg font-bold relative left-3'>Your Email</span>
        <input
          type='text'
          id='email'
          name='email'
          className='outline-none focus:ring px-3 py-2 rounded-md border'
          placeholder='Email'
        />
      </div>

      <div className='w-full flex flex-col gap-1 mt-2 lg:mt-4'>
        <span className='text-lg font-bold relative left-3'>Your Phone</span>
        <div className='group rounded-md border flex items-center'>
          <Select>
            <SelectTrigger className='w-[40%] h-full px-3 py-2'>
              <span className='line-clamp-1'>+226 Burkina Faso</span>
            </SelectTrigger>
          </Select>
          <input
            type='text'
            id='phone'
            name='phone'
            className='outline-none w-[60%] h-full group-focus:ring px-3 py-2 '
            placeholder='Phone Number'
          />
        </div>
      </div>

      <div className='w-full flex flex-col gap-1 mt-2 lg:mt-4'>
        <span className='text-lg font-bold relative left-3'>
          Pick a Formation
        </span>
        <Select>
          <SelectTrigger className='w-full px-3 py-2'>
            <span className='line-clamp-1'>Select a Formation</span>
          </SelectTrigger>
        </Select>
      </div>

      <div className='w-full flex flex-col gap-1 mt-2 lg:mt-4'>
        <span className='text-lg font-bold relative left-3'>Choose a Date</span>
        <Select>
          <SelectTrigger className='w-full px-3 py-2'>
            <span className='line-clamp-1'>What's your disposability ?</span>
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
        Reserve a Place Now
      </button>
    </form>
  );
}
