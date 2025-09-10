import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';

export function CalendarDate() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode='single'
      selected={date}
      onSelect={setDate}
      className='rounded-md border shadow-sm w-full'
      captionLayout='dropdown-months'
    />
  );
}
