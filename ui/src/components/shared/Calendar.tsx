import { Calendar } from '@/components/ui/calendar';

interface CalendarOptions {
  date: Date;
  setDate: (date: Date) => void;
}

export function CalendarDate({ date, setDate }: CalendarOptions) {
  return (
    <Calendar
      mode='single'
      selected={date}
      onSelect={(dat) => {
        console.log('new date ====>', dat);
        if (dat) {
          setDate(dat);
        }
      }}
      className='rounded-md border shadow-sm w-full'
      captionLayout='dropdown-months'
    />
  );
}
